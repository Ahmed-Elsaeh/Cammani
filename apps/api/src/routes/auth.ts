import { Router } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { config } from "../config";
import { RegisterSchema, LoginSchema } from "@cammani/shared";
import bcrypt from "bcryptjs";

const router = Router();

function signTokens(userId: string, roles: string[]) {
  const accessToken = jwt.sign({ userId, roles }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign({ userId, roles }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
  return { accessToken, refreshToken };
}

// POST /auth/register
router.post("/register", validate(RegisterSchema), async (req, res) => {
  if (!supabase) {
    res.status(500).json({ success: false, error: "Database configuration missing", details: "SUPABASE_URL or SUPABASE_ANON_KEY not set" });
    return;
  }

  const { email, password, name, role } = req.body;

  const { data: existing, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (checkError) {
    console.error("Supabase error checking existing user:", checkError);
    res.status(500).json({ success: false, error: "Database error during registration check", details: checkError.message });
    return;
  }

  if (existing) {
    res.status(409).json({ success: false, error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { data: user, error: insertError } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      name,
      password_hash: passwordHash,
      roles: [role],
    })
    .select()
    .single();

  if (insertError) {
    console.error("Supabase error creating user:", insertError);
    res.status(500).json({ 
      success: false, 
      error: "Error creating user record", 
      details: insertError.message,
      code: insertError.code 
    });
    return;
  }

  if (!user) {
    res.status(500).json({ success: false, error: "User record was not returned after creation" });
    return;
  }

  const { accessToken, refreshToken } = signTokens(user.id, user.roles || ["buyer"]);
  res.status(201).json({
    success: true,
    data: { accessToken, refreshToken, user: { _id: user.id, email, name, roles: user.roles } },
  });
});

// POST /auth/login
router.post("/login", validate(LoginSchema), async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  const { accessToken, refreshToken } = signTokens(user.id, user.roles);
  res.json({
    success: true,
    data: { accessToken, refreshToken, user: { _id: user.id, email: user.email, name: user.name, roles: user.roles } },
  });
});

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ success: false, error: "Refresh token required" });
    return;
  }
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string; roles: string[] };
    const { accessToken, refreshToken: newRefresh } = signTokens(payload.userId, payload.roles);
    res.json({ success: true, data: { accessToken, refreshToken: newRefresh } });
  } catch {
    res.status(401).json({ success: false, error: "Invalid refresh token" });
  }
});

// POST /auth/logout
router.post("/logout", authenticate, (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, roles, created_at, updated_at")
    .eq("id", req.user!.userId)
    .single();

  if (error || !user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }
  res.json({ success: true, data: { ...user, _id: user.id } });
});

export default router;

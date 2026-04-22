import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { config } from "../config";
import { RegisterSchema, LoginSchema } from "@cammani/shared";

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
  const { email, password, name, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ success: false, error: "Email already registered" });
    return;
  }

  const user = new User({ email, name, passwordHash: password, roles: [role] });
  await user.save();

  const { accessToken, refreshToken } = signTokens(user._id.toString(), user.roles);
  res.status(201).json({
    success: true,
    data: { accessToken, refreshToken, user: { _id: user._id, email, name, roles: user.roles } },
  });
});

// POST /auth/login
router.post("/login", validate(LoginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  const { accessToken, refreshToken } = signTokens(user._id.toString(), user.roles);
  res.json({
    success: true,
    data: { accessToken, refreshToken, user: { _id: user._id, email: user.email, name: user.name, roles: user.roles } },
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

// POST /auth/logout (client just discards tokens; endpoint for future blocklist)
router.post("/logout", authenticate, (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user!.userId).select("-passwordHash");
  if (!user) { res.status(404).json({ success: false, error: "User not found" }); return; }
  res.json({ success: true, data: user });
});

export default router;

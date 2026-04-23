import { createApp } from "../src/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Manual CORS Header Injection (Final Fail-safe)
  res.setHeader('Access-Control-Allow-Origin', 'https://cammani-web.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle OPTIONS preflight manually
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // We have to cast req/res to any to satisfy Express handler signature 
  return app(req as any, res as any);
}

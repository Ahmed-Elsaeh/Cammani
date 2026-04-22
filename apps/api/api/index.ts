import { createApp } from "../src/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // We have to cast req/res to any to satisfy Express handler signature 
  // since VercelRequest/Response slightly differ from standard http.IncomingMessage
  return app(req as any, res as any);
}

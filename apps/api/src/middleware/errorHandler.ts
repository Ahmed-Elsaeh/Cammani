import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  console.error(err);
  
  // Ensure CORS headers are present even in error responses
  const origin = _req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  
  res.status(500).json({ 
    success: false, 
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

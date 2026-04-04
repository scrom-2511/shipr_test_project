import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  sub: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!JWT_SECRET) {
    res.status(500).json({ error: "Server misconfiguration: JWT_SECRET is not set." });
    return;
  }

  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Missing or invalid Authorization header." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded.sub) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
    req.userId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function signToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set.");
  }
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

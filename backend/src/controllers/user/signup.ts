import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { signToken } from "../../middleware/auth.middleware.js";
import User from "../../models/user.model.js";

const SALT_ROUNDS = 10;

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ error: "name, email, and password are required." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name: name.trim(), email: email.trim(), passwordHash });
    const token = signToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err: unknown) {
    if (isDuplicateKeyError(err)) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Could not create account." });
  }
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000;
}

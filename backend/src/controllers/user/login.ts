import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { signToken } from "../../middleware/auth.middleware.js";
import User from "../../models/user.model.js";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email?.trim() || !password) {
      res.status(400).json({ error: "email and password are required." });
      return;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = signToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not log in." });
  }
}
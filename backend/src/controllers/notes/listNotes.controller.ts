import type { Request, Response } from "express";
import Note from "../../models/note.model.js";
import { noteToJson } from "../../utils/noteToJson.util.js";

export async function listNotes(req: Request, res: Response): Promise<void> {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 }).lean();
    res.json(notes.map((n) => noteToJson(n)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load notes." });
  }
}
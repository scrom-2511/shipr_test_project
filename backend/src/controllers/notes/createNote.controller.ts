import type { Request, Response } from "express";
import Note from "../../models/note.model.js";
import { noteToJson } from "../../utils/noteToJson.util.js";

export async function createNote(req: Request, res: Response): Promise<void> {
  try {
    const { title, content } = req.body as { title?: string; content?: string };
    if (!title?.trim() || content === undefined) {
      res.status(400).json({ error: "title and content are required." });
      return;
    }

    const note = await Note.create({
      title: title.trim(),
      content: String(content),
      user: req.userId,
    });
    res.status(201).json(noteToJson(note));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create note." });
  }
}

import type { Request, Response } from "express";
import mongoose from "mongoose";
import Note from "../../models/note.model.js";

function noteToJson(n: {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: n._id.toString(),
    title: n.title,
    content: n.content,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export async function updateNote(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid note id." });
      return;
    }

    const { title, content } = req.body as { title?: string; content?: string };
    const updates: { title?: string; content?: string } = {};
    if (title !== undefined) {
      if (!String(title).trim()) {
        res.status(400).json({ error: "title cannot be empty." });
        return;
      }
      updates.title = String(title).trim();
    }
    if (content !== undefined) {
      updates.content = String(content);
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "Provide title and/or content to update." });
      return;
    }

    const note = await Note.findOneAndUpdate({ _id: id, user: req.userId }, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!note) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    res.json(noteToJson(note));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update note." });
  }
}
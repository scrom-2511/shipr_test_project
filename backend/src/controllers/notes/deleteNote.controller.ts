import type { Request, Response } from "express";
import mongoose from "mongoose";
import Note from "../../models/note.model.js";

export async function deleteNote(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid note id." });
      return;
    }

    const result = await Note.deleteOne({ _id: id, user: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Note not found." });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete note." });
  }
}

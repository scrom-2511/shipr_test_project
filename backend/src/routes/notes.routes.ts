import { Router } from "express";
import { createNote } from "../controllers/notes/createNote.controller.js";
import { deleteNote } from "../controllers/notes/deleteNote.controller.js";
import { listNotes } from "../controllers/notes/listNotes.controller.js";
import { updateNote } from "../controllers/notes/updateNote.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

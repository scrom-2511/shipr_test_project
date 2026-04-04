import { apiFetch } from "./client";
import type { Note } from "./types";

export function fetchNotes(token: string) {
  return apiFetch<Note[]>("/api/notes", { token });
}

export function createNote(token: string, body: { title: string; content: string }) {
  return apiFetch<Note>("/api/notes", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function updateNote(token: string, id: string, body: { title?: string; content?: string }) {
  return apiFetch<Note>(`/api/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export function deleteNote(token: string, id: string) {
  return apiFetch<void>(`/api/notes/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

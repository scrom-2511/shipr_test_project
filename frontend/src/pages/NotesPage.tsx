import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../api/client";
import * as notesApi from "../api/notesApi";
import type { Note } from "../api/types";
import { useAuth } from "../context/AuthContext";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function NotesPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!token) {
      return;
    }
    setListError(null);
    setLoading(true);
    try {
      const data = await notesApi.fetchNotes(token);
      setNotes(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setListError(err instanceof Error ? err.message : "Could not load notes");
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  function selectNote(note: Note) {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setEditorError(null);
  }

  function startNewNote() {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setEditorError(null);
  }

  async function handleSave() {
    if (!token) {
      return;
    }
    setEditorError(null);
    const t = title.trim();
    if (!t) {
      setEditorError("Title is required.");
      return;
    }
    setSaving(true);
    try {
      if (selectedId) {
        const updated = await notesApi.updateNote(token, selectedId, {
          title: t,
          content,
        });
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n)).sort(sortByUpdated),
        );
        selectNote(updated);
      } else {
        const created = await notesApi.createNote(token, { title: t, content });
        setNotes((prev) => [created, ...prev]);
        selectNote(created);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setEditorError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !selectedId) {
      return;
    }
    setEditorError(null);
    setSaving(true);
    try {
      await notesApi.deleteNote(token, selectedId);
      setNotes((prev) => prev.filter((n) => n.id !== selectedId));
      startNewNote();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setEditorError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="notes-app">
      <header className="notes-toolbar">
        <div className="notes-toolbar-inner">
          <h1 className="notes-title">Notes</h1>
          <button type="button" className="btn primary" onClick={startNewNote}>
            New note
          </button>
        </div>
      </header>

      <div className="notes-layout">
        <aside className="notes-list-panel">
          {loading ? <p className="muted">Loading…</p> : null}
          {listError ? <p className="form-error">{listError}</p> : null}
          {!loading && !listError && notes.length === 0 ? (
            <p className="muted">No notes yet. Create one on the right.</p>
          ) : null}
          <ul className="notes-list">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={`notes-list-item${selectedId === n.id ? " active" : ""}`}
                  onClick={() => selectNote(n)}
                >
                  <span className="notes-list-title">{n.title}</span>
                  <span className="notes-list-meta">{formatWhen(n.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="notes-editor-panel">
          <div className="stack-form notes-editor">
            <label className="field">
              <span>Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
              />
            </label>
            <label className="field grow">
              <span>Content</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something…"
                rows={14}
              />
            </label>
            {editorError ? <p className="form-error">{editorError}</p> : null}
            <div className="notes-actions">
              <button type="button" className="btn primary" onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Saving…" : selectedId ? "Save changes" : "Create note"}
              </button>
              {selectedId ? (
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => void handleDelete()}
                  disabled={saving}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function sortByUpdated(a: Note, b: Note) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

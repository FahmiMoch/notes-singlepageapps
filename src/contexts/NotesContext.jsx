import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  getActiveNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from "../utils/api";
import { useAuth } from "./AuthContext";
import { useLocale } from "./LocaleContext";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { authUser } = useAuth();
  const { locale } = useLocale();

  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser) {
      setNotes([]);
      setArchivedNotes([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const [active, archived] = await Promise.all([
          getActiveNotes(),
          getArchivedNotes(),
        ]);
        if (!ignore) {
          setNotes(active || []);
          setArchivedNotes(archived || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch notes:", err);
          setError(err.message || "Failed to fetch notes");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchNotes();
    return () => {
      ignore = true;
    };
  }, [authUser, locale]);

  const handleAddNote = useCallback(async ({ title, body }) => {
    try {
      setError(null);
      const newNote = await addNote({ title, body });
      if (newNote) setNotes((prev) => [newNote, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message || "Failed to add note" };
    }
  }, []);

  const handleDeleteNote = useCallback(async (id) => {
    try {
      setError(null);
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setArchivedNotes((prev) => prev.filter((n) => n.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message || "Failed to delete note",
      };
    }
  }, []);

  const handleArchiveNote = useCallback(async (id) => {
    try {
      setError(null);
      await archiveNote(id);
      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (!note) return prev;
        setArchivedNotes((arch) => [note, ...arch]);
        return prev.filter((n) => n.id !== id);
      });
      return { success: true };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message || "Failed to archive note",
      };
    }
  }, []);

  const handleUnarchiveNote = useCallback(async (id) => {
    try {
      setError(null);
      await unarchiveNote(id);
      setArchivedNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (!note) return prev;
        setNotes((notes) => [note, ...notes]);
        return prev.filter((n) => n.id !== id);
      });
      return { success: true };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message || "Failed to unarchive note",
      };
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      notes,
      archivedNotes,
      loading,
      error,
      addNote: handleAddNote,
      deleteNote: handleDeleteNote,
      archiveNote: handleArchiveNote,
      unarchiveNote: handleUnarchiveNote,
    }),
    [
      notes,
      archivedNotes,
      loading,
      error,
      handleAddNote,
      handleDeleteNote,
      handleArchiveNote,
      handleUnarchiveNote,
    ],
  );

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
}

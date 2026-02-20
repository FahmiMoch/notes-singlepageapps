import { useState, useEffect, useCallback, useRef } from "react";
import { getNotes } from "../utils/api";

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes();
      if (isMounted.current) setNotes(data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err.message);
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();

    return () => {
      isMounted.current = false;
    };
  }, [fetchNotes]);

  return { notes, setNotes, loading, error, refetch: fetchNotes };
}

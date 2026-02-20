import React, { useMemo } from "react";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import "../styles/styles.css";
import { useNotes } from "../contexts/NotesContext";
import { useLocale } from "../contexts/LocaleContext";
import { emptyStateIcons } from "../locales/icons";

const NotesSkeleton = ({ count = 3 }) => (
  <div className="notes-list">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="note-skeleton">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-body" />
        <div className="skeleton skeleton-body short" />
      </div>
    ))}
  </div>
);

export default function Archive() {
  const { archivedNotes, deleteNote, unarchiveNote, loading } = useNotes();
  const { locale, locales } = useLocale();

  const titleText = useMemo(
    () =>
      archivedNotes.length > 0
        ? `${locales[locale].archivesTitle} (${archivedNotes.length})`
        : locales[locale].archivesTitle,
    [archivedNotes.length, locale, locales],
  );

  const archivedNotesList = useMemo(
    () =>
      archivedNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={() => deleteNote(note.id)}
          onArchive={() => unarchiveNote(note.id)}
          aria-label={`Archived note: ${note.title}`}
        />
      )),
    [archivedNotes, deleteNote, unarchiveNote],
  );

  return (
    <section className="notes-section">
      <h2 className="title-notes-section">{titleText}</h2>

      {loading ? (
        <NotesSkeleton count={3} />
      ) : archivedNotes.length > 0 ? (
        <div className="notes-list">{archivedNotesList}</div>
      ) : (
        <EmptyState
          message={locales[locale].noNotes}
          icon={emptyStateIcons.archive}
        />
      )}
    </section>
  );
}

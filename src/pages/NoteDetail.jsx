import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import "../styles/styles.css";
import NotFound from "./NotFound";
import EmptyState from "../components/EmptyState";
import { useNotes } from "../contexts/NotesContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import { showFormattedDate } from "../utils";

function NoteDetailSkeleton() {
  return (
    <section className="note-detail-wrapper">
      <div className="note-detail-card skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-date"></div>
        <div className="skeleton-body"></div>
      </div>
    </section>
  );
}

export default function NoteDetail() {
  const { locale, locales } = useLocale();
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    notes,
    archivedNotes,
    deleteNote,
    archiveNote,
    unarchiveNote,
    loading,
  } = useNotes();

  if (loading) return <NoteDetailSkeleton />;

  const note = [...notes, ...archivedNotes].find((n) => String(n.id) === id);
  if (!note) return <NotFound />;

  const handleAsyncAction = async (action, onSuccess) => {
    const res = await action();
    if (!res.success) alert(res.message || locales[locale].actionFailed);
    else onSuccess?.();
  };

  const handleDelete = () =>
    window.confirm(locales[locale].confirmDelete) &&
    handleAsyncAction(
      () => deleteNote(note.id),
      () => navigate(window.history.length > 1 ? -1 : "/", { replace: true }),
    );

  const handleToggleArchive = () =>
    window.confirm(locales[locale].confirmArchive) &&
    handleAsyncAction(
      () => (note.archived ? unarchiveNote(note.id) : archiveNote(note.id)),
      () => navigate(note.archived ? "/" : "/archives"),
    );

  return (
    <section className={`note-detail-wrapper ${theme}`}>
      <div className="note-detail-card">
        <h2 className="note-detail-title">
          {note.title || locales[locale].emptyTitlePlaceholder}
        </h2>
        <p className="note-detail-date">
          {showFormattedDate(note.createdAt, locale)}
        </p>
        <div className="note-detail-body">
          {note.body?.trim() ? (
            parse(note.body)
          ) : (
            <EmptyState message={locales[locale].noContent} />
          )}
        </div>
      </div>

      <div className="fab-note-detail">
        <button
          className="fab fab-archive"
          title={
            note.archived ? locales[locale].unarchive : locales[locale].archive
          }
          aria-label={
            note.archived ? locales[locale].unarchive : locales[locale].archive
          }
          onClick={handleToggleArchive}
        >
          <i className="fas fa-box-archive"></i>
        </button>
        <button
          className="fab fab-delete"
          title={locales[locale].delete}
          aria-label={locales[locale].delete}
          onClick={handleDelete}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </section>
  );
}

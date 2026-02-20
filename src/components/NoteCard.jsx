import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { showFormattedDate } from "../utils";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import locales from "../locales/locales";

export default function NoteCard({ note, onDelete, onArchive }) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = locales[locale] || locales.id;
  const MAX_PREVIEW = 100;

  const stripTags = (html) => html.replace(/<[^>]*>?/gm, "");

  const previewBody = useMemo(() => {
    const rawBody = stripTags(note.body?.trim() || "");
    return rawBody.length > MAX_PREVIEW
      ? `${rawBody.slice(0, MAX_PREVIEW)}...`
      : rawBody || t.noContent;
  }, [note.body, t.noContent]);

  const handleArchive = () => {
    if (!onArchive) return;
    const actionText = note.archived ? t.unarchive : t.archive;
    if (window.confirm(`${t.confirmArchive} (${actionText})`)) {
      onArchive(note.id);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(t.confirmDelete)) {
      onDelete(note.id);
    }
  };

  return (
    <div className={`note-card ${theme}`}>
      <h3>
        <Link
          to={`/notes/${note.id}`}
          className="note-title"
          aria-label={`${t.previewLabel} ${note.title}`}
        >
          {note.title || t.emptyTitlePlaceholder}
        </Link>
      </h3>

      <p className="note-date">
        <time
          dateTime={note.createdAt}
          aria-label={`${t.previewLabel} ${showFormattedDate(note.createdAt, locale)}`}
        >
          {showFormattedDate(note.createdAt, locale)}
        </time>
      </p>

      <p className="note-body" aria-live="polite">
        {previewBody}
      </p>

      {(onDelete || onArchive) && (
        <div className="note-card-actions">
          {onArchive && (
            <button
              className="fab fab-archive"
              onClick={handleArchive}
              title={note.archived ? t.unarchive : t.archive}
              aria-label={note.archived ? t.unarchive : t.archive}
              aria-pressed={note.archived}
            >
              <i className="fa-solid fa-box-archive"></i>
            </button>
          )}
          {onDelete && (
            <button
              className="fab fab-delete"
              onClick={handleDelete}
              title={t.delete}
              aria-label={t.delete}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    archived: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
};

NoteCard.defaultProps = {
  onDelete: null,
  onArchive: null,
};

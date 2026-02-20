import React from "react";
import { NavLink } from "react-router-dom";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import { useTheme } from "../contexts/ThemeContext";
import { useLocale } from "../contexts/LocaleContext";
import locales from "../locales/locales";
import { showFormattedDate } from "../utils";

export default function NoteItem({ note, onDelete, onArchive }) {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const t = locales[locale] || locales.id;
  const icons = t.emptyStateIcons || {};

  const formattedDate = showFormattedDate(note.createdAt, locale);

  const previewBody = note.body?.trim() ? (
    parse(note.body)
  ) : (
    <p className="notes-not-ready">{t.noContent}</p>
  );

  const handleDelete = () => onDelete?.(note.id);
  const handleArchive = () => onArchive?.(note.id);

  return (
    <div className={`note-card ${theme}`}>
      <NavLink to={`/notes/${note.id}`} className="note-title-link">
        <div className="note-title">
          {note.title || t.emptyTitlePlaceholder}
        </div>
      </NavLink>

      <div className="note-date">
        <time
          dateTime={note.createdAt}
          aria-label={`${t.previewLabel} ${formattedDate}`}
        >
          {formattedDate}
        </time>
      </div>

      <div className="note-body">{previewBody}</div>
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
              <i className={icons.archive || "fa-solid fa-box-archive"}></i>
            </button>
          )}
          {onDelete && (
            <button
              className="fab fab-delete"
              onClick={handleDelete}
              title={t.delete}
              aria-label={t.delete}
            >
              <i className={icons.delete || "fa-solid fa-trash"}></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    body: PropTypes.string,
    archived: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
};

NoteItem.defaultProps = {
  onDelete: null,
  onArchive: null,
};

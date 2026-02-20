import React from "react";
import PropTypes from "prop-types";
import NoteItem from "./NoteItem";
import EmptyState from "./EmptyState";
import { useTheme } from "../contexts/ThemeContext";
import { useLocale } from "../contexts/LocaleContext";
import locales from "../locales/locales";

export default function NoteList({ notes, onDelete, onArchive }) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = locales[locale] || locales.id;
  const icons = t.emptyStateIcons || {};

  if (!notes.length) {
    return (
      <EmptyState
        message={t.noNotesHere}
        icon={icons.list || "fa-solid fa-list"}
      />
    );
  }

  return (
    <div className={`notes-list ${theme}`}>
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      body: PropTypes.string,
      archived: PropTypes.bool,
      createdAt: PropTypes.string.isRequired,
    }),
  ),
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
};

NoteList.defaultProps = {
  notes: [],
  onDelete: null,
  onArchive: null,
};

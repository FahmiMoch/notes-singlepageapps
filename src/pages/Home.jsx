import React, { useState, useMemo } from "react";
import "../styles/styles.css";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import FabHome from "../components/FabHome";
import FabLeft from "../components/FabLeft";
import { useNotes } from "../contexts/NotesContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";

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

const getFilteredNotes = (notes, query) =>
  notes.filter(
    (note) =>
      !note.archived &&
      note.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

export default function Home() {
  const { notes, loading } = useNotes();
  const { locale, locales } = useLocale();
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const filteredActiveNotes = useMemo(
    () => getFilteredNotes(notes, searchValue),
    [notes, searchValue],
  );

  const titleText = useMemo(() => {
    if (loading) return locales[locale].homeTitle;
    if (searchValue.trim())
      return `${locales[locale].searchResultsFor} "${searchValue.trim()}" (${filteredActiveNotes.length})`;
    if (filteredActiveNotes.length)
      return `${locales[locale].homeTitle} (${filteredActiveNotes.length})`;
    return locales[locale].noNotes;
  }, [loading, searchValue, filteredActiveNotes.length, locale, locales]);

  const icons = locales[locale].emptyStateIcons;

  return (
    <div className={`app-container ${theme}`}>
      <header className="logo">
        <div className="logo-wrapper">
          <img
            src="/sticky-note.png"
            alt={`${locales[locale].homeTitle} Logo`}
            className="logo-img"
          />
          <h3>{locales[locale].homeTitle}</h3>
        </div>

        <input
          type="text"
          aria-label={locales[locale].searchPlaceholder}
          placeholder={locales[locale].searchPlaceholder}
          className="search-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <FabLeft />
      </header>

      <section className="notes-section">
        <h2 className="title-notes-section">{titleText}</h2>

        {loading ? (
          <NotesSkeleton count={3} />
        ) : filteredActiveNotes.length ? (
          <div className="notes-list">
            {filteredActiveNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              searchValue.trim()
                ? locales[locale].noSearchResults
                : locales[locale].noNotes
            }
            icon={searchValue.trim() ? icons.search : icons.home}
          />
        )}
      </section>

      <FabHome aria-label={locales[locale].homeButton} />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
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

export default function Search() {
  const { notes, loading } = useNotes();
  const { locale, locales } = useLocale();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const filteredNotes = notes.filter(
    (note) =>
      !note.archived &&
      note.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim()) setSearchParams({ q: searchValue.trim() });
      else setSearchParams({});
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, setSearchParams]);

  const titleText = searchValue
    ? `${locales[locale].searchResultsFor} "${searchValue}" (${filteredNotes.length})`
    : locales[locale].homeTitle;

  const icons = locales[locale].emptyStateIcons;

  return (
    <div className={`app-container ${theme}`}>
      <header className="search-header">
        <button
          className="fab fab-back"
          aria-label={locales[locale].homeButton}
          title={locales[locale].homeButton}
          onClick={() => navigate("/")}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <input
          type="text"
          className="search-input"
          placeholder={locales[locale].searchPlaceholder}
          aria-label={locales[locale].searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoFocus
        />
      </header>

      <section className="notes-section">
        <h2 className="title-notes-section">{titleText}</h2>

        {loading ? (
          <NotesSkeleton count={3} />
        ) : filteredNotes.length > 0 ? (
          <div className="notes-list">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              searchValue
                ? locales[locale].noSearchResults
                : locales[locale].noNotesHere
            }
            icon={searchValue ? icons.search : icons.home}
          />
        )}
      </section>
    </div>
  );
}

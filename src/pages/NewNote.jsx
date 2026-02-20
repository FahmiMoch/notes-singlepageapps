import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import NoteInput from "../components/NoteInput";
import NotePreview from "../components/NotePreview";
import NoteFormActions from "../components/NoteFormActions";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";

export default function NewNote() {
  const { addNote } = useNotes();
  const [previewData, setPreviewData] = useState({ title: "", body: "" });
  const formRef = useRef(null);
  const navigate = useNavigate();

  const { locale, locales } = useLocale();
  const { theme } = useTheme();

  const hasPreviewContent = previewData.title.trim() || previewData.body.trim();

  const getNoteData = useCallback(
    ({ title, body }) => ({
      title: title.trim() || locales[locale].untitledNote,
      body: body.trim() || locales[locale].noContent,
    }),
    [locale, locales],
  );

  const handleAddNote = useCallback(
    ({ title, body }) => {
      if (!title.trim() && !body.trim()) return;

      addNote(getNoteData({ title, body }));
      handleReset();
      navigate("/");
    },
    [addNote, getNoteData, navigate],
  );

  const handleReset = useCallback(() => {
    setPreviewData({ title: "", body: "" });
    formRef.current?.reset();
  }, []);

  return (
    <>
      <section className={`note-form-section ${theme}`}>
        <div className="note-image-container">
          <img
            src="/form-picture.jpg"
            alt={locales[locale].newNoteIllustrationAlt}
            className="note-image"
          />
        </div>

        <div className="note-form-wrapper">
          <NoteInput
            ref={formRef}
            onSubmit={handleAddNote}
            onChangePreview={(title, body) => setPreviewData({ title, body })}
            autoFocusTitle
          />
        </div>
      </section>

      {hasPreviewContent && <NotePreview {...previewData} theme={theme} />}

      <NoteFormActions
        onSave={() => formRef.current?.requestSubmit()}
        onReset={handleReset}
        disabled={!hasPreviewContent}
        theme={theme}
      />
    </>
  );
}

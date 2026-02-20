import React, { useState, forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/styles.css";

const NoteInput = forwardRef(function NoteInput(
  { onChangePreview, onSubmit, autoFocusTitle = false },
  ref,
) {
  const { locale, locales } = useLocale();
  const t = locales[locale] || locales.id;
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const bodyRef = useRef(null);
  const maxTitleLength = 50;

  const stripTags = (html) => html.replace(/<[^>]*>?/gm, "");

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, maxTitleLength);
    setTitle(value);
    onChangePreview(value, stripTags(bodyRef.current?.innerHTML || ""));
  };

  const handleBodyInput = (e) => {
    const value = e.currentTarget.innerHTML;
    onChangePreview(title, stripTags(value));
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      ref.current?.requestSubmit?.();
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    updateToolbarState();
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert(t.alertLink);
      return;
    }
    const url = window.prompt(t.insertLink);
    if (url) {
      const formattedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      document.execCommand("createLink", false, formattedUrl);
      updateToolbarState();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(t.emptyTitle);
      return;
    }

    const plainText = bodyRef.current?.innerText || "";
    if (!plainText.trim()) {
      alert(t.emptyBody);
      return;
    }

    onSubmit?.({
      title: title.trim(),
      body: bodyRef.current?.innerHTML.trim(),
    });

    setTitle("");
    if (bodyRef.current) bodyRef.current.innerHTML = "";
    onChangePreview("", "");
  };

  const updateToolbarState = () => {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbarState);
    return () =>
      document.removeEventListener("selectionchange", updateToolbarState);
  }, []);

  return (
    <form
      ref={ref}
      className={`note-input-form ${theme}`}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      onReset={(e) => {
        e.preventDefault();
        setTitle("");
        if (bodyRef.current) bodyRef.current.innerHTML = "";
        onChangePreview("", "");
      }}
    >
      <input
        className="input-character"
        type="text"
        placeholder={t.titlePlaceholder}
        value={title}
        onChange={handleTitleChange}
        autoFocus={autoFocusTitle}
        aria-label={t.titlePlaceholder}
      />
      <p
        className={`char-counter ${
          title.length === maxTitleLength
            ? "error"
            : title.length >= maxTitleLength - 10
              ? "warning"
              : ""
        }`}
      >
        {title.length}/{maxTitleLength} {t.charCount}
      </p>

      <div
        className={`editor-toolbar ${theme}`}
        role="toolbar"
        aria-label={t.editorToolbar || "Toolbar Editor"}
      >
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          aria-label={t.bold}
          aria-pressed={formats.bold}
          className={`fab ${formats.bold ? "active" : ""}`}
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          aria-label={t.italic}
          aria-pressed={formats.italic}
          className={`fab ${formats.italic ? "active" : ""}`}
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("underline")}
          aria-label={t.underline}
          aria-pressed={formats.underline}
          className={`fab ${formats.underline ? "active" : ""}`}
        >
          <i className="fas fa-underline"></i>
        </button>
        <button
          type="button"
          onClick={handleInsertLink}
          aria-label={t.insertLink}
          aria-pressed="false"
          className="fab"
        >
          <i className="fas fa-link"></i>
        </button>
      </div>

      <div
        ref={bodyRef}
        className={`note-input-body ${theme}`}
        contentEditable
        role="textbox"
        aria-label={t.bodyPlaceholder}
        aria-multiline="true"
        data-placeholder={t.bodyPlaceholder}
        onInput={handleBodyInput}
        onClick={updateToolbarState}
        suppressContentEditableWarning
      />
    </form>
  );
});

NoteInput.propTypes = {
  onChangePreview: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  autoFocusTitle: PropTypes.bool,
};

export default NoteInput;

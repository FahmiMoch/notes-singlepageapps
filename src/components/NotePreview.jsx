import React, { useMemo } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { showFormattedDate } from "../utils";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";

export default function NotePreview({ title = "", body = "" }) {
  const { locale, locales } = useLocale();
  const { theme } = useTheme();
  const t = locales[locale] || locales.id;

  const today = useMemo(() => new Date().toISOString(), []);

  return (
    <section className={`note-preview ${theme}`} aria-label={t.previewLabel}>
      <h3 className="preview-text">
        <i className="fa-solid fa-eye" aria-hidden="true"></i> {t.previewLabel}
      </h3>

      <div className="preview-card">
        <h4 className="preview-title">{title || t.emptyTitlePlaceholder}</h4>
        <p className="preview-date">{showFormattedDate(today, locale)}</p>
        <div className="preview-body">
          {body.trim() ? (
            parse(body)
          ) : (
            <p className="notes-not-ready">{t.noContent}</p>
          )}
        </div>
      </div>
    </section>
  );
}

NotePreview.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

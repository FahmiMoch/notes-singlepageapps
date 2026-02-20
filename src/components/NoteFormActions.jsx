import React from "react";
import PropTypes from "prop-types";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import locales from "../locales/locales";

export default function NoteFormActions({ onSave, onReset, disabled }) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = locales[locale] || locales.id;

  const handleReset = () => {
    if (!onReset) return;
    if (window.confirm(t.confirmReset || "Yakin ingin mereset form?")) {
      onReset();
    }
  };

  return (
    <div className={`note-form-actions ${theme}`}>
      <button
        type="button"
        className="fab fab-save"
        title={t.saveButton || "Simpan"}
        onClick={onSave}
        disabled={disabled}
      >
        <i className="fa-solid fa-check" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        className="fab fab-reset"
        title={t.resetButton || "Reset"}
        onClick={handleReset}
      >
        <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
      </button>
    </div>
  );
}

NoteFormActions.propTypes = {
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

NoteFormActions.defaultProps = {
  disabled: false,
};

import React from "react";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";

export default function NotFound() {
  const { locale, locales } = useLocale();
  const { theme } = useTheme();

  return (
    <main className={`not-found ${theme}`} aria-labelledby="notfound-title">
      <div className="not-found-card">
        <h1 id="notfound-title" className="not-found-title">
          404
        </h1>
        <h2 className="not-found-subtitle">{locales[locale].notFoundTitle}</h2>
        <p className="not-found-message">
          <i
            className="fa-solid fa-circle-exclamation"
            role="img"
            aria-label={locales[locale].notFoundMessage}
          ></i>{" "}
          {locales[locale].notFoundMessage}
        </p>
      </div>
    </main>
  );
}

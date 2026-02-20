import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import locales from "../locales/locales";

export default function Navigation() {
  const location = useLocation();
  const { locale } = useLocale();
  const { theme } = useTheme();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);
  const navItems = useMemo(
    () => [
      {
        path: "/",
        icon: "fa-solid fa-house",
        label: locales[locale].homeTitle,
        fabClass: "fab-home",
      },
      {
        path: "/notes/new",
        icon: "fa-solid fa-plus",
        label: locales[locale].addNote,
        fabClass: "fab-new",
      },
      {
        path: "/archives",
        icon: "fa-solid fa-box-archive",
        label: locales[locale].archivesTitle,
        fabClass: "fab-archive",
      },
    ],
    [locale, locales],
  );

  return (
    <nav
      className={`fab-container ${theme}`}
      role="navigation"
      aria-label="Navigasi Utama"
    >
      {navItems.map(({ path, icon, label, fabClass }) => (
        <Link
          key={path}
          to={path}
          className={`fab ${fabClass} ${isActive(path) ? "fab-active" : ""}`}
          title={label}
          aria-label={label}
          aria-current={isActive(path) ? "true" : undefined}
        >
          <i className={icon} aria-hidden="true"></i>
        </Link>
      ))}
    </nav>
  );
}

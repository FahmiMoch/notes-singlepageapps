import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import locales from "../locales/locales";

export default function FabHome() {
  const location = useLocation();
  const { locale } = useLocale();
  const { theme } = useTheme();

  const navItems = [
    { path: "/", icon: "fa-solid fa-house", label: locales[locale].homeTitle },
    {
      path: "/notes/new",
      icon: "fa-solid fa-plus",
      label: locales[locale].addNote,
    },
    {
      path: "/archives",
      icon: "fa-solid fa-box-archive",
      label: locales[locale].archivesTitle,
    },
  ];

  const typeMap = {
    "/": "fab-home",
    "/notes/new": "fab-new",
    "/archives": "fab-archive",
  };

  return (
    <nav
      className={`fab-container ${theme}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      {navItems.map(({ path, icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`fab ${typeMap[path]} ${
            location.pathname === path ? "active" : ""
          }`}
          aria-label={label}
          aria-current={location.pathname === path ? "page" : undefined}
        >
          <i className={icon} aria-hidden="true"></i>
        </Link>
      ))}
    </nav>
  );
}

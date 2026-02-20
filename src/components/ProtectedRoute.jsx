import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLocale } from "../contexts/LocaleContext";
import locales from "../locales/locales";
import "../styles/styles.css";

export default function ProtectedRoute() {
  const { authUser, loading } = useContext(AuthContext);
  const { theme } = useTheme();
  const { locale } = useLocale();
  const t = locales[locale] || locales.id;

  if (loading) {
    return (
      <div
        className={`spinner-wrapper ${theme}`}
        role="status"
        aria-label={t.loading || "Memuat..."}
      >
        <div className={`spinner ${theme}`}></div>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

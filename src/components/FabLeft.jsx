import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLocale } from "../contexts/LocaleContext";
import locales from "../locales/locales";

export default function FabLeft() {
  const { authUser, logout } = React.useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useLocale();
  const navigate = useNavigate();

  const themeLabel =
    theme === "light"
      ? locales[locale].themeToggleLight || "Switch to dark theme"
      : locales[locale].themeToggleDark || "Switch to light theme";

  const handleLogout = React.useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleThemeToggle = React.useCallback(
    () => toggleTheme(),
    [toggleTheme],
  );
  const handleLocaleToggle = React.useCallback(
    () => toggleLocale(),
    [toggleLocale],
  );

  return (
    <div className={`fab-container-left ${theme}`}>
      <button
        onClick={handleThemeToggle}
        className="fab fab-theme"
        title={themeLabel}
        aria-label={themeLabel}
      >
        <i
          className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}
          aria-hidden="true"
        ></i>
      </button>
      <button
        onClick={handleLocaleToggle}
        className="fab fab-language"
        title={locales[locale].languageToggle || "Switch language"}
        aria-label={locales[locale].languageToggle || "Switch language"}
      >
        <i className="fa-solid fa-language" aria-hidden="true"></i>
      </button>
      {authUser ? (
        <>
          <button
            onClick={handleLogout}
            className="fab fab-logout"
            title={locales[locale].logout || "Logout"}
            aria-label={locales[locale].logout || "Logout"}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              aria-hidden="true"
            ></i>
          </button>
          <div
            className="fab fab-user"
            data-name={authUser.name}
            title={`Login sebagai ${authUser.name}`}
            aria-label={`User: ${authUser.name}`}
            role="status"
            aria-live="polite"
            tabIndex={0}
          >
            <i className="fa-solid fa-user" aria-hidden="true"></i>
          </div>
        </>
      ) : (
        <Link
          to="/login"
          className="fab fab-login"
          title={locales[locale].loginButton || "Login"}
          aria-label={locales[locale].loginButton || "Login"}
        >
          <i className="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
        </Link>
      )}
    </div>
  );
}

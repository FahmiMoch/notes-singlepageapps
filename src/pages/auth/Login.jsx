import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheme } from "../../contexts/ThemeContext";
import locales from "../../locales/locales";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { locale } = useLocale();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const t = locales[locale];

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email.includes("@")) {
      setError(t.invalidEmail);
      return;
    }

    if (password.length < 6) {
      setError(t.shortPassword);
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || t.loginFailed || "Login failed, try again.");
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <h2>{t.loginTitle}</h2>
      {error && (
        <p className="auth-error" aria-live="polite">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            {t.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t.emailPlaceholder}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">{t.passwordLabel}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t.passwordPlaceholder}
            required
          />
        </div>

        <div className="auth-fab-group">
          <button
            type="submit"
            disabled={loading}
            className="fab-login fab-hover"
            aria-busy={loading}
          >
            <i className="fa-solid fa-right-to-bracket"></i>{" "}
            {loading ? t.loading : t.loginButton}
          </button>

          <Link to="/register" className="fab-register fab-hover">
            <i className="fa-solid fa-user-plus"></i>
            {t.registerButton}
          </Link>
        </div>
      </form>
    </div>
  );
}

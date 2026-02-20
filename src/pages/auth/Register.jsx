import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocale } from "../../contexts/LocaleContext";
import { useTheme } from "../../contexts/ThemeContext";
import locales from "../../locales/locales";

export default function Register() {
  const { register } = useContext(AuthContext);
  const { locale } = useLocale();
  const { theme } = useTheme();
  const t = locales[locale];
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name) {
      setError(t.emptyName);
      return;
    }

    if (!email.includes("@")) {
      setError(t.invalidEmail);
      return;
    }

    if (password.length < 6) {
      setError(t.shortPassword);
      return;
    }

    setLoading(true);
    const result = await register({ name, email, password });
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(
        result.message ||
          (locale === "id"
            ? "Register gagal, coba lagi."
            : "Register failed, try again."),
      );
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <h2>{t.registerTitle}</h2>
      {error && (
        <p className="auth-error" aria-live="polite">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="name">{t.nameLabel}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">{t.emailLabel}</label>
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
            className="fab-register fab-hover"
            aria-busy={loading}
          >
            <i className="fa-solid fa-right-to-bracket"></i>{" "}
            {loading ? t.loading : t.registerButton}
          </button>

          <Link to="/login" className="fab-login fab-hover">
            <i className="fa-solid fa-user-plus"></i>
            {t.loginButton}
          </Link>
        </div>
      </form>
    </div>
  );
}

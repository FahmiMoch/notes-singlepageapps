import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import locales from "../locales/locales";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      const saved = localStorage.getItem("appLocale");
      return saved === "id" || saved === "en" ? saved : "id";
    } catch {
      return "id";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("appLocale", locale);
    } catch (err) {
      console.error("Failed to save locale:", err);
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const contextValue = useMemo(
    () => ({ locale, toggleLocale, locales }),
    [locale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

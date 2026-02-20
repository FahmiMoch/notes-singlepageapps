import React from "react";
import PropTypes from "prop-types";
import { AuthProvider } from "./AuthContext";
import { NotesProvider } from "./NotesContext";
import { ThemeProvider } from "./ThemeContext";
import { LocaleProvider } from "./LocaleContext";

export default function RootProvider({ children }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <NotesProvider>{children}</NotesProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

RootProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../contexts/ThemeContext";

export default function EmptyState({ message, icon }) {
  const { theme } = useTheme();

  return (
    <div
      className={`empty-state empty-state--${theme}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {icon && (
        <i className={`${icon} empty-icon`} role="img" title={message} />
      )}
      <p className="empty-message">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

EmptyState.defaultProps = {
  icon: "fa-solid fa-circle-exclamation",
};

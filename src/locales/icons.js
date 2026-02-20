export const emptyStateIcons = {
  home: "fa-solid fa-house-circle-exclamation",
  search: "fa-solid fa-magnifying-glass",
  archive: "fa-solid fa-box-archive",
  note: "fa-solid fa-sticky-note",
  newNote: "fa-solid fa-plus-circle",
  error: "fa-solid fa-circle-exclamation",
};

export const fabIcons = {
  home: "fa-solid fa-house",
  newNote: "fa-solid fa-plus",
  archive: "fa-solid fa-box-archive",
  login: "fa-solid fa-right-to-bracket",
  logout: "fa-solid fa-right-from-bracket",
  register: "fa-solid fa-user-plus",
  user: "fa-solid fa-user",
  themeLight: "fa-solid fa-sun",
  themeDark: "fa-solid fa-moon",
  language: "fa-solid fa-language",
};

export const getIcon = (icons, key) =>
  icons[key] || "fa-solid fa-circle-question";

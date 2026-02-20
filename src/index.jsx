import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/styles.css";
import RootProvider from "./contexts/RootProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </React.StrictMode>,
);

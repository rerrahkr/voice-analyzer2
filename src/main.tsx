import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const root = document.getElementById("root");

if (root !== null) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  );
}

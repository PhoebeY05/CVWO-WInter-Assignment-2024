import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Render the React app
document.addEventListener("turbo:load", () => {
  // Render navigation bar
  const root = createRoot(
    document.body.appendChild(document.createElement("div"))
  );
  // Render respective component
  root.render(<BrowserRouter><Navbar /></BrowserRouter>);
  const app = createRoot(
    document.body.appendChild(document.createElement("div"))
  )
  app.render(<App />);

});
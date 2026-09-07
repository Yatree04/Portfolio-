import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PAPER_TEXTURE_URL } from "./lib/paper";

// Baked once, then used as a plain background-image by every card.
document.documentElement.style.setProperty(
  "--paper-texture",
  PAPER_TEXTURE_URL,
);

const container = document.getElementById("root");
if (!container) throw new Error("#root is missing from index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

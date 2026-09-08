import { createRoot } from "react-dom/client";
import { SiteRibbons } from "./components/SiteRibbons";

/**
 * Mounts the ribbons on the plain-HTML pages (works, playground, about,
 * résumé), which have no React root to hang them from. The React routes
 * render <SiteRibbons /> inside their own tree instead.
 */
const host = document.createElement("div");
host.id = "ribbons-root";
document.body.appendChild(host);
createRoot(host).render(<SiteRibbons />);

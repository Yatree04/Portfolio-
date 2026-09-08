import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SiteRibbons } from "./components/SiteRibbons";
import { Onboarding } from "./sections/onboarding";
import { PAPER_TEXTURE_URL } from "./sections/onboarding/lib/paper";
import { WORKS_URL } from "./routes";

/**
 * `/mailbox/` — the pile of letters on its own route, reached from the site's
 * nav rather than by writing a card. It mounts the onboarding section straight
 * into its gallery phase; back leaves for the site, not for the door.
 */
document.documentElement.style.setProperty(
  "--paper-texture",
  PAPER_TEXTURE_URL,
);

const container = document.getElementById("root");
if (!container) throw new Error("#root is missing from mailbox/index.html");

const leaveForSite = () => {
  window.location.href = WORKS_URL;
};

createRoot(container).render(
  <StrictMode>
    <main className="h-full w-full">
      <section className="relative h-full w-full overflow-hidden">
        <Onboarding
          initialPhase="gallery"
          onExit={leaveForSite}
          onAdvance={leaveForSite}
        />
      </section>
    </main>
    <SiteRibbons />
  </StrictMode>,
);

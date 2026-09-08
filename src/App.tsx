import { useCallback } from "react";
import { SECTIONS } from "./sections/registry";
import { WORKS_URL } from "./routes";

/**
 * The site shell. Sections are full-viewport panels stacked in a scroll-snap
 * column; today there is exactly one — onboarding — and everything else the
 * portfolio grows gets appended to the registry.
 */
export default function App() {
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  return (
    <main className="h-full w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
      {SECTIONS.map(({ id, Component }, index) => {
        const next = SECTIONS[index + 1];
        return (
          <section
            key={id}
            id={id}
            className="relative h-full w-full snap-start overflow-hidden"
          >
            {/* Past the last section the site continues as its own pages. */}
            <Component
              onAdvance={
                next
                  ? () => scrollToSection(next.id)
                  : () => {
                      window.location.href = WORKS_URL;
                    }
              }
            />
          </section>
        );
      })}
    </main>
  );
}

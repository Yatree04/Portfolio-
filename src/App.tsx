import { SECTIONS } from "./sections/registry";

/**
 * The site shell. Sections are full-viewport panels stacked in a scroll-snap
 * column; today there is exactly one — onboarding — and everything else the
 * portfolio grows gets appended to the registry.
 */
export default function App() {
  return (
    <main className="h-full w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
      {SECTIONS.map(({ id, Component }) => (
        <section
          key={id}
          id={id}
          className="relative h-full w-full snap-start overflow-hidden"
        >
          <Component />
        </section>
      ))}
    </main>
  );
}

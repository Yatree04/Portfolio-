import { useEffect, useRef } from "react";
import Ribbons from "./reactbits/Ribbons";

/**
 * The React Bits <Ribbons> component, with the settings the design calls for.
 *
 * Two things the site needs on top of the component itself:
 *
 * - Its container is what the canvas sizes against. Here that is the viewport,
 *   not the 1080x1080 box the component's own demo uses, so the ribbon can
 *   follow the pointer across a whole page.
 * - That container has to ignore the pointer, or the overlay would swallow
 *   every click on the site. The component listens for `mousemove` on the
 *   container, which then never fires, so the events are forwarded from the
 *   window instead. The handler reads clientX/clientY against the container's
 *   rect, and the rect is the viewport, so the coordinates carry over as they
 *   are.
 */
export function SiteRibbons() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const forward = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = host.querySelector(".ribbons-container");
      if (!target) return;
      target.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: event.clientX,
          clientY: event.clientY,
          bubbles: false,
        }),
      );
    };

    window.addEventListener("pointermove", forward, { passive: true });
    return () => window.removeEventListener("pointermove", forward);
  }, []);

  return (
    <div
      ref={hostRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2147482000,
      }}
    >
      {/* Ribbons.css is emitted as its own file, which a page that loads only
          the bundle never links; without the sizing the canvas comes out 0x0.
          Same two rules, carried with the component. */}
      <style>{".ribbons-container{width:100%;height:100%;position:relative}"}</style>
      {/* baseSpring and baseFriction are the component's defaults rather than
          0.01 / 0.5. At those two values the head creeps forward by about
          0.02 of the distance each frame, the points bunch closer together
          than the 0.02 the vertex shader needs
          (`normal *= smoothstep(0.0, 0.02, dist)`), the thickness is
          multiplied by zero and nothing is drawn. Everything else is as
          specified. */}
      <Ribbons
        colors={["#351f5e"]}
        baseSpring={0.03}
        baseFriction={0.9}
        baseThickness={20}
        offsetFactor={0.05}
        maxAge={550}
        pointCount={45}
        speedMultiplier={0.6}
        enableFade
        enableShaderEffect={false}
        effectAmplitude={0}
      />
    </div>
  );
}

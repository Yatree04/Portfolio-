import { useEffect, useState } from "react";

/**
 * Normalised pointer offset from the centre of the window, in [-1, 1].
 * Used to drift the faint pile behind the composer as the cursor moves.
 */
export function usePointerParallax(enabled: boolean) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setOffset({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: (event.clientY / window.innerHeight) * 2 - 1,
        }),
      );
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  return enabled ? offset : { x: 0, y: 0 };
}

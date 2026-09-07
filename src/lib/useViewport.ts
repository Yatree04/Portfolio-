import { useEffect, useState } from "react";

export interface Viewport {
  width: number;
  height: number;
}

/** Viewport size, tracked for the pile's fit-to-screen scaling. */
export function useViewport(): Viewport {
  const [size, setSize] = useState<Viewport>(() => ({
    width: typeof window === "undefined" ? 1440 : window.innerWidth,
    height: typeof window === "undefined" ? 1024 : window.innerHeight,
  }));

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setSize({ width: window.innerWidth, height: window.innerHeight }),
      );
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

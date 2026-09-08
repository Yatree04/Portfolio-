import { useEffect, useRef, useState } from "react";

/**
 * Types `text` out one character at a time. Respects reduced-motion by
 * skipping straight to the finished string.
 */
export function useTypewriter(
  text: string,
  { speed = 42, startDelay = 0, enabled = true } = {},
) {
  const [typed, setTyped] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setTyped("");
      doneRef.current = false;
      return;
    }

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) {
      setTyped(text);
      doneRef.current = true;
      return;
    }

    setTyped("");
    doneRef.current = false;
    let index = 0;
    let interval = 0;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setTyped(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(interval);
          doneRef.current = true;
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, speed, startDelay, enabled]);

  return { typed, done: typed.length >= text.length };
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CARD_H, CARD_W } from "../lib/layout";

export interface LoaderProps {
  onDone: () => void;
}

/** Long enough to read as a shuffle, short enough not to be a wait. */
const MIN_DURATION = 1400;
const DECK = [0, 1, 2, 3, 4];

/**
 * The deck riffling itself between "I'll write one" and the blank card
 * arriving. It doubles as the gate on the handwriting font: the composer never
 * appears before the face it is set in has loaded.
 */
export function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let raf = 0;

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    let ready = false;
    void fontsReady.then(() => {
      ready = true;
    });

    const tick = () => {
      const elapsed = performance.now() - started;
      // Creeps towards 90% on time alone; only the fonts landing finishes it.
      const timed = Math.min(0.9, elapsed / MIN_DURATION);
      const next = ready && elapsed >= MIN_DURATION ? 1 : timed;
      setProgress(next);
      if (next >= 1) {
        window.setTimeout(onDone, 340);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 z-[120] flex flex-col items-center justify-center gap-14 bg-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="relative"
        style={{ width: CARD_W * 0.44, height: CARD_H * 0.44 }}
      >
        {DECK.map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ rotate: 0, y: 0, x: 0 }}
            animate={{
              rotate: [0, (i - 2) * 7, 0],
              x: [0, (i - 2) * 26, 0],
              y: [0, -Math.abs(i - 2) * 9, 0],
            }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.09,
            }}
          >
            <div
              className="card-surface"
              style={{
                transform: `scale(0.44)`,
                boxShadow: "0 8px 20px -14px rgba(60,50,10,.6)",
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex w-[220px] flex-col items-center gap-3">
        <div className="h-px w-full bg-black/15">
          <div
            className="h-px bg-black/75 transition-[width] duration-200 ease-linear"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="text-[12px] tracking-[0.14em] text-black/55 uppercase">
          shuffling the pile
        </p>
      </div>
    </motion.div>
  );
}

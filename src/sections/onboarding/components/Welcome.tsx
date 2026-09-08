import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTypewriter } from "../lib/useTypewriter";

export interface WelcomeProps {
  onBegin: () => void;
  /** Leaves the intro without writing anything. Also bound to Escape. */
  onSkip: () => void;
  /** What skipping actually lands you on, so the link can say so. */
  skipLabel: string;
  /** How many notes are already lying in the pile behind this. */
  noteCount: number;
}

const LINE_ONE = "hi, welcome to my world.";
const LINE_TWO = "leave me something to ponder over.";

/**
 * The doorway. Two typed lines, then Enter drops you into the composer — or
 * Escape, for anyone who came here to look at the work rather than be greeted.
 */
export function Welcome({
  onBegin,
  onSkip,
  skipLabel,
  noteCount,
}: WelcomeProps) {
  const first = useTypewriter(LINE_ONE, { speed: 46, startDelay: 260 });
  const second = useTypewriter(LINE_TWO, {
    speed: 34,
    startDelay: 120,
    enabled: first.done,
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onBegin();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBegin, onSkip]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-[15px] leading-[2] sm:text-[17px]">
        {first.typed}
        {!first.done && <span className="caret">_</span>}
      </p>
      <p className="text-[13px] leading-[2] text-black/60 sm:text-[15px]">
        {second.typed}
        {first.done && !second.done && <span className="caret">_</span>}
      </p>

      <motion.button
        type="button"
        onClick={onBegin}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: second.done ? 1 : 0, y: second.done ? 0 : 8 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-14 cursor-pointer rounded-full border border-black/15 px-5 py-2 text-[12px] text-black/70 transition-colors hover:border-black/40 hover:text-black"
      >
        press <kbd className="key">enter</kbd> to write one
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: second.done ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-5 text-[11px] text-black/30"
      >
        {noteCount} {noteCount === 1 ? "note is" : "notes are"} already in the
        pile
      </motion.p>

      <motion.button
        type="button"
        onClick={onSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: second.done ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mt-7 cursor-pointer text-[11px] text-black/35 transition-colors hover:text-black/70"
      >
        {skipLabel} <span aria-hidden>&rarr;</span>
        {/* Pointless on a touch device, where there is no esc to press. */}
        <kbd className="key ml-2 hidden sm:inline">esc</kbd>
      </motion.button>
    </motion.div>
  );
}

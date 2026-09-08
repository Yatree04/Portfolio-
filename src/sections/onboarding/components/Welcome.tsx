import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTypewriter } from "../lib/useTypewriter";

export interface WelcomeProps {
  onBegin: () => void;
  /** Goes to the work. Undefined until the site has a section to go to. */
  onViewWork?: () => void;
  /** Straight to the pile, without writing anything. */
  onViewPile: () => void;
  /** How many notes are already lying in the pile behind this. */
  noteCount: number;
  /** Skip the type-on. Coming *back* to the door should be instant. */
  instant?: boolean;
}

const GREETING = "hi, welcome to my world.";

/**
 * The front door — the first thing the site shows. One typed line, then the
 * invitation itself is the button, and Escape is the way past it for anyone
 * who came to look at the work rather than be greeted.
 */
export function Welcome({
  onBegin,
  onViewWork,
  onViewPile,
  noteCount,
  instant = false,
}: WelcomeProps) {
  const greeting = useTypewriter(GREETING, {
    speed: 46,
    startDelay: 260,
    enabled: !instant,
  });
  const typed = instant ? GREETING : greeting.typed;
  const settled = instant || greeting.done;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onBegin();
      } else if (event.key === "Escape" && onViewWork) {
        event.preventDefault();
        onViewWork();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBegin, onViewWork]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.5 }}
    >
      {/* Keeps the words off the pile without hiding it. */}
      <div className="scrim pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex flex-col items-center">
        <p className="text-[24px] leading-[1.6] text-ink sm:text-[32px]">
          {typed}
          {!settled && <span className="caret">_</span>}
        </p>

        <motion.button
          type="button"
          onClick={onBegin}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: settled ? 1 : 0, y: settled ? 0 : 8 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 cursor-pointer rounded-full border border-black/30 bg-white/70 px-7 py-3 text-[15px] text-ink backdrop-blur-sm transition-colors hover:border-black hover:bg-white sm:text-[16px]"
        >
          leave me something to ponder over{" "}
          {/* No enter key to press on a phone. */}
          <kbd className="key ml-1 hidden sm:inline">enter</kbd>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-9 flex flex-col items-center gap-5"
        >
          {/* The way to the actual portfolio — the louder of the two. */}
          <button
            type="button"
            onClick={onViewWork}
            className="cursor-pointer text-[14px] text-black/70 underline-offset-4 transition-colors hover:text-black hover:underline"
          >
            view work <span aria-hidden>&rarr;</span>
            {/* Pointless on a touch device, where there is no esc to press. */}
            {onViewWork && (
              <kbd className="key ml-2 hidden sm:inline">esc</kbd>
            )}
          </button>

          {/* The count doubles as the quiet way in, for anyone who wants to
              read the pile without adding to it. */}
          <button
            type="button"
            onClick={onViewPile}
            className="cursor-pointer text-[12px] text-black/45 underline-offset-4 transition-colors hover:text-black/80 hover:underline"
          >
            {noteCount} {noteCount === 1 ? "note is" : "notes are"} already in
            the pile
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}

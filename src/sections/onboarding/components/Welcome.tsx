import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTypewriter } from "../lib/useTypewriter";

export interface WelcomeProps {
  onBegin: () => void;
  /** Goes to the work — the shell decides whether that scrolls or navigates. */
  onViewWork?: () => void;
  /** Skip the type-on. Coming *back* to the door should be instant. */
  instant?: boolean;
}

const GREETING = "hi, welcome to my world.";

/** Both doors are the same size — neither is the consolation prize. */
const BUTTON_BASE =
  "cursor-pointer rounded-full px-8 py-3.5 text-[15px] transition-colors sm:text-[16px]";

/**
 * The front door — the first thing the site shows. One typed line, then two
 * equally weighted ways on: leave a note, or go straight to the work. The pile
 * stays visible behind all of it; the brown carries the contrast.
 */
export function Welcome({ onBegin, onViewWork, instant = false }: WelcomeProps) {
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
      <p className="text-[24px] leading-[1.6] text-ink sm:text-[32px]">
        {typed}
        {!settled && <span className="caret">_</span>}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: settled ? 1 : 0, y: settled ? 0 : 8 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-12 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
      >
        <button
          type="button"
          onClick={onBegin}
          className={`${BUTTON_BASE} bg-brown text-cream hover:bg-brown-deep`}
        >
          leave me something to ponder over
        </button>

        <button
          type="button"
          onClick={onViewWork}
          className={`${BUTTON_BASE} border border-brown bg-transparent text-brown hover:bg-brown hover:text-cream`}
        >
          view work
        </button>
      </motion.div>
    </motion.div>
  );
}

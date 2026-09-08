import { motion } from "framer-motion";
import { useEffect } from "react";

export interface GalleryChromeProps {
  count: number;
  onCompose: () => void;
  /** Suppressed while a note is being read. */
  muted: boolean;
}

/** The thin layer of words over the pile. */
export function GalleryChrome({ count, onCompose, muted }: GalleryChromeProps) {
  useEffect(() => {
    if (muted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onCompose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [muted, onCompose]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: muted ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: muted ? 0 : 0.2 }}
    >
      <p className="absolute left-8 top-7 text-[11px] tracking-[0.14em] text-black/40 uppercase">
        the pile · {count} {count === 1 ? "note" : "notes"}
      </p>

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <button
          type="button"
          onClick={onCompose}
          className="pointer-events-auto cursor-pointer rounded-full border border-black/15 bg-white/80 px-5 py-2 text-[12px] text-black/70 backdrop-blur-sm transition-colors hover:border-black/40 hover:text-black"
        >
          leave one too <kbd className="key">enter</kbd>
        </button>
      </div>
    </motion.div>
  );
}

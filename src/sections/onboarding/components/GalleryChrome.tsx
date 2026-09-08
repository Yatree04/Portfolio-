import { motion } from "framer-motion";
import { useEffect } from "react";
import { BackButton } from "../../../components/BackButton";

export interface GalleryChromeProps {
  count: number;
  onCompose: () => void;
  onBack: () => void;
  /** Suppressed while a note is being read. */
  muted: boolean;
}

/** The thin layer of words over the pile. */
export function GalleryChrome({
  count,
  onCompose,
  onBack,
  muted,
}: GalleryChromeProps) {
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
      <BackButton onClick={onBack} label="back" />

      <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-2">
        <p className="text-[12px] tracking-[0.14em] text-black/55 uppercase">
          the pile · {count} {count === 1 ? "note" : "notes"}
        </p>
        {count > 1 && (
          <p className="text-[12px] text-black/50">
            drag a note aside to read what is under it
          </p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <button
          type="button"
          onClick={onCompose}
          className="pointer-events-auto cursor-pointer rounded-full bg-brown px-7 py-3 text-[15px] text-cream transition-colors hover:bg-brown-deep"
        >
          leave one too
        </button>
      </div>
    </motion.div>
  );
}

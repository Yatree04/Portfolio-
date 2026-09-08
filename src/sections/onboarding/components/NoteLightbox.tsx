import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CARD_H, CARD_W } from "../lib/layout";
import { cardFilename, downloadDataUrl, exportCardPng } from "../lib/exportCard";
import type { Note } from "../types";
import { NoteCard } from "./NoteCard";

export interface NoteLightboxProps {
  note: Note;
  onClose: () => void;
  scale: number;
}

/** One note, read properly, with a way to take it away as a PNG. */
export function NoteLightbox({ note, onClose, scale }: NoteLightboxProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    setSaving(true);
    const png =
      note.snapshot ??
      (cardRef.current ? await exportCardPng(cardRef.current) : null);
    if (png) downloadDataUrl(png, cardFilename(note.name, note.dateLabel));
    setSaving(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-8 bg-white/70 px-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Note from ${note.name}`}
    >
      <motion.div
        initial={{ scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{ width: CARD_W * scale, height: CARD_H * scale }}
      >
        <div ref={cardRef}>
          <NoteCard
            dateLabel={note.dateLabel}
            body={note.body}
            name={note.name}
            signature={note.signature}
            seed={note.id}
            scale={scale}
          />
        </div>
      </motion.div>

      <div
        className="flex items-center gap-6 text-[11px] text-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="cursor-pointer transition-colors hover:text-black disabled:opacity-50"
        >
          {saving ? "saving…" : "save as png"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer transition-colors hover:text-black"
        >
          close (esc)
        </button>
      </div>
    </motion.div>
  );
}

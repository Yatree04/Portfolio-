import { useEffect, useRef } from "react";
import { exportCardPng } from "../lib/exportCard";
import type { Note } from "../types";
import { NoteCard } from "./NoteCard";

export interface ExportStageProps {
  note: Note | null;
  onReady: (noteId: string, png: string) => void;
}

/**
 * Renders a finished card off-screen at full size and rasterises it once, so
 * every note carries a PNG of itself. Nothing waits on this — it is the piece
 * a gallery backend would want, and the "save as png" button reuses it.
 */
export function ExportStage({ note, onReady }: ExportStageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!note) return;
    let cancelled = false;

    // Two frames: one for React to commit, one for layout and the ink image.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        if (cancelled || !ref.current) return;
        const png = await exportCardPng(ref.current);
        if (!cancelled && png) onReady(note.id, png);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // onReady is stable in App; re-running per note is the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  if (!note) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0"
      style={{ left: -99999 }}
    >
      <NoteCard
        dateLabel={note.dateLabel}
        body={note.body}
        name={note.name}
        signature={note.signature}
        seed={note.id}
        elevated={false}
      />
    </div>
  );
}

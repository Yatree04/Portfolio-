import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useViewport } from "../../lib/useViewport";
import { Compose, type ComposeSubmission } from "./components/Compose";
import { ExportStage } from "./components/ExportStage";
import { FlyingCard, type Flight } from "./components/FlyingCard";
import { GalleryChrome } from "./components/GalleryChrome";
import { Loader } from "./components/Loader";
import { NoteLightbox } from "./components/NoteLightbox";
import { Pile } from "./components/Pile";
import { Welcome } from "./components/Welcome";
import {
  CARD_H,
  CARD_W,
  cardViewportCenter,
  fitScale,
  layoutPile,
  pileBounds,
} from "./lib/layout";
import type { SectionProps } from "../registry";
import { createNote, loadNotes, persistNotes } from "./lib/store";
import { usePointerParallax } from "./lib/usePointerParallax";
import type { Note, Phase } from "./types";

/** Vertical room the composer's prompt, name row, toolbar and hint need. */
const COMPOSER_CHROME_HEIGHT = 300;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export interface OnboardingProps extends SectionProps {
  /** Fires once a visitor's note has landed in the pile. */
  onNoteDropped?: (note: Note) => void;
  /**
   * Where the section opens. The mailbox mounts straight into the pile;
   * everywhere else starts at the door.
   */
  initialPhase?: Phase;
  /**
   * Leaves the section entirely. Given by routes that were reached from
   * somewhere else — the mailbox goes back to the site, not to the door.
   */
  onExit?: () => void;
}

/**
 * The onboarding section: the door everyone comes through.
 *
 * Loading → welcome → write a note → watch it drop → the pile. It owns its own
 * phase machine and fills whichever section wraps it, so the rest of the site
 * can be built alongside it without touching any of this.
 */
export function Onboarding({
  onAdvance,
  onNoteDropped,
  initialPhase = "welcome",
  onExit,
}: OnboardingProps) {
  const viewport = useViewport();
  const [notes, setNotes] = useState<Note[]>([]);
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [flyingNote, setFlyingNote] = useState<Note | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [openNote, setOpenNote] = useState<Note | null>(null);
  /** The greeting types itself once; coming back to the door is instant. */
  const [greeted, setGreeted] = useState(initialPhase !== "welcome");
  const [exportTarget, setExportTarget] = useState<Note | null>(null);

  useEffect(() => setNotes(loadNotes()), []);
  useEffect(() => {
    if (notes.length > 0) persistNotes(notes);
  }, [notes]);

  const isComposing = phase === "compose" || phase === "dropping";
  const pileMode =
    phase === "dropping" || phase === "gallery" ? "gallery" : "backdrop";
  const parallax = usePointerParallax(pileMode === "backdrop");

  /** The composer shows the card as close to 1:1 as the viewport allows. */
  const composeScale = useMemo(() => {
    const byWidth = Math.min(viewport.width - 48, CARD_W) / CARD_W;
    const byHeight = (viewport.height - COMPOSER_CHROME_HEIGHT) / CARD_H;
    return Math.max(0.42, Math.min(1, byWidth, byHeight));
  }, [viewport]);

  const lightboxScale = useMemo(
    () =>
      Math.max(
        0.5,
        Math.min(
          1.2,
          (viewport.width - 64) / CARD_W,
          (viewport.height - 200) / CARD_H,
        ),
      ),
    [viewport],
  );

  const handleSubmit = useCallback(
    (submission: ComposeSubmission) => {
      const note = createNote({ ...submission, snapshot: null });
      const nextNotes = [...notes, note];

      setNotes(nextNotes);
      setExportTarget(note);
      onNoteDropped?.(note);

      // Aim the toss at the slot the pile has already reserved for this note.
      // Computed rather than measured, because the pile is mid-transition from
      // faint backdrop to full gallery while the card is in the air.
      const placements = layoutPile(nextNotes);
      const bounds = pileBounds(placements);
      const placement = placements.find((p) => p.id === note.id);

      if (!placement || prefersReducedMotion()) {
        setPhase("gallery");
        return;
      }

      const scale = fitScale(bounds, viewport, "gallery");
      const target = cardViewportCenter(placement, bounds, scale, viewport);

      setFlyingNote(note);
      setFlight({
        from: {
          x: submission.rect.left + submission.rect.width / 2,
          y: submission.rect.top + submission.rect.height / 2,
          scale: submission.scale,
        },
        to: { x: target.x, y: target.y, scale, rotate: placement.rotate },
      });
      setPhase("dropping");
    },
    [notes, onNoteDropped, viewport],
  );

  const handleArrived = useCallback(() => {
    setFlyingNote(null);
    setFlight(null);
    setPhase("gallery");
  }, []);

  const handleSnapshot = useCallback((noteId: string, png: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId ? { ...note, snapshot: png } : note,
      ),
    );
    setExportTarget(null);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <Pile
        notes={notes}
        mode={pileMode}
        viewport={viewport}
        hiddenId={flyingNote?.id ?? null}
        parallax={parallax}
        // The welcome screen is mostly words, so the pile drops right back
        // behind them; the composer has an opaque card holding the middle.
        backdropOpacity={phase === "welcome" ? 0.11 : 0.12}
        onOpen={setOpenNote}
      />

      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <Welcome
            key="welcome"
            instant={greeted}
            onBegin={() => {
              setGreeted(true);
              setPhase("shuffling");
            }}
            onViewWork={onAdvance}
          />
        )}

        {phase === "shuffling" && (
          <Loader key="shuffling" onDone={() => setPhase("compose")} />
        )}

        {isComposing && (
          <Compose
            key="compose"
            scale={composeScale}
            handedOff={phase === "dropping"}
            onSubmit={handleSubmit}
            onBack={() => setPhase("welcome")}
          />
        )}
      </AnimatePresence>

      {phase === "gallery" && (
        <GalleryChrome
          count={notes.length}
          muted={openNote !== null}
          onCompose={() => setPhase("shuffling")}
          onBack={onExit ?? (() => setPhase("welcome"))}
          onViewWork={onAdvance}
        />
      )}

      {flyingNote && flight && (
        <FlyingCard
          note={flyingNote}
          flight={flight}
          onArrived={handleArrived}
        />
      )}

      <AnimatePresence>
        {openNote && (
          <NoteLightbox
            key={openNote.id}
            note={openNote}
            scale={lightboxScale}
            onClose={() => setOpenNote(null)}
          />
        )}
      </AnimatePresence>

      <ExportStage note={exportTarget} onReady={handleSnapshot} />
    </div>
  );
}

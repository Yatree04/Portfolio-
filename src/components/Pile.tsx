import { useMemo, useState, type CSSProperties } from "react";
import Tilt from "react-parallax-tilt";
import { CARD_H, CARD_W, fitScale, layoutPile, pileBounds } from "../lib/layout";
import type { Note } from "../types";
import { NoteCard } from "./NoteCard";

export type PileMode = "backdrop" | "gallery";

export interface PileProps {
  notes: readonly Note[];
  mode: PileMode;
  /** Viewport, so the pile can fit itself to the screen. */
  viewport: { width: number; height: number };
  /** Note currently mid-flight — its slot is held open but left blank. */
  hiddenId?: string | null;
  /** Pointer parallax, in [-1, 1]. Backdrop mode only. */
  parallax?: { x: number; y: number };
  onOpen?: (note: Note) => void;
}

/**
 * Every note ever written, scattered. The same component is the whole gallery
 * and — dimmed right down — the wallpaper behind the composer, so the pile a
 * visitor is about to add to is literally the pile they were just looking at.
 */
export function Pile({
  notes,
  mode,
  viewport,
  hiddenId,
  parallax = { x: 0, y: 0 },
  onOpen,
}: PileProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { placements, bounds } = useMemo(() => {
    const p = layoutPile(notes);
    return { placements: p, bounds: pileBounds(p) };
  }, [notes]);

  const byId = useMemo(
    () => new Map(notes.map((note) => [note.id, note])),
    [notes],
  );

  const scale = fitScale(bounds, viewport, mode);

  const isGallery = mode === "gallery";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden={!isGallery}
    >
      <div
        className="absolute left-1/2 top-1/2 transition-[opacity,filter] duration-[900ms]"
        style={{
          width: bounds.width,
          height: bounds.height,
          transform: `translate(-50%, -50%) translate(${parallax.x * -26}px, ${
            parallax.y * -18
          }px) scale(${scale})`,
          transformOrigin: "center",
          opacity: isGallery ? 1 : 0.12,
          filter: isGallery ? "none" : "saturate(0.6)",
          transitionProperty: "opacity, filter, transform",
          transitionDuration: "900ms",
          transitionTimingFunction: "cubic-bezier(.2,.9,.25,1)",
        }}
      >
        {placements.map((placement) => {
          const note = byId.get(placement.id);
          if (!note) return null;
          const hidden = hiddenId === note.id;
          const hovered = isGallery && hoveredId === note.id;

          return (
            <div
              key={note.id}
              data-note-id={note.id}
              className="absolute"
              style={{
                left: placement.x - bounds.minX - CARD_W / 2,
                top: placement.y - bounds.minY - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                zIndex: hovered ? 9999 : placement.z,
                transform: `rotate(${placement.rotate}deg)`,
                opacity: hidden ? 0 : 1,
                transition: "opacity 240ms ease",
              }}
            >
              <div
                className="card-drift h-full w-full"
                style={
                  {
                    "--drift-duration": `${placement.driftDuration}s`,
                    "--drift-delay": `${placement.driftDelay}s`,
                  } as CSSProperties
                }
              >
                {isGallery ? (
                  <Tilt
                    tiltMaxAngleX={9}
                    tiltMaxAngleY={9}
                    perspective={1400}
                    scale={1.04}
                    transitionSpeed={900}
                    glareEnable
                    glareMaxOpacity={0.22}
                    glareColor="#ffffff"
                    glarePosition="all"
                    glareBorderRadius="10px"
                    className="pointer-events-auto h-full w-full cursor-pointer"
                    onEnter={() => setHoveredId(note.id)}
                    onLeave={() =>
                      setHoveredId((current) =>
                        current === note.id ? null : current,
                      )
                    }
                  >
                    <button
                      type="button"
                      onClick={() => onOpen?.(note)}
                      className="block cursor-pointer text-left"
                      aria-label={`Note from ${note.name}`}
                    >
                      <NoteCard
                        dateLabel={note.dateLabel}
                        body={note.body}
                        name={note.name}
                        signature={note.signature}
                        seed={note.id}
                      />
                    </button>
                  </Tilt>
                ) : (
                  <NoteCard
                    dateLabel={note.dateLabel}
                    body={note.body}
                    name={note.name}
                    signature={note.signature}
                    seed={note.id}
                    elevated={false}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

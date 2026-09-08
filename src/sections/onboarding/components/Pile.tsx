import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
  /** Backdrop mode only. Lower where the foreground is mostly text. */
  backdropOpacity?: number;
  onOpen?: (note: Note) => void;
}

/** Pointer travel, in screen px, past which a press is a drag and not a click. */
const DRAG_THRESHOLD = 4;
/** How much of a dragged note must stay on screen, in pile-space px. */
const KEEP_VISIBLE = 90;

interface DragState {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
}

/**
 * Every note ever written, scattered. The same component is the whole gallery
 * and — dimmed right down — the wallpaper behind the composer, so the pile a
 * visitor is about to add to is literally the pile they were just looking at.
 *
 * In the gallery the notes are loose: drag one aside to read whatever it was
 * lying on top of. A dragged note comes to the top of the stack and stays
 * there, the way a piece of paper you just moved would.
 */
export function Pile({
  notes,
  mode,
  viewport,
  hiddenId,
  parallax = { x: 0, y: 0 },
  backdropOpacity = 0.12,
  onOpen,
}: PileProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  /** Per-note displacement from dragging, in pile-space px. */
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>(
    {},
  );
  /** Notes that have been dragged, oldest first — later means further forward. */
  const [raised, setRaised] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<DragState | null>(null);

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

  // The stage is scaled, so screen-space pointer travel has to be divided by
  // that scale before it becomes a displacement in pile space — otherwise the
  // note slides faster than the cursor that is dragging it.
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  // A note can be pushed anywhere on screen, but never off it — the pile has
  // no scrollbars and no tidy-up button, so a note flung into the void would
  // simply be gone. The clamp is computed in pile space against what the
  // viewport currently shows.
  const limitsRef = useRef<
    Map<string, { x: [number, number]; y: [number, number] }>
  >(new Map());
  limitsRef.current = new Map(
    placements.map((p) => {
      const centreX = bounds.minX + bounds.width / 2;
      const centreY = bounds.minY + bounds.height / 2;
      const halfW = viewport.width / 2 / scale - KEEP_VISIBLE;
      const halfH = viewport.height / 2 / scale - KEEP_VISIBLE;
      return [
        p.id,
        {
          x: [centreX - halfW - p.x, centreX + halfW - p.x] as [number, number],
          y: [centreY - halfH - p.y, centreY + halfH - p.y] as [number, number],
        },
      ];
    }),
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, id: string) => {
      if (!isGallery || event.button !== 0) return;
      const current = offsets[id] ?? { x: 0, y: 0 };
      dragRef.current = {
        id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: current.x,
        originY: current.y,
        moved: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraggingId(id);
      setRaised((order) => [...order.filter((x) => x !== id), id]);
    },
    [isGallery, offsets],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) drag.moved = true;
      if (!drag.moved) return;

      const k = scaleRef.current;
      const limit = limitsRef.current.get(drag.id);
      // An inverted range means this note's home is already off-screen — a
      // huge pile zoomed out — so leave that axis free rather than yanking it.
      const clamp = (value: number, range?: [number, number]) =>
        range && range[0] <= range[1]
          ? Math.min(Math.max(value, range[0]), range[1])
          : value;

      setOffsets((current) => ({
        ...current,
        [drag.id]: {
          x: clamp(drag.originX + dx / k, limit?.x),
          y: clamp(drag.originY + dy / k, limit?.y),
        },
      }));
    },
    [],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragRef.current = null;
      setDraggingId(null);

      // A press that never travelled is a click: open the note.
      if (!drag.moved) {
        const note = byId.get(drag.id);
        if (note) onOpen?.(note);
      }
    },
    [byId, onOpen],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden={!isGallery}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: bounds.width,
          height: bounds.height,
          transform: `translate(-50%, -50%) translate(${parallax.x * -26}px, ${
            parallax.y * -18
          }px) scale(${scale})`,
          transformOrigin: "center",
          opacity: isGallery ? 1 : backdropOpacity,
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
          const dragging = draggingId === note.id;
          const offset = offsets[note.id] ?? { x: 0, y: 0 };
          const raisedIndex = raised.indexOf(note.id);

          // Dragged notes sit above the original stack, in the order they were
          // moved; a hovered note lifts above everything while the cursor is on it.
          const zIndex = hovered
            ? 99999
            : raisedIndex >= 0
              ? 1000 + raisedIndex
              : placement.z;

          return (
            <div
              key={note.id}
              data-note-id={note.id}
              className={
                "absolute " +
                (isGallery
                  ? dragging
                    ? "pointer-events-auto cursor-grabbing"
                    : "pointer-events-auto cursor-grab"
                  : "")
              }
              style={{
                left: placement.x - bounds.minX - CARD_W / 2,
                top: placement.y - bounds.minY - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                zIndex,
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${placement.rotate}deg)`,
                opacity: hidden ? 0 : 1,
                transition: dragging ? "none" : "opacity 240ms ease",
                touchAction: isGallery ? "none" : undefined,
              }}
              onPointerDown={
                isGallery
                  ? (event) => handlePointerDown(event, note.id)
                  : undefined
              }
              onPointerMove={isGallery ? handlePointerMove : undefined}
              onPointerUp={isGallery ? endDrag : undefined}
              onPointerCancel={isGallery ? endDrag : undefined}
              role={isGallery ? "button" : undefined}
              tabIndex={isGallery ? 0 : undefined}
              aria-label={isGallery ? `Note from ${note.name}` : undefined}
              onKeyDown={
                isGallery
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpen?.(note);
                      }
                    }
                  : undefined
              }
            >
              <div
                className="card-drift h-full w-full"
                style={
                  {
                    "--drift-duration": `${placement.driftDuration}s`,
                    "--drift-delay": `${placement.driftDelay}s`,
                    // A note being moved holds still under the cursor.
                    animationPlayState: dragging ? "paused" : undefined,
                  } as CSSProperties
                }
              >
                {isGallery ? (
                  <Tilt
                    // Tilting mid-drag fights the hand moving the note.
                    tiltEnable={!dragging}
                    tiltMaxAngleX={9}
                    tiltMaxAngleY={9}
                    perspective={1400}
                    scale={1}
                    transitionSpeed={900}
                    glareEnable
                    glareMaxOpacity={0.22}
                    glareColor="#ffffff"
                    glarePosition="all"
                    glareBorderRadius="10px"
                    className="h-full w-full"
                    onEnter={() => setHoveredId(note.id)}
                    onLeave={() =>
                      setHoveredId((current) =>
                        current === note.id ? null : current,
                      )
                    }
                  >
                    <NoteCard
                      dateLabel={note.dateLabel}
                      body={note.body}
                      name={note.name}
                      signature={note.signature}
                      seed={note.id}
                    />
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

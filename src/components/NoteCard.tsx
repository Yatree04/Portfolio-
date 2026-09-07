import type { CSSProperties, ReactNode } from "react";
import { CARD_H, CARD_W } from "../lib/layout";
import { hashString } from "../lib/random";

/**
 * The note itself, authored at the Figma frame's exact pixel size (497 x 304)
 * with every child at its designed offset. Callers scale the whole thing with
 * `scale` rather than restyling the inside, so the layout can never drift.
 *
 * Figma offsets (node 232:5274):
 *   date  left 30  top 24
 *   body  left 30  top 73  width 262
 *   from  left 239 top 257   name left 292 top 257
 */
export interface NoteCardProps {
  dateLabel: string;
  body: string;
  name: string;
  /** Transparent PNG of the hand-drawn ink layer. */
  signature?: string | null;
  /** Seeds which part of the paper sheet shows through. */
  seed?: string;
  /** Rendered at CARD_W * scale. */
  scale?: number;
  /** Interactive overlays (textarea, drawing surface) in compose mode. */
  children?: ReactNode;
  /** Shown in place of an empty body. */
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  elevated?: boolean;
}

export function NoteCard({
  dateLabel,
  body,
  name,
  signature,
  seed = "",
  scale = 1,
  children,
  placeholder,
  className = "",
  style,
  elevated = true,
}: NoteCardProps) {
  const h = hashString(seed || dateLabel);
  const shiftX = (h % 71) - 35;
  const shiftY = ((h >> 8) % 57) - 28;

  return (
    <div
      className={className}
      style={{
        width: CARD_W * scale,
        height: CARD_H * scale,
        ...style,
      }}
    >
      <div
        className="card-surface"
        style={
          {
            transform: `scale(${scale})`,
            "--paper-shift-x": `${shiftX}px`,
            "--paper-shift-y": `${shiftY}px`,
            boxShadow: elevated
              ? "0 1px 1px rgba(60,50,10,.10), 0 10px 26px -12px rgba(60,50,10,.35)"
              : "none",
          } as CSSProperties
        }
      >
        <p className="hand absolute left-[30px] top-[24px] capitalize whitespace-nowrap">
          {dateLabel}
        </p>

        <p className="hand hand-body absolute left-[30px] top-[73px] w-[262px] whitespace-pre-wrap break-words">
          {body || (
            <span className="opacity-30 select-none">{placeholder ?? ""}</span>
          )}
        </p>

        <p className="hand absolute left-[239px] top-[257px] max-w-[228px] truncate capitalize">
          From, {name}
        </p>

        {signature ? (
          <img
            src={signature}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          />
        ) : null}

        {children}
      </div>
    </div>
  );
}

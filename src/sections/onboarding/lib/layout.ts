import type { Note } from "../types";
import { seededRandom } from "./random";

/** The card's authored size, straight from the Figma frame. */
export const CARD_W = 497;
export const CARD_H = 304;

export interface Placement {
  id: string;
  /** Centre of the card, in pile-space pixels. */
  x: number;
  y: number;
  /** Degrees. Matches the -9.16 / +8.97 / -1.27 feel of the Figma pile. */
  rotate: number;
  /** Stacking order — newest note sits on top. */
  z: number;
  /** Seeded idle-float parameters so no two cards breathe in sync. */
  driftDelay: number;
  driftDuration: number;
}

/** How far apart successive cards land. Small enough that they overlap. */
const SPREAD = 132;
/** Golden angle, in radians — gives an even, non-repeating scatter. */
const GOLDEN_ANGLE = 2.399963229728653;

/**
 * Lay every note out as if it had been tossed onto a table: each new card
 * lands a little further from the middle than the last and sits on top of what
 * is already there. Placement is derived from the note id, so the pile looks
 * random but never rearranges itself between renders or reloads.
 */
export function layoutPile(notes: readonly Note[]): Placement[] {
  const ordered = [...notes].sort((a, b) => a.createdAt - b.createdAt);

  return ordered.map((note, i) => {
    const rand = seededRandom(note.id);
    const radius = SPREAD * Math.sqrt(i);
    const angle = i * GOLDEN_ANGLE + rand.between(-0.35, 0.35);

    return {
      id: note.id,
      // Wider than tall, so the pile spreads the way a landscape card would.
      x: Math.cos(angle) * radius * 1.35 + rand.between(-52, 52),
      y: Math.sin(angle) * radius * 0.92 + rand.between(-42, 42),
      rotate: rand.between(-13, 13),
      z: i,
      driftDelay: rand.between(0, 6),
      driftDuration: rand.between(9, 17),
    };
  });
}

export interface PileBounds {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

/**
 * Bounding box of the whole pile, accounting for rotation, so the gallery can
 * centre and scale it to fit whatever viewport it is given.
 */
export function pileBounds(placements: readonly Placement[]): PileBounds {
  if (placements.length === 0) {
    return { minX: -CARD_W / 2, minY: -CARD_H / 2, width: CARD_W, height: CARD_H };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of placements) {
    const rad = (p.rotate * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    // Half-extents of the rotated card's axis-aligned bounding box.
    const hw = (CARD_W * cos + CARD_H * sin) / 2;
    const hh = (CARD_W * sin + CARD_H * cos) / 2;

    minX = Math.min(minX, p.x - hw);
    minY = Math.min(minY, p.y - hh);
    maxX = Math.max(maxX, p.x + hw);
    maxY = Math.max(maxY, p.y + hh);
  }

  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

/** Breathing room around the pile when it fills the screen. */
export const GALLERY_PADDING = 96;

/**
 * How much the pile is scaled for a given viewport. The gallery shrinks until
 * everything fits; the backdrop stays zoomed in and cropped so the composer
 * feels like it is sitting *inside* the pile.
 *
 * App and Pile both call this so the drop animation can aim at a card's final
 * resting place without measuring the DOM mid-transition.
 */
export function fitScale(
  bounds: PileBounds,
  viewport: { width: number; height: number },
  mode: "backdrop" | "gallery",
): number {
  const fit = Math.min(
    (viewport.width - GALLERY_PADDING * 2) / bounds.width,
    (viewport.height - GALLERY_PADDING * 2) / bounds.height,
  );
  return mode === "gallery"
    ? Math.max(0.22, Math.min(1, fit))
    : Math.max(0.45, Math.min(1.1, fit * 1.45));
}

/** Where a card's centre lands on screen, in viewport pixels. */
export function cardViewportCenter(
  placement: Placement,
  bounds: PileBounds,
  scale: number,
  viewport: { width: number; height: number },
): { x: number; y: number } {
  const pileCenterX = bounds.minX + bounds.width / 2;
  const pileCenterY = bounds.minY + bounds.height / 2;
  return {
    x: viewport.width / 2 + (placement.x - pileCenterX) * scale,
    y: viewport.height / 2 + (placement.y - pileCenterY) * scale,
  };
}

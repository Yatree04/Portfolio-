/**
 * Deterministic pseudo-randomness.
 *
 * The pile has to *look* random but must not reshuffle on every render or
 * reload, so every placement is derived from the note's own id rather than
 * from Math.random().
 */

/** FNV-1a — small, fast, good enough to turn an id into a seed. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — a compact seeded PRNG returning values in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded generator plus the range helpers the layout code keeps needing. */
export function seededRandom(seed: string | number) {
  const next = mulberry32(typeof seed === "string" ? hashString(seed) : seed);
  return {
    next,
    between: (min: number, max: number) => min + next() * (max - min),
  };
}

/** URL-safe-ish unique id. */
export function makeId(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

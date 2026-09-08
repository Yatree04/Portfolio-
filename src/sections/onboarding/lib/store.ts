import type { Note } from "../types";
import { makeId } from "./random";

const STORAGE_KEY = "ponder.notes.v1";

/** "8/9/26" — the format the card is drawn with in Figma. */
export function formatCardDate(date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  return `${date.getMonth() + 1}/${date.getDate()}/${yy}`;
}

/**
 * The pile is never empty on a first visit — a few notes are already lying
 * there, so a newcomer sees what they are being invited to add to.
 */
const SEED_NOTES: ReadonlyArray<Omit<Note, "id" | "signature" | "snapshot">> = [
  {
    name: "Girl Next Door",
    body: "The fun fact is did you humans cannot breath in the water!",
    dateLabel: "8/9/26",
    createdAt: Date.parse("2026-08-09T10:12:00"),
  },
  {
    name: "Quiet Heron",
    body: "if nobody reads this, does it still count as saying it out loud?",
    dateLabel: "8/14/26",
    createdAt: Date.parse("2026-08-14T21:40:00"),
  },
  {
    name: "Amber Fox",
    body: "we name the stars but never the gaps between them.",
    dateLabel: "8/21/26",
    createdAt: Date.parse("2026-08-21T02:05:00"),
  },
  {
    name: "Small Meadowlark",
    body: "left a window open in a dream and woke up cold. worth it.",
    dateLabel: "9/2/26",
    createdAt: Date.parse("2026-09-02T08:30:00"),
  },
];

function seed(): Note[] {
  return SEED_NOTES.map((n, i) => ({
    ...n,
    // Stable ids: the scatter of the starter pile must not move between loads.
    id: `seed-${i}`,
    signature: null,
    snapshot: null,
  }));
}

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  const n = value as Partial<Note>;
  return (
    typeof n.id === "string" &&
    typeof n.name === "string" &&
    typeof n.body === "string" &&
    typeof n.dateLabel === "string" &&
    typeof n.createdAt === "number"
  );
}

/**
 * Snapshots are full-size PNG data URLs — a handful of them would blow past
 * the ~5MB localStorage quota, so they live in memory for the session only and
 * are stripped on the way to disk. A real gallery backend would keep them.
 */
function toStorable(note: Note): Note {
  return { ...note, snapshot: null };
}

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed();
    const notes = parsed.filter(isNote);
    return notes.length > 0 ? notes : seed();
  } catch {
    // Private mode, disabled storage, corrupt JSON — the pile still works.
    return seed();
  }
}

export function persistNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.map(toStorable)));
  } catch {
    // Over quota or storage unavailable: keep the session going in memory.
  }
}

export interface DraftNote {
  name: string;
  body: string;
  signature: string | null;
  snapshot: string | null;
}

export function createNote(draft: DraftNote): Note {
  const now = new Date();
  return {
    id: makeId(),
    name: draft.name.trim() || "Anonymous",
    body: draft.body.trim(),
    dateLabel: formatCardDate(now),
    createdAt: now.getTime(),
    signature: draft.signature,
    snapshot: draft.snapshot,
  };
}

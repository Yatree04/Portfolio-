/** A single note dropped into the pile. */
export interface Note {
  id: string;
  /** Display name of whoever wrote it — generated, but editable. */
  name: string;
  body: string;
  /** Pre-formatted like the Figma card: "8/9/26". */
  dateLabel: string;
  createdAt: number;
  /** Transparent PNG data URL of the hand-drawn ink layer, if any. */
  signature: string | null;
  /**
   * PNG data URL of the whole finished card, produced by html-to-image.
   * Not used for rendering (the pile re-renders live cards) — it exists so a
   * note can be handed to a gallery backend or downloaded as-is.
   */
  snapshot: string | null;
}

/**
 * What the section is currently showing. The visitor lands on `welcome`; the
 * deck only shuffles once they have asked to write something.
 */
export type Phase =
  | "welcome"
  | "shuffling"
  | "compose"
  | "dropping"
  | "gallery";

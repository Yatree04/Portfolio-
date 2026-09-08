import type { ComponentType } from "react";
import { Onboarding } from "./onboarding";

/** Every section receives this from the shell. */
export interface SectionProps {
  /**
   * Moves on from this section: scrolls to the next one, or leaves for the
   * works page when this is the last one.
   */
  onAdvance?: () => void;
}

export interface SiteSection {
  /** Anchor id — doubles as the URL hash and the scroll target. */
  id: string;
  /** Human label, for navigation once there is more than one of these. */
  label: string;
  Component: ComponentType<SectionProps>;
}

/**
 * The site, in order. Each entry gets a full-viewport, scroll-snapped panel.
 * Adding a section is one line here plus a folder under `sections/`.
 */
export const SECTIONS: readonly SiteSection[] = [
  { id: "onboarding", label: "Leave a note", Component: Onboarding },
];

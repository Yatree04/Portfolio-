import type { ComponentType } from "react";
import { Onboarding } from "./onboarding";

export interface SiteSection {
  /** Anchor id — doubles as the URL hash and the scroll target. */
  id: string;
  /** Human label, for navigation once there is more than one of these. */
  label: string;
  Component: ComponentType;
}

/**
 * The site, in order. Each entry gets a full-viewport, scroll-snapped panel.
 * Adding a section is one line here plus a folder under `sections/`.
 */
export const SECTIONS: readonly SiteSection[] = [
  { id: "onboarding", label: "Leave a note", Component: Onboarding },
];

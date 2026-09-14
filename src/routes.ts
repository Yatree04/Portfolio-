/**
 * Where the React half of the site can send people. The static pages
 * (works, playground, about, resume) live under `public/` and share their own
 * nav; these are the two links the app itself needs.
 *
 * The site root is read off this module's own URL rather than a build-time
 * base, so the same bundle works at /Portfolio-/ and at a domain root. The
 * module is always served from <root>assets/<file>, so one level up is the
 * root.
 */
const SITE = new URL("../", import.meta.url).href;

/** The main site — hero, featured works, and the nav to everything else. */
export const WORKS_URL = `${SITE}works/`;

/** The pile of letters, on its own route. */
export const MAILBOX_URL = `${SITE}mailbox/`;

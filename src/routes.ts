/**
 * Where the React half of the site can send people. The static pages
 * (works, playground, about, resume) live under `public/` and share their own
 * nav; these are the two links the app itself needs.
 */

/** The main site — hero, featured works, and the nav to everything else. */
export const WORKS_URL = `${import.meta.env.BASE_URL}works/`;

/** The pile of letters, on its own route. */
export const MAILBOX_URL = `${import.meta.env.BASE_URL}mailbox/`;

/*
 * Project data for the Works page.
 * ---------------------------------------------------------------------------
 * Each entry renders one card in the "Featured Works" grid.
 *
 *   title        Card heading                       (e.g. "Google Stitch")
 *   eyebrow      Small uppercase line above title   (e.g. "PRODUCT MANAGEMENT | UX STRATEGY")
 *   description  One or more lines under the title  (string, "\n" makes a new line)
 *   url          Where the card links to            (Behance project URL, case study, etc.)
 *   image        Cover image URL or local path      (omit for the grey placeholder block)
 *   status       "under-construction" shows the hover badge from the design
 *
 * Embedding Behance later
 * ---------------------------------------------------------------------------
 * Behance has no public no-key API any more, so the two practical options are:
 *
 * 1. Cover image + link (recommended, what this file is shaped for).
 *    Open the project on Behance, copy the cover image URL (or download it into
 *    /assets/works/) and paste the project URL into `url`:
 *
 *      { title: "Radiate", url: "https://www.behance.net/gallery/123456789/Radiate",
 *        image: "/assets/works/radiate.jpg", ... }
 *
 * 2. Live embed. Behance gives an <iframe> per project under Share -> Embed.
 *    Put that iframe's src in `embed` and the card renders it in place of the
 *    cover image:
 *
 *      { title: "Radiate", embed: "https://www.behance.net/embed/project/123456789?ilo0=1", ... }
 *
 * Replace the placeholders below and the grid re-flows on its own.
 */
window.WORKS_PROJECTS = [
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
    status: "under-construction",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
  },
  {
    eyebrow: "PRODUCT MANAGEMENT | UX STRATEGY",
    title: "Google Stitch",
    description: "Loren Ipsum and dummy text and dummy texts\nLoren Ipsum and dummy text and dummy texts",
    url: "#",
    status: "under-construction",
  },
];

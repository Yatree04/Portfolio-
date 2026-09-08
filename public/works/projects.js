/*
 * Project data for the Works page.
 * ---------------------------------------------------------------------------
 * Each entry renders one card in the "Featured Works" grid.
 *
 *   image        Cover art — the tile is built around it (Figma 89:6276).
 *                A local path such as "/assets/works/pacific-cascade.jpg", or
 *                a URL. It is cropped to fill the 602 x 399.2 cover box.
 *   eyebrow      The line above the title, e.g.
 *                "Data Visualization | Pacific DataViz Challenge"
 *   title        The project name, e.g. "The Pacific Cascade"
 *   url          Where the tile links to (Behance project, case study, ...)
 *   description  Optional. The design's tile is eyebrow + title only, so
 *                leaving this out is the norm; set it and a line appears.
 *   embed        Fallback for a project with no cover art yet: a Behance
 *                Share -> Embed iframe, or its URL. Renders in place of the
 *                image, and the tile drops the text block if the copy is
 *                empty too.
 *   status       "under-construction" shows the hover badge from the design
 *
 * Adding the rest of the Behance projects
 * ---------------------------------------------------------------------------
 * Live embed (what the first entry uses). On Behance open the project, hit
 * Share -> Embed, and paste what it gives you straight into `embed` — either
 * the URL or the entire <iframe ...> snippet works:
 *
 *     embed: '<iframe src="https://www.behance.net/embed/project/255227267?ilo0=1" ...>'
 *     embed: "https://www.behance.net/embed/project/255227267?ilo0=1"
 *
 * The embed renders the Behance cover itself, so a card can leave
 * `title`/`description` empty and the text block below the cover is skipped.
 *
 * Cover image instead of an embed: set `image` to the cover URL (or drop the
 * file into /assets/works/ and point at it) and `url` to the project link.
 *
 * Or run the importer to fill this file in automatically, titles, blurbs,
 * fields and covers included:
 *
 *     node scripts/import-behance.mjs yatripatel --download
 */
window.WORKS_PROJECTS = [
  {
    // https://www.behance.net/gallery/255227267
    embed: "https://www.behance.net/embed/project/255227267?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/255342321
    embed: "https://www.behance.net/embed/project/255342321?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/255274663
    embed: "https://www.behance.net/embed/project/255274663?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/255306649
    embed: "https://www.behance.net/embed/project/255306649?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/255261283
    embed: "https://www.behance.net/embed/project/255261283?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/247432273
    embed: "https://www.behance.net/embed/project/247432273?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
  {
    // https://www.behance.net/gallery/253628357
    embed: "https://www.behance.net/embed/project/253628357?ilo0=1",
    eyebrow: "",
    title: "",
    description: "",
  },
];

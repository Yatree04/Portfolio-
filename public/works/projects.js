/*
 * Project data for the Works page.
 * ---------------------------------------------------------------------------
 * Each entry renders one card in the "Featured Works" grid.
 *
 *   image        Cover art — the tile is built around it (Figma 89:6276).
 *                Relative to this page, so "../assets/works/<file>" — the
 *                site is served under /Portfolio-/ and a leading slash would
 *                point outside it. A full URL works too. The image is
 *                cropped to fill the 602 x 399.2 cover box.
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
    // 89:6276 — https://www.behance.net/gallery/255306649
    image: "../assets/works/pacific-cascade.png",
    embed: "https://www.behance.net/embed/project/255306649?ilo0=1",
    url: "https://www.behance.net/gallery/255306649",
    eyebrow: "Data Visualization | Pacific DataViz Challenge",
    title: "The Pacific Cascade",
  },
  {
    // 273:5264 — https://www.behance.net/gallery/255274663
    image: "../assets/works/google-stitch.png",
    embed: "https://www.behance.net/embed/project/255274663?ilo0=1",
    url: "https://www.behance.net/gallery/255274663",
    eyebrow: "Ergonomic Evaluation & Redesign | 3 weeks",
    title: "Google Stitch Redesign",
  },
  {
    // 274:5267 — https://www.behance.net/gallery/255227267
    image: "../assets/works/paalan.png",
    embed: "https://www.behance.net/embed/project/255227267?ilo0=1",
    url: "https://www.behance.net/gallery/255227267",
    eyebrow: "",
    title: "Paalan | Animal Welfare App",
  },
  {
    // 274:5270 — https://www.behance.net/gallery/255342321
    image: "../assets/works/trail.png",
    embed: "https://www.behance.net/embed/project/255342321?ilo0=1",
    url: "https://www.behance.net/gallery/255342321",
    eyebrow: "Self Exploratory Project Concept | July 2026",
    title: "Trails | Context Preservation Tool",
  },
  {
    // 274:5277 — https://www.behance.net/gallery/255261283
    image: "../assets/works/google-pay-upi.png",
    embed: "https://www.behance.net/embed/project/255261283?ilo0=1",
    url: "https://www.behance.net/gallery/255261283",
    eyebrow: "UX Research | Google Pay | 4 Day Design Sprint",
    title: "Enabling Novice Users to make UPI Payments",
  },
  {
    // 274:5274 — the embed pairing here is a guess, see README
    image: "../assets/works/unicorn-makers.png",
    embed: "https://www.behance.net/embed/project/247432273?ilo0=1",
    url: "https://www.behance.net/gallery/247432273",
    eyebrow: "",
    title: "Unicorn Makers",
  },
  {
    // 274:5280 — the embed pairing here is a guess, see README
    image: "../assets/works/design-degree-show.png",
    embed: "https://www.behance.net/embed/project/253628357?ilo0=1",
    url: "https://www.behance.net/gallery/253628357",
    eyebrow: "",
    title: "Design Degree Show \u201826 | Event Branding",
  },
];

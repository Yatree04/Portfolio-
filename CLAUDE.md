# yatripatel.in

A portfolio built as a stack of full-viewport sections. See `README.md` for the
architecture; this file is the set of conventions to hold to.

## Conventions

- **Every screen gets a back button.** Any screen a visitor can navigate to
  carries `components/BackButton`, top-left. Nothing on this site is a one-way
  trip. The only exemptions are the very first screen (nothing to go back to)
  and momentary transitions the visitor cannot act on.
- **One nav, one list.** The static pages (works, playground, about, resume)
  get their header pill and footer from `public/assets/site.js`; a new
  destination is one entry in its `NAV` array, never hand-written markup in a
  page. The React routes carry `BackButton` instead. The mailbox is not in
  that list — it is the envelope in the top-right corner, which opens on hover.
- **The Figma frame is 1920 wide; the site is not.** Measurements taken from it
  get scaled down to the widths people actually browse at, in the tokens at the
  top of `site.css`. The hero on works is the one exception, at its designed
  size.
- **Sections are self-contained.** A section lives under `src/sections/<name>/`,
  owns its own state, and fills whatever wraps it. Register it in
  `src/sections/registry.ts`; the shell hands it `onAdvance` to move on to the
  next one.
- **Figma is the source of truth for the card.** `NoteCard` reproduces node
  `232:5274` at its authored 497x304 with every child at its designed offset,
  and scales as a unit. Change the geometry there, not per-caller.
- **Copy is lowercase and plain.** The site talks the way the notes do.
- **Buttons that matter are brown.** `--color-brown` filled with `--color-cream`
  text for the primary, outlined for its equal. They have to hold contrast over
  the pale pile showing through behind them.
- **Respect `prefers-reduced-motion`** in anything that moves.

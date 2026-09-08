# yatripatel.in

A portfolio built as a stack of full-viewport sections. See `README.md` for the
architecture; this file is the set of conventions to hold to.

## Conventions

- **Every screen gets a back button.** Any screen a visitor can navigate to
  carries `components/BackButton`, top-left. Nothing on this site is a one-way
  trip. The only exemptions are the very first screen (nothing to go back to)
  and momentary transitions the visitor cannot act on.
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

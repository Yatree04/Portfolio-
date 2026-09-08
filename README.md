# yatripatel.in

A portfolio that opens by asking you for something first.

Loading → `hi, welcome to my world` → you write a note on a paper card →
you press **enter** and watch it get tossed onto a pile of everyone else's.
The pile is also the wallpaper behind the composer, at 12% opacity, so you are
always writing on top of what is already there.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

Pushing to `main` builds and deploys to GitHub Pages
(`.github/workflows/static.yml`). `public/CNAME` keeps the custom domain.

## The flow

| Phase       | What happens                                                              |
| ----------- | ------------------------------------------------------------------------- |
| `welcome`   | The front door, straight away. The greeting types itself over the faint pile. |
| `shuffling` | The deck riffles on the way into the composer, gating on the handwriting font. |
| `compose`   | The Figma card, live: name, handwriting textarea, pen and eraser.         |
| `dropping`  | The finished card lifts, arcs and tumbles into the slot the pile reserved. |
| `gallery`   | The whole pile, loose. Drag notes aside, click one to read it.            |

Enter submits from anywhere on the composer; Shift+Enter is a newline. Every
screen past the door carries a back button — see `CLAUDE.md`.

## Sections

The site is a stack of full-viewport, scroll-snapped panels. `App.tsx` renders
whatever `sections/registry.ts` lists; onboarding is the first and, today, the
only one. Adding another is one line in the registry plus a folder.

```
src/
  App.tsx                    the shell
  lib/useViewport.ts         shared across sections
  sections/
    registry.ts              SECTIONS — the site, in order
    onboarding/
      Onboarding.tsx         the phase machine, self-contained
      components/
        NoteCard.tsx         the card, at Figma's exact 497x304 geometry
        Compose.tsx          the writing screen
        DrawingLayer.tsx     signature_pad ink (pen + destination-out eraser)
        PenToolbar.tsx       the 76x31 pill from the design
        FlyingCard.tsx       the toss
        Pile.tsx             the gallery AND the faint backdrop — one component
        NoteLightbox.tsx     one note, read properly, downloadable as PNG
      lib/
        layout.ts            where every card lands, and where on screen
        paper.ts             the crumpled-paper texture
        random.ts            seeded PRNG — looks random, never moves
        store.ts             localStorage notes + seed pile
        exportCard.ts        html-to-image, handwriting font inlined
```

`Onboarding` fills whatever wraps it and owns all its own state, so the rest of
the portfolio can be built alongside without touching any of it. It emits
`onNoteDropped` if a later section wants to react to a visitor leaving a note.

## Sharing a preview

```bash
npm run build:preview   # -> dist/preview.html
```

`scripts/bundle-single-file.mjs` flattens the build into one HTML file with the
CSS, the JS and the handwriting font inlined, for hosts that serve a single page
and no `/assets`. Note that sandboxed viewers block page-initiated downloads, so
"save as png" only works from a real deployment or `npm run dev`.

### The pile is loose

Notes in the gallery can be dragged. A press that travels more than a few
pixels is a drag, anything less is a click that opens the note. Dragging pulls
a note to the front of the stack and leaves it there, so pushing one aside
reveals what it was lying on. Two details make it behave: pointer travel is
divided by the stage's scale before it becomes a displacement, or the note
would slide faster than the cursor; and the displacement is clamped against
the viewport, because the pile has no scrollbars and no tidy-up button, so a
note flung into the void would simply be gone. Arrangements last the session.

### The pile never reshuffles

Every placement comes from a seeded PRNG keyed on the note's own id, laid out on
a golden-angle spiral with jitter (`lib/layout.ts`). Reload the page and each
card is exactly where you left it; add a note and it lands one ring further out,
on top. `cardViewportCenter()` is what lets the drop animation aim at a card's
final resting place without measuring the DOM mid-transition — the flying card
and its reserved slot end up pixel-identical.

### The paper texture

Figma layers a raster photo (`PAPER TEXTURE - 02`) over each card at 51%
opacity. That bitmap is not in this repo, so `lib/paper.ts` synthesises the same
thing with SVG filters: fractal noise lit from the upper left for the folds, a
high-frequency pass for the fibre. It is baked into a data URI once and used as
a plain `background-image`, because a live `filter:` per card would be
re-evaluated for every card in the pile.

**To use the real bitmap instead:** drop it in `public/` and point
`PAPER_TEXTURE_URL` at it. Nothing else changes.

### Where a backend would plug in

Notes live in `localStorage` today (`lib/store.ts`). `loadNotes` / `persistNotes`
/ `createNote` are the whole surface a real gallery API would need to replace.
Every note also carries `snapshot`, a PNG data URL of the finished card produced
off-screen by `ExportStage` — that is the thing you would POST. Snapshots are
deliberately stripped before writing to `localStorage`; a handful of them would
blow past the ~5MB quota.

## Design source

Figma `कام` — compose screen `232:5270`, pile `218:5227`. Card is `#fff9c0`,
497x304, radius 10; body text is QEBradenHill at 20px, offsets 30/24, 30/73
(262 wide), 239/257. Labels are Fragment Mono 12px.

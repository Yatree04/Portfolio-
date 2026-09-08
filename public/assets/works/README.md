# Work covers

The tile on the works page is built around cover art (Figma node 89:6276).
Each file is named by the `image` path in `public/works/projects.js`, in the
order the design lays them out:

    pacific-cascade.png       The Pacific Cascade
    google-stitch.png         Google Stitch Redesign
    paalan.png                Paalan | Animal Welfare App
    trail.png                 Trails | Context Preservation Tool
    google-pay-upi.png        Enabling Novice Users to make UPI Payments
    unicorn-makers.png        Unicorn Makers
    design-degree-show.png    Design Degree Show '26 | Event Branding

Drop a file in and its tile switches from the Behance embed to the cover on
the next build — nothing else to change. Until the file exists the tile falls
back to that project's embed, so the page is never broken.

The cover box is 602 x 399.2 (a 1.508 ratio) and the image is cropped to fill
it, so anything roughly 3:2 and 1200px wide or more looks right.

Two things still guessed rather than known:

- Which Behance project is Unicorn Makers and which is the Design Degree
  Show. They are the two ids that were not identified — 247432273 and
  253628357 — paired in that order.
- The eyebrow for Paalan, Unicorn Makers and the Design Degree Show. The
  design carries the same placeholder line on every tile, so the ones that
  are filled in here come from the covers themselves rather than from it.

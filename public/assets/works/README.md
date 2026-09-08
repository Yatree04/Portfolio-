# Work covers

The tile on the works page is built around cover art (Figma node 89:6276).
Each file here is named by the `image` path in `public/works/projects.js`:

    ../assets/works/paalan.png
    trail.png
    google-stitch.png
    pacific-cascade.png
    google-pay-upi.png

Drop a file in and its tile switches from the Behance embed to the cover on
the next build — nothing else to change. Until the file exists the tile falls
back to the project's embed, so the page is never broken.

The cover box is 602 x 399.2 (a 1.508 ratio) and the image is cropped to fill
it, so anything roughly 3:2 and 1200px wide or more looks right.

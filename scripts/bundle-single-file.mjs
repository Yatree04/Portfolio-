/**
 * Flattens `dist/` into one self-contained HTML file.
 *
 * Used for sharing a live preview where there is no server to serve
 * /assets or /QEBradenHill.ttf: the CSS, the JS module and the handwriting
 * font all become inline text. Output is a fragment — no <!doctype>, <html>,
 * <head> or <body> — so it can be dropped straight into a host page.
 *
 *   node scripts/bundle-single-file.mjs [outfile]
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";
const out = process.argv[2] ?? "dist/preview.html";

const assets = await readdir(path.join(DIST, "assets"));
const cssName = assets.find((f) => f.endsWith(".css"));
const jsName = assets.find((f) => f.endsWith(".js"));
if (!cssName || !jsName) throw new Error("run `npm run build` first");

const [css, js, font] = await Promise.all([
  readFile(path.join(DIST, "assets", cssName), "utf8"),
  readFile(path.join(DIST, "assets", jsName), "utf8"),
  readFile(path.join(DIST, "QEBradenHill.ttf")),
]);

// The font is the only runtime file request the page makes; inline it so the
// handwriting renders both on screen and inside the html-to-image export.
const inlinedCss = css.replace(
  /url\(\/QEBradenHill\.ttf\)\s*format\("truetype"\)/,
  `url(data:font/ttf;base64,${font.toString("base64")}) format("truetype")`,
);
if (inlinedCss === css) throw new Error("font @font-face rule not found in CSS");

const html = `<title>Leave Me Something to Ponder</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap" rel="stylesheet">
<style>
html,body{height:100%}
${inlinedCss}
</style>
<div id="root" style="height:100vh"></div>
<script type="module">
${js}
</script>
`;

await writeFile(out, html);
console.log(`${out}  ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB`);

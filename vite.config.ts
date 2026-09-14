import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  /**
   * Relative, so the build does not care where it is mounted: it works at
   * yatree04.github.io/Portfolio-/ and at the root of a custom domain
   * without rebuilding. Asset URLs come out relative to each document, and
   * the routes in src/routes.ts find the site root at runtime.
   */
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      // Two documents, so GitHub Pages can serve /mailbox/ without a rewrite.
      // The static pages ship as-is from public/.
      input: {
        main: "index.html",
        mailbox: "mailbox/index.html",
        /* Not a page — the ribbons bundle the static pages pull in. */
        ribbons: "src/ribbons-standalone.tsx",
      },
      output: {
        /* That one keeps a predictable name so site.js can link to it. */
        entryFileNames: function (chunk) {
          return chunk.name === "ribbons"
            ? "assets/ribbons.js"
            : "assets/[name]-[hash].js";
        },
      },
    },
  },
});

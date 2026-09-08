import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  /**
   * GitHub Pages serves this repo at yatree04.github.io/Portfolio-/, so the
   * built app's asset URLs need that prefix. Change this to "/" if the site
   * ever moves back to a domain root (and restore public/CNAME with it).
   */
  base: "/Portfolio-/",
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

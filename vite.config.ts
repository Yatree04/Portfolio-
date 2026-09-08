import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
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
      },
    },
  },
});

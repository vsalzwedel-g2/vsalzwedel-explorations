import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the GitHub Pages workflow
// (e.g. "/vsalzwedel-explorations/epics/self-serve-events/coming-soon/").
// Defaults to "/" for local dev / preview.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

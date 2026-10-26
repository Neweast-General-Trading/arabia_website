import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/cms/",
  server: {
    port: 3012,
    host: true,
    strictPort: true,
    allowedHosts: true,
  },
  preview: { port: 3012, host: true },
});

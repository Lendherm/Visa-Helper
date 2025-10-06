import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./", // rutas relativas, ideal para Netlify o GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        admin: resolve(__dirname, "src/admin/index.html"),
      },
    },
  },
  publicDir: resolve(__dirname, "src/public"), // ⚡ para que Vite use src/public como carpeta pública
});

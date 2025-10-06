import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/", // 🔹 le decimos a Vite que el punto de entrada está dentro de src
  base: "./",   // 🔹 rutas relativas (ideal para Netlify, GitHub Pages, etc.)

  build: {
    outDir: "../dist", // 🔹 salida del build fuera de src/
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        admin: resolve(__dirname, "src/admin/index.html"),
      },
    },
  },

  publicDir: resolve(__dirname, "src/public"), // 🔹 carpeta pública dentro de src/
});

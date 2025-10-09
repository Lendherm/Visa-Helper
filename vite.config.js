import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",       // punto de entrada
  base: "./",         // rutas relativas
  server: {
    host: true,
    port: 3000        // Vite también corre en 3000 para Netlify Dev
  },
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        admin: resolve(__dirname, "src/admin/index.html")
      }
    }
  },
  publicDir: resolve(__dirname, "src/public")
});

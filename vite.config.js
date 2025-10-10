import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "./", // rutas relativas
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        usvisa: resolve(__dirname, "src/US_Visa/US_Visa.html"),
        portal: resolve(__dirname, "src/PortalVisaHelper/index.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
});

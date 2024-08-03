import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/voice-analyzer2/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

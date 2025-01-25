import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    "testMatch": ["**/__tests__/**/*.[jt]s?(x)"],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}']
    },
});

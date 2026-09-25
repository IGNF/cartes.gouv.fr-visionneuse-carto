import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: process.env.BASE_URL || "/voir-une-carte/",
  build: {
    outDir: "./docs",
    emptyOutDir: true,
  },

  envPrefix: ["API_URL"],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/setup.js'],
    include: ["./tests/test/**/*.{test,spec}.{ts,js}"],
    server: {
      deps: {
        inline: ['mcutils'], // Permet à vitest d'importer mcutils sans avoir à modifier les imports
      },
    }
  },
}));



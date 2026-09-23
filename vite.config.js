import { defineConfig } from 'vite';
import { openslide } from '@computationalpathologygroup/openslide-js/vite';

const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

export default defineConfig({
  // Vercel serves this app from the deployment root. Using an absolute base
  // keeps generated worker/WASM and asset URLs predictable in production.
  base: '/',
  plugins: [openslide()],
  server: {
    headers: isolationHeaders,
  },
  preview: {
    headers: isolationHeaders,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    emptyOutDir: true,
  },
});

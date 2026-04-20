import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // loadEnv() reads from .env files — but on Netlify/Render there is no .env file.
      // Those platforms inject secrets as real Node.js process.env vars at build time.
      // So we try loadEnv first (works in AI Studio & local dev), then fall back to
      // process.env (works on Netlify, Render, and any CI/CD platform).
      'process.env.GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

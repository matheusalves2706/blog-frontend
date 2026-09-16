import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Documentação da configuração: https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
});

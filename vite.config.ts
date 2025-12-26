import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
export default defineConfig({
  server:{
host:true,
port:5173
  },
  plugins: [tailwindcss(), react(),
tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
  ],
});

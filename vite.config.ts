import { fileURLToPath, URL } from "node:url";

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { proxyConfiguration } from "./proxy";
import type { ProxyOptions } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    
  },
  // server: {
  //   proxy: proxyConfiguration as Record<string, string | ProxyOptions>,
  // },
})

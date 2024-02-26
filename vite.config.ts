import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import { reactivePreprocess }  from 'svelte-reactive-preprocessor';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svelte({
    preprocess: reactivePreprocess({
      enabled: true,
      state: false,
    }),
  }), vitePreprocess(), basicSsl()],
  define: {
    'process.env': {}
  },
  base: '/IncoHangman/'
})

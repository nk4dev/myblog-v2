// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { socialLinks } from './src/data/social';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // canonical / og:url の基準 URL（nk4dev.github.io の HMeta と同じ）
  site: 'https://nknighta.me',

  // /g → GitHub, /x → X などの短縮リダイレクト（src/data/social.ts）
  redirects: Object.fromEntries(socialLinks.map(({ slug, url }) => [`/${slug}`, url])),

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});
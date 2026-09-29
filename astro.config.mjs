// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { socialLinks } from './src/data/social';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  // /g → GitHub, /x → X などの短縮リダイレクト（src/data/social.ts）
  redirects: Object.fromEntries(socialLinks.map(({ slug, url }) => [`/${slug}`, url])),
  vite: {
    plugins: [tailwindcss()]
  }
});

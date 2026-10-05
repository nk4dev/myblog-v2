// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Base URL for canonical, og:url, share links, the sitemap and robots.txt.
  // The site is served on nknighta.me; blog.nknighta.me redirects here (src/worker.ts)
  site: 'https://nknighta.me',

  // Short URLs such as /g and /x are redirected by the Hono worker (src/server/shortlinks.ts)

  env: {
    schema: {
      // Optional so the site falls back to mock data when they are not set
      MICROCMS_SERVICE_DOMAIN: envField.string({ context: 'server', access: 'secret', optional: true }),
      MICROCMS_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MOCKMODE: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(),
  integrations: [mdx()]
});

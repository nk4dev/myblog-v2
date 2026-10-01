import type { APIRoute } from "astro";

/** Generated so the sitemap URL follows astro.config.mjs "site" */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Allow: /
# Draft previews and the JSON API are not pages
Disallow: /preview/
Disallow: /api/

Sitemap: ${new URL("/sitemap.xml", site).href}
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );

import type { APIRoute } from "astro";
import { getSitePages } from "../lib/site-pages";

// Rendered on demand so new posts are listed without a rebuild
export const prerender = false;

/** XML sitemap of every public page */
export const GET: APIRoute = async ({ site }) => {
  const { fixed, lists, posts, scraps, projects } = await getSitePages();
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const entries = [...fixed, ...lists, ...posts, ...scraps, ...projects]
    .map(({ path, lastmod }) => {
      const loc = `<loc>${escape(new URL(path, site).href)}</loc>`;
      return `  <url>${loc}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};

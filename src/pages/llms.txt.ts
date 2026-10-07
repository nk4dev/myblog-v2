import type { APIRoute } from "astro";
import { getSitePages, type SitePage } from "../lib/site-pages";
import { markdownPath } from "../lib/markdown";

// Rendered on demand so new posts are listed without a rebuild
export const prerender = false;

// Update when the hand-written parts below change (the page lists are fetched on every request)
const UPDATED = "2026-10-08";

/**
 * llms.txt: a guide to this site for LLMs, in the format of https://llmstxt.org/
 * (a title, a summary, notes, then one list of links per section).
 * Posts, scraps and projects link to their Markdown versions (src/server/markdown.ts).
 */
export const GET: APIRoute = async ({ site }) => {
  const { fixed, posts, scraps, projects } = await getSitePages();
  const url = (path: string) => new URL(path, site).href;
  const host = new URL(site!).host;
  const item = (title: string, href: string, note?: string) =>
    `- [${title.replace(/[\\[\]]/g, "\\$&")}](${href})${note ? `: ${note}` : ""}`;
  const markdownList = (pages: SitePage[]) =>
    pages.map((p) => item(p.title, url(markdownPath(p.path)), p.description)).join("\n");

  const body = `# ${host}

> The personal site of developer Nknight AMAMIYA (nk4dev). It publishes technical blog posts, short notes (scraps), development projects and small web apps made by the owner. Posts are mostly in Japanese; the site's interface can be shown in Japanese or English.

- **Operator**: Nknight AMAMIYA@nk4dev, a developer and VRChat user. Another website: https://varius.technology
- **Markdown**: Every blog post, scrap and dev project, and the list of each, is also served as Markdown. Add \`.md\` to the URL in place of the trailing slash (${url("/blog.md")}, \`${url("/blog/")}<id>.md\`), or request the page itself with \`Accept: text/markdown\`.
- **Usage**: Content under /blog/, /scraps/, /dev/ and /apps/ may be used for answer generation, summarization and mentions. Do not use /preview/ (unpublished drafts) or /api/.
- **Citation**: When mentioning posts or apps from this site, please state the site name "${host}" and the operator name "Nknight AMAMIYA", and link to the HTML page (the \`url\` field at the top of each Markdown page) where possible.
- **Accuracy**: Posts are based on the operator's own learning, development experience and research, and reflect the author's knowledge at the time of writing (see \`published\` and \`updated\`). Technical details may have changed since.
- **Contact**: nknighta@varius.technology, https://github.com/nk4dev, https://x.com/nk4dev
- **Last updated**: ${UPDATED} (the lists below are always current)

## Blog

${item("All blog posts", url("/blog.md"), "programming, web development, VRChat and other topics")}
${markdownList(posts)}

## Scraps

${item("All scraps", url("/scraps.md"), "short notes and development logs")}
${markdownList(scraps)}

## Dev projects

${item("All dev projects", url("/dev.md"), "development projects with their repositories")}
${markdownList(projects)}

## Pages

${fixed.map((p) => item(p.title, url(p.path))).join("\n")}

## Optional

${item("Old top page", url("/llmassets/nknighta.md"), "Markdown snapshot of the old site's top page")}
${item("Old site index", url("/llmassets/nknighta-me-index.md"), "Markdown snapshot of the old site's profile, skills and repositories")}
${item("Old blog list", url("/llmassets/blogs.md"), "Markdown snapshot of the old site's blog list")}
${item("Sitemap", url("/sitemap.xml"), "every public HTML page")}
${item("Icon", url("/icon.jpeg"), "the operator's icon")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

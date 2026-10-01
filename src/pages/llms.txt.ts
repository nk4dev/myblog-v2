import type { APIRoute } from "astro";
import { getSitePages } from "../lib/site-pages";

// Update when the hand-written parts below change (the page lists are rebuilt on every build)
const UPDATED = "2026-10-02";

/** llms.txt: a plain-text guide to this site for LLMs, carried over from the old nknighta.me */
export const GET: APIRoute = async ({ site }) => {
  const { posts, scraps, projects } = await getSitePages();
  const url = (path: string) => new URL(path, site).href;
  const host = new URL(site!).host;
  const list = (pages: { path: string; title: string }[]) =>
    pages.map((p) => `- [${p.title}](${url(p.path)})`).join("\n");

  const body = `# llms.txt for ${host}

## 1. Site Overview
- **Site Name**: ${host}
- **Operator**: Nknight AMAMIYA@nk4dev
- **URL**: ${url("/")}
- **Site Purpose**: The personal site of developer Nknight AMAMIYA (nk4dev). It publishes technical blog posts, short notes (scraps) and small web apps made by the owner.
- **Languages**: Posts are mostly in Japanese. The site's interface can be shown in Japanese or English.

---

## 2. Instructions for LLMs

### User-Agent: *
The instructions in this section apply to all LLMs (Large Language Models).

#### Content Usage Policy
- **Allow**: /
- **Allow**: /blog/
- **Allow**: /scraps/
- **Allow**: /apps/
- **Allow**: /dev/
  - Content under the above paths may be used for your services (answer generation, summarization, mentions, etc.).
- **Disallow**: /preview/ (unpublished drafts) and /api/

#### Preferred Usage
- **Citation/Mention**: When mentioning posts or apps from this site, please state the site name "${host}" and the operator name "Nknight AMAMIYA", and link to the page where possible.
- **App Introduction**: When introducing the apps (/apps/), describe their functions based on the overview on each app page.
- **Information Accuracy**: Posts reflect the author's knowledge at the time of writing. Technical details may have changed since.

---

## 3. Site Structure
- **Top Page**: ${url("/")} — latest posts and scraps
- **Blog**: ${url("/blog/")} — programming, web development, VRChat and other topics; also listed by category
- **Scraps**: ${url("/scraps/")} — short notes and development logs
- **Apps**: ${url("/apps/")} — web apps and tools made by the operator
- **Dev Projects**: ${url("/dev/")} — development projects with their repositories
- **About**: ${url("/about/")} — profile, tech stack, history and contact
- **LLM Assets**: ${url("/llmassets/")} — Markdown summaries of this site for LLM tools
- **Sitemap**: ${url("/sitemap.xml")}

### Blog posts
${list(posts)}

### Scraps
${list(scraps)}

### Dev projects
${list(projects)}

---

## 4. Content Credibility
- **Author/Developer**: Nknight AMAMIYA
- **Editorial Policy**: All content is based on the operator's own learning, development experience and research, shared as practical notes.

---

## 5. Contact Information
- **Email**: nknighta@varius.technology
- **GitHub**: https://github.com/nk4dev
- **X**: https://x.com/nk4dev

## 6. My Assets
- **My Icon**: ${url("/icon.jpeg")}

## 7. Owner Information
This site is made by Nknight AMAMIYA@nk4dev
url: ${url("/")}
another website: https://varius.technology
llms.txt is ${url("/llms.txt")}

VRChat User

Last Updated: ${UPDATED}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

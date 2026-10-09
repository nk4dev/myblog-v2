import { Hono } from "hono";
import {
  getAllBlogs,
  getAllProjects,
  getAllScraps,
  getBlogDetail,
  getProjectDetail,
  getScrapDetail,
} from "../lib/microcms";
import { decodeHTML, estimateTokens, htmlToMarkdown, markdownPath } from "../lib/markdown";
import type { Blog } from "../types/blog";
import type { Scrap } from "../types/scrap";
import type { Project } from "../types/project";

/**
 * Markdown versions of the pages for AI agents, mounted at / by src/worker.ts.
 * Posts, scraps and projects (and their lists) are built from microCMS and are also served at
 * URLs ending with ".md" (/blog/foo.md, /blog.md). Every other HTML page is converted from its
 * rendered HTML when the request prefers Markdown (Accept: text/markdown).
 * Draft previews have no Markdown version.
 */
export const markdownRoutes = new Hono({ strict: false });

const PUBLIC_CACHE = "public, s-maxage=300";

/** What a Markdown page needs from a post, scrap or project */
type Doc = {
  id: string;
  title: string;
  description?: string;
  /** Rich editor HTML */
  content: string;
  category?: string;
  publishedAt: string;
  revisedAt?: string;
  /** External URL of a project */
  link?: string;
};

type Section = {
  title: string;
  description: string;
  all: () => Promise<Doc[]>;
  one: (id: string) => Promise<Doc | null>;
};

const fromBlog = (post: Blog): Doc => ({
  id: post.id,
  title: post.title,
  description: post.description,
  content: post.content,
  category: post.category?.name,
  publishedAt: post.publishedAt ?? post.createdAt,
  revisedAt: post.revisedAt,
});

const fromScrap = (scrap: Scrap): Doc => ({
  id: scrap.id,
  title: scrap.title,
  content: scrap.content,
  category: scrap.category,
  publishedAt: scrap.publishedAt ?? scrap.createdAt,
  revisedAt: scrap.revisedAt,
});

const fromProject = (project: Project): Doc => ({
  id: project.id,
  title: project.name,
  content: project.content ?? "",
  category: project.category,
  publishedAt: project.publishedAt ?? project.createdAt,
  revisedAt: project.revisedAt,
  link: project.url,
});

const orNull = <T,>(item: T | null, convert: (item: T) => Doc) => (item ? convert(item) : null);

/** Keyed by the first path segment */
const sections: Record<string, Section> = {
  blog: {
    title: "Blog",
    description: "Blog posts by Nknight AMAMIYA (nk4dev) on programming, web development, VRChat and other topics.",
    all: async () => (await getAllBlogs()).map(fromBlog),
    one: async (id) => orNull(await getBlogDetail(id), fromBlog),
  },
  scraps: {
    title: "Scraps",
    description: "Short notes and development logs by Nknight AMAMIYA (nk4dev).",
    all: async () => (await getAllScraps()).map(fromScrap),
    one: async (id) => orNull(await getScrapDetail(id), fromScrap),
  },
  dev: {
    title: "Dev Projects",
    description: "Development projects by Nknight AMAMIYA (nk4dev).",
    all: async () => (await getAllProjects()).map(fromProject),
    one: async (id) => orNull(await getProjectDetail(id), fromProject),
  },
};

// /blog, /blog/, /blog.md, /blog/<id>, /blog/<id>/ and /blog/<id>.md (same for scraps and dev)
const PAGE = new RegExp(`^/(${Object.keys(sections).join("|")})(?:/([^/.]+))?(\\.md|/)?$`);

/** True when the Accept header lists text/markdown and ranks it at least as high as text/html */
const prefersMarkdown = (accept: string | undefined) => {
  const quality: Record<string, number> = {};
  for (const range of (accept ?? "").split(",")) {
    const [type, ...params] = range.split(";").map((part) => part.trim().toLowerCase());
    const q = params.find((param) => param.startsWith("q="));
    quality[type] = q ? Number(q.slice(2)) || 0 : 1;
  }
  const markdown = quality["text/markdown"] ?? 0;
  return markdown > 0 && markdown >= (quality["text/html"] ?? 0);
};

// YYYY-MM-DD in Japan time, like the dates on the HTML pages
const formatDate = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date(iso));

const escapeLabel = (text: string) => text.replace(/[\\[\]]/g, "\\$&");

/** YAML front matter; strings are written as JSON, which YAML reads as quoted strings */
const frontMatter = (fields: Record<string, string | undefined>) => {
  const lines = Object.entries(fields)
    .filter((field): field is [string, string] => Boolean(field[1]))
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join("\n")}\n---`;
};

const detailMarkdown = (doc: Doc, pageURL: string) => {
  // Some projects link back to their own page; that link adds nothing
  const link = doc.link && doc.link.replace(/\/$/, "") !== pageURL.replace(/\/$/, "") ? doc.link : undefined;
  const parts = [
    frontMatter({
      title: doc.title,
      url: pageURL,
      description: doc.description,
      category: doc.category,
      published: doc.publishedAt,
      updated: doc.revisedAt,
    }),
    `# ${doc.title}`,
    link && `URL: <${link}>`,
    htmlToMarkdown(doc.content, pageURL),
  ];
  return `${parts.filter(Boolean).join("\n\n")}\n`;
};

const listMarkdown = (section: Section, docs: Doc[], pageURL: string) => {
  const items = docs.map((doc) => {
    const url = new URL(markdownPath(`${new URL(pageURL).pathname}${doc.id}/`), pageURL).href;
    const meta = [formatDate(doc.publishedAt), doc.category].filter(Boolean).join(", ");
    return `- [${escapeLabel(doc.title)}](${url}) (${meta})${doc.description ? `: ${doc.description}` : ""}`;
  });
  const parts = [
    frontMatter({ title: section.title, url: pageURL }),
    `# ${section.title}`,
    `> ${section.description}`,
    items.join("\n"),
  ];
  return `${parts.filter(Boolean).join("\n\n")}\n`;
};

markdownRoutes.get("*", async (c, next) => {
  const match = PAGE.exec(c.req.path);
  if (!match) return next();
  const [, name, id, suffix] = match;

  const explicit = suffix === ".md";
  if (!explicit && !prefersMarkdown(c.req.header("Accept"))) {
    // The HTML page shares its URL with the Markdown version, so caches must keep them apart
    await next();
    c.res = new Response(c.res.body, c.res);
    c.res.headers.append("Vary", "Accept");
    return;
  }

  const section = sections[name];
  const pageURL = new URL(id ? `/${name}/${id}/` : `/${name}/`, import.meta.env.SITE ?? c.req.url).href;
  let body: string;
  if (id) {
    const doc = await section.one(id);
    // An unknown page asked for by Accept gets the site's own 404 page
    if (!doc) return explicit ? c.text("Not found", 404) : next();
    body = detailMarkdown(doc, pageURL);
  } else {
    body = listMarkdown(section, await section.all(), pageURL);
  }

  return c.body(body, 200, {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": PUBLIC_CACHE,
    "x-markdown-tokens": String(estimateTokens(body)),
    // Point search engines at the HTML page instead of indexing this copy
    Link: `<${pageURL}>; rel="canonical"`,
    ...(explicit ? {} : { Vary: "Accept" }),
  });
});

/** Paths that are not HTML pages, or have no Markdown version */
const NOT_A_PAGE = /^\/(?:api|preview|_astro|\.well-known)(?:\/|$)|\.[^/]*$/;

const firstMatch = (html: string, pattern: RegExp) => {
  const value = pattern.exec(html)?.[1];
  return value === undefined ? undefined : decodeHTML(value).trim();
};

/**
 * Any other page: render the HTML as usual, then convert its <main> to Markdown.
 * The UI labels are rendered in both languages (T.astro); the English copy and decorative
 * elements are left out so the text is not doubled.
 */
const pageMarkdown = (html: string, fallbackURL: string) => {
  const pageURL = firstMatch(html, /<link rel="canonical" href="([^"]*)"/) ?? fallbackURL;
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/);
  const description = firstMatch(html, /<meta name="description" content="([^"]*)"/);
  const main = /<main\b[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? html;
  const content = htmlToMarkdown(
    main,
    pageURL,
    ({ tag, attrs }) =>
      attrs["data-t"] === "en" || attrs["aria-hidden"] === "true" || ["svg", "button", "dialog"].includes(tag),
  );
  // Most pages have their own <h1>; fall back to the document title for those that do not
  const heading = /^# /m.test(content) || !title ? undefined : `# ${title}`;
  const parts = [frontMatter({ title, url: pageURL, description }), heading, content];
  return { body: `${parts.filter(Boolean).join("\n\n")}\n`, pageURL };
};

markdownRoutes.get("*", async (c, next) => {
  const { path } = c.req;
  if (PAGE.test(path) || NOT_A_PAGE.test(path)) return next();

  const wantsMarkdown = prefersMarkdown(c.req.header("Accept"));
  await next();
  const isHTML = c.res.headers.get("Content-Type")?.startsWith("text/html");
  if (!isHTML) return;

  if (!wantsMarkdown || c.res.status !== 200) {
    // The HTML page shares its URL with the Markdown version, so caches must keep them apart
    c.res = new Response(c.res.body, c.res);
    c.res.headers.append("Vary", "Accept");
    return;
  }

  const fallbackURL = new URL(path, import.meta.env.SITE ?? c.req.url).href;
  const { body, pageURL } = pageMarkdown(await c.res.text(), fallbackURL);
  c.res = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": PUBLIC_CACHE,
      "x-markdown-tokens": String(estimateTokens(body)),
      Link: `<${pageURL}>; rel="canonical"`,
      Vary: "Accept",
    },
  });
});

markdownRoutes.onError((err, c) => {
  console.error(err);
  return c.text("Failed to fetch content", 502);
});

import { Hono } from "hono";
import { handle } from "@astrojs/cloudflare/handler";
import { api } from "./server/api";
import { markdownRoutes } from "./server/markdown";
import { shortLinkRoutes } from "./server/shortlinks";

/**
 * Cloudflare Worker entry (wrangler.jsonc "main").
 * Hono handles the API, short URLs and the Markdown pages for AI agents; every other request
 * goes to the adapter's default Astro handler.
 *
 * We delegate to handle() instead of using the astro/hono middlewares because those
 * never resolve prerendered routes in `astro dev`, so every static page returned 404
 * there. handle() also covers static assets, build-time prerendering and the 404 page.
 */
const app = new Hono<{ Bindings: Env }>({ strict: false });

app.route("/api", api);
app.route("/", shortLinkRoutes);
app.route("/", markdownRoutes);

/**
 * Old URLs whose page no longer exists but whose list does: blog pages past the last one
 * (the old site showed 5 posts per page) and categories that no longer have posts
 */
const RETIRED_LIST = /^\/blog\/(?:page\/\d+|category\/[^/]+(?:\/page\/\d+)?)\/$/;

app.all("*", async (c) => {
  const url = new URL(c.req.url);
  const { pathname } = url;

  // Existing pages and files are served by the asset layer before this Worker runs (it adds a
  // missing trailing slash itself, with 307). Requests that reach here matched no file, so add
  // the slash for URLs without an extension before resolving them, e.g. /blog/page/6 → /blog/page/6/
  const isGet = c.req.method === "GET" || c.req.method === "HEAD";
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (isGet && !pathname.endsWith("/") && !lastSegment.includes(".")) {
    url.pathname = `${pathname}/`;
    return c.redirect(url.toString(), 308);
  }

  const res = await handle(c.req.raw, c.env, c.executionCtx as ExecutionContext);
  if (res.status === 404 && isGet && RETIRED_LIST.test(pathname)) {
    return c.redirect("/blog/", 301);
  }
  return res;
});

export default app;

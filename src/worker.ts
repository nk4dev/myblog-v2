import { Hono } from "hono";
import { handle } from "@astrojs/cloudflare/handler";
import { api } from "./server/api";
import { shortLinkRoutes } from "./server/shortlinks";

/**
 * Cloudflare Worker entry (wrangler.jsonc "main").
 * Hono handles the API and short URLs; every other request goes to the adapter's
 * default Astro handler, unchanged.
 *
 * We delegate to handle() instead of using the astro/hono middlewares because those
 * never resolve prerendered routes in `astro dev`, so every static page returned 404
 * there. handle() also covers static assets, build-time prerendering and the 404 page.
 */
const app = new Hono<{ Bindings: Env }>({ strict: false });

app.route("/api", api);
app.route("/", shortLinkRoutes);

app.all("*", (c) => handle(c.req.raw, c.env, c.executionCtx as ExecutionContext));

export default app;

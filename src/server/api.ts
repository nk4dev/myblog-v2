import { Hono, type Context } from "hono";
import {
  getBlogDetail,
  getBlogs,
  getScrapDetail,
  getScraps,
  type PageOptions,
} from "../lib/microcms";

/** JSON API for the microCMS content, mounted at /api by src/worker.ts */
export const api = new Hono({ strict: false });

const PUBLIC_CACHE = "public, s-maxage=300";
// Draft content must never be stored by a shared cache
const PRIVATE_CACHE = "private, no-store";

/** Read ?limit= and ?offset=, clamped to what microCMS accepts (limit 1-100) */
const pageOptions = (c: Context): PageOptions => {
  const limit = Number(c.req.query("limit") ?? 10);
  const offset = Number(c.req.query("offset") ?? 0);
  return {
    limit: Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 100) : 10,
    offset: Number.isInteger(offset) ? Math.max(offset, 0) : 0,
  };
};

const list = (fetchPage: (options: PageOptions) => Promise<unknown>) => async (c: Context) => {
  c.header("Cache-Control", PUBLIC_CACHE);
  return c.json(await fetchPage(pageOptions(c)));
};

const detail =
  (fetchOne: (id: string, draftKey?: string) => Promise<unknown | null>) => async (c: Context) => {
    const draftKey = c.req.query("draftKey");
    const item = await fetchOne(c.req.param("id")!, draftKey);
    c.header("Cache-Control", draftKey ? PRIVATE_CACHE : PUBLIC_CACHE);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  };

api.get("/blogs", list(getBlogs));
api.get("/blogs/:id", detail(getBlogDetail));
api.get("/scraps", list(getScraps));
api.get("/scraps/:id", detail(getScrapDetail));

// A mounted app's notFound() is not used by the parent, so catch unknown /api paths here
api.all("*", (c) => c.json({ error: "Not found" }, 404));
api.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Failed to fetch content" }, 502);
});

import { Hono } from "hono";
import { shortLinks } from "../data/shortlinks";

/** Short URL redirects and the move of old /articles/* URLs to /blog/* */
export const shortLinkRoutes = new Hono({ strict: false });

for (const [path, target] of Object.entries(shortLinks)) {
  shortLinkRoutes.get(path, (c) => c.redirect(target, 307));
}

// The old site's profile page moved to /about
shortLinkRoutes.get("/whoareyou", (c) => c.redirect("/about/", 308));

// The old site served posts under /articles; the move is permanent
shortLinkRoutes.get("/articles", (c) => c.redirect("/blog/", 308));
shortLinkRoutes.get("/articles/:id{.+}", (c) => {
  const id = c.req.param("id").replace(/\/$/, "");
  return c.redirect(`/blog/${id}/`, 308);
});

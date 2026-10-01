import { socialLinks } from "./social";

const VRCHAT_PROFILE = "https://vrchat.com/home/user/usr_3c0e5ebc-16db-4f61-bdfb-88ff8385a7d4";

/**
 * Short URLs served by the Hono worker (src/server/shortlinks.ts).
 * They redirect with 307 because the targets may change later.
 * The SNS entries come from socialLinks so the header links and the redirects stay in sync.
 */
export const shortLinks: Record<string, string> = {
  ...Object.fromEntries(socialLinks.map(({ slug, url }) => [`/${slug}`, url])),
  "/q": "https://qiita.com/amamiya_dev",
  "/rd2/github": "https://github.com/nk4dev",
  "/vrchat": VRCHAT_PROFILE,
  "/vrcmeikan": "https://vrc-meikan.com/profile/11e503fa-63d2-445f-9b6a-812853492eb4",
  "/l/vx": "https://github.com/nk4dev/vx3",
  "/l/vx/sdk": "https://github.com/nk4dev/vx",
  "/l/vx/docs": "https://apps.nknighta.me/vx/",
  "/l/vx/searchrepo": "https://github.com/nk4dev?tab=repositories&q=vx",
  "/l/xnv": "https://github.com/nknighta/xnv",
  "/dev/vx3-mcp": "https://nk4dev.gitmcp.io/vx3",
  "/nk4dev": "/",
};

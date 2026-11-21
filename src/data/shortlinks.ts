import { socialLinks } from "./social";

export type ShortLinkMeta = {
  url: string;
  title?: string;
  description?: string;
  /** 個別の OGP 画像 URL。省略時は DEFAULT_OG_IMAGE が適用されます */
  image?: string;
};

/** サイト全体のデフォルト OGP 画像 */
export const DEFAULT_OG_IMAGE =
  "https://og-img.nknighta.me/?text=Nknight%20AMAMIYA%40nk4dev";

/**
 * Short URLs served by the Hono worker (src/server/shortlinks.ts).
 * Includes title, description, and image for rich OGP previews when shared on SNS/chat.
 */
export const shortLinkMetaMap: Record<string, ShortLinkMeta> = {
  ...Object.fromEntries(
    socialLinks.map(({ slug, url, title, description, image }) => [
      `/${slug}`,
      { url, title, description, image },
    ]),
  ),
  "/q": {
    url: "https://qiita.com/amamiya_dev",
    title: "Qiita (@amamiya_dev)",
    description: "Nknight AMAMIYA の Qiita アカウント",
  },
  "/rd2/github": {
    url: "https://github.com/nk4dev",
    title: "GitHub (@nk4dev)",
    description: "Nknight AMAMIYA (nk4dev) の GitHub",
  },
  "/vrchat": {
    url: "/?utm_source=nknighta_site&utm_medium=old_vrc_shortlink",
    title: "VRChat (Nknight AMAMIYA)",
    description: "Nknight AMAMIYA の VRChat profile",
  },
  "/vrcmeikan": {
    url: "https://vrc-meikan.com/profile/11e503fa-63d2-445f-9b6a-812853492eb4",
    title: "VRC名鑑 (Nknight AMAMIYA)",
    description: "Nknight AMAMIYA の VRC名鑑プロフィール",
    image: "https://nknighta.me/static/vrcmeikan-ogp.jpg"
  },
  "/l/vx": {
    url: "https://github.com/nk4dev/vx3",
    title: "vx3 (GitHub)",
    description: "vx3 repository on GitHub",
  },
  "/l/vx/sdk": {
    url: "https://github.com/nk4dev/vx",
    title: "vx SDK (GitHub)",
    description: "vx SDK repository on GitHub",
  },
  "/l/vx/docs": {
    url: "https://apps.nknighta.me/vx/",
    title: "vx Documentation",
    description: "Documentation for vx",
  },
  "/l/vx/searchrepo": {
    url: "https://github.com/nk4dev?tab=repositories&q=vx",
    title: "vx Repositories (GitHub)",
    description: "vx related repositories on GitHub",
  },
  "/vx": {
    url: "https://vx.nknighta.me",
    title: "VX3 SDK documentation",
    description: "VX3 sdk docs by nk4dev",
  },
  "/l/xnv": {
    url: "https://github.com/nknighta/xnv",
    title: "xnv (GitHub)",
    description: "xnv repository on GitHub",
  },
  "/dev/vx3-mcp": {
    url: "https://nk4dev.gitmcp.io/vx3",
    title: "vx3 MCP Server",
    description: "vx3 MCP server documentation",
  },
  "/nk4dev": {
    url: "/",
    title: "Nknight AMAMIYA@nk4dev",
    description: "Nknight AMAMIYA (nk4dev) 's blog",
  },
};

export const shortLinks: Record<string, string> = Object.fromEntries(
  Object.entries(shortLinkMetaMap).map(([path, { url }]) => [path, url]),
);

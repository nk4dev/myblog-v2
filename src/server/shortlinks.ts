import { Hono, type Context } from "hono";
import { DEFAULT_OG_IMAGE, shortLinkMetaMap, type ShortLinkMeta } from "../data/shortlinks";

/** Short URL redirects with OGP support for SNS/chat bots, and legacy URL redirects */
export const shortLinkRoutes = new Hono({ strict: false });

const siteName = "Nknight AMAMIYA@nk4dev";
const BOT_REGEX =
  /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|slackbot|discordbot|whatsapp|telegrambot|line-poker|applebot|linkedinbot/i;

/**
 * HTML の特殊文字をエスケープする
 *
 * @param str - エスケープ対象の文字列
 * @returns エスケープ後の安全な文字列
 */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * SNS・チャットボット向けに OGP タグと即時リダイレクト処理を含んだ HTML を生成する
 *
 * @param path - ショートリンクのパス（例: "/x", "/g"）
 * @param meta - ショートリンクのメタ情報（URL, タイトル, 説明文, 画像）
 * @param siteOrigin - サイトのオリジン URL（例: "https://nknighta.me"）
 * @returns OGP タグ付きの HTML 文字列
 */
const renderOgpRedirectHtml = (
  path: string,
  meta: ShortLinkMeta,
  siteOrigin: string,
): string => {
  const pageUrl = new URL(path, siteOrigin).href;
  const title = meta.title ? `${meta.title} | ${siteName}` : siteName;
  const description = meta.description ?? `${meta.title ?? path} へのリンク`;
  // 設定されていれば指定の画像、なければサイト全体のデフォルト OGP 画像を適用
  const ogImage = meta.image ?? DEFAULT_OG_IMAGE;

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(meta.url)}" />

    <!-- OGP -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(siteName)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="nknighta.me" />
    <meta name="twitter:creator" content="@nk4dev" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

    <!-- ブラウザ用フォールバック -->
    <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.url)}" />
  </head>
  <body>
    <p>Redirecting to <a href="${escapeHtml(meta.url)}">${escapeHtml(meta.title ?? meta.url)}</a>...</p>
    <script>location.replace(${JSON.stringify(meta.url)});</script>
  </body>
</html>`;
};

/**
 * 各ショートリンクのリクエストを処理するハンドラーを生成する
 *
 * @param path - ショートリンクのパス
 * @param meta - ショートリンクのメタ情報
 * @returns Hono のハンドラー関数
 */
const createShortLinkHandler = (path: string, meta: ShortLinkMeta) => (c: Context) => {
  const userAgent = c.req.header("user-agent") ?? "";
  const isBot = BOT_REGEX.test(userAgent);

  // 一般のブラウザアクセスは高速に 307 リダイレクト
  if (!isBot) {
    return c.redirect(meta.url, 307);
  }

  // SNSクローラー・ボット向け: OGP タグを含んだ HTML を返す
  const siteOrigin = import.meta.env.SITE ?? new URL(c.req.url).origin;
  const html = renderOgpRedirectHtml(path, meta, siteOrigin);

  return c.html(html, 200, {
    "Cache-Control": "public, max-age=3600",
  });
};

for (const [path, meta] of Object.entries(shortLinkMetaMap)) {
  const handler = createShortLinkHandler(path, meta);
  shortLinkRoutes.get(path, handler);
  shortLinkRoutes.get(`${path}/`, handler);
}

// The old site's profile page moved to /about
shortLinkRoutes.get("/whoareyou", (c) => c.redirect("/about/", 308));
shortLinkRoutes.get("/whoareyou/", (c) => c.redirect("/about/", 308));

// The old site served posts under /articles; the move is permanent
shortLinkRoutes.get("/articles", (c) => c.redirect("/blog/", 308));
shortLinkRoutes.get("/articles/", (c) => c.redirect("/blog/", 308));
shortLinkRoutes.get("/articles/:id{.+}", (c) => {
  const id = c.req.param("id").replace(/\/$/, "");
  return c.redirect(`/blog/${id}/`, 308);
});

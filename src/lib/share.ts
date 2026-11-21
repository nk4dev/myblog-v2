/** Hashtags added to every share. Article pages append their category */
export const SITE_HASHTAGS = ["nk4dev"];

/** Public URL of a page. Served URLs end with "/" (/blog → /blog/), so match that */
export const canonicalURL = (url: URL, site: URL | undefined) =>
  new URL(url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`, site);

/**
 * Turn a label into a hashtag X will recognize: letters (any script), digits and "_" only,
 * and not digits alone. Returns null when nothing usable is left (e.g. "AI/LLM" → "AILLM").
 */
export const toHashtag = (label: string) => {
  const tag = label.replace(/[^\p{L}\p{N}_]/gu, "");
  return tag && !/^\d+$/.test(tag) ? tag : null;
};

/** Where on the page the share control sits; sent as utm_content */
export type SharePlacement = "article" | "footer";

export type ShareTarget = { text: string; url: string; hashtags?: string[]; placement?: SharePlacement };

/**
 * Tag a shared URL so visits can be traced back to the service it was shared on.
 * The page's canonical link and og:url stay clean, so search engines and cards still use the plain URL.
 */
export const withUtm = (url: string, source: string, placement?: SharePlacement) => {
  const tagged = new URL(url);
  tagged.searchParams.set("utm_source", source);
  tagged.searchParams.set("utm_medium", "social");
  tagged.searchParams.set("utm_campaign", "share");
  if (placement) tagged.searchParams.set("utm_content", placement);
  return tagged.toString();
};

/** Usable, de-duplicated hashtags without the leading "#" */
const cleanHashtags = (hashtags: string[] = []) => [
  ...new Set(hashtags.map(toHashtag).filter((t): t is string => t !== null)),
];

/** X's post intent URL with the text, page URL and hashtags */
export const xShareURL = ({ text, url, hashtags, placement }: ShareTarget) => {
  const tags = cleanHashtags(hashtags);
  const params = new URLSearchParams({ text, url: withUtm(url, "x", placement) });
  if (tags.length > 0) params.set("hashtags", tags.join(","));
  return `https://x.com/intent/post?${params}`;
};

/** Bluesky's compose intent only takes text, so the hashtags and URL go into it (Bluesky links both) */
export const blueskyShareURL = ({ text, url, hashtags, placement }: ShareTarget) => {
  const tags = cleanHashtags(hashtags).map((t) => `#${t}`);
  const body = [text, tags.join(" "), withUtm(url, "bluesky", placement)].filter(Boolean).join("\n");
  return `https://bsky.app/intent/compose?${new URLSearchParams({ text: body })}`;
};

/**
 * Hatena Bookmark's "add" page for the URL, with the title as a hint.
 * No UTM here: bookmarks are counted per exact URL, so tagged URLs would split the count
 */
export const hatenaShareURL = ({ text, url }: ShareTarget) =>
  `https://b.hatena.ne.jp/add?${new URLSearchParams({ mode: "confirm", url, title: text })}`;

/** LINE's share page; it reads the title from the page itself */
export const lineShareURL = ({ url, placement }: ShareTarget) =>
  `https://social-plugins.line.me/lineit/share?${new URLSearchParams({ url: withUtm(url, "line", placement) })}`;

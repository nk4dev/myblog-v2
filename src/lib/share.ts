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

/** X's post intent URL with the text, page URL and hashtags */
export const xShareURL = ({ text, url, hashtags = [] }: { text: string; url: string; hashtags?: string[] }) => {
  const tags = [...new Set(hashtags.map(toHashtag).filter((t): t is string => t !== null))];
  const params = new URLSearchParams({ text, url });
  if (tags.length > 0) params.set("hashtags", tags.join(","));
  return `https://x.com/intent/post?${params}`;
};

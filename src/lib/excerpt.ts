/** HTML からタグを除去し、空白を詰めたプレーンテキストにする */
export const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** HTML 本文から meta description 用の抜粋を作る（length 文字で切る） */
export const excerpt = (html: string, length = 120): string => {
  const text = stripHtml(html);
  return text.length > length ? `${text.slice(0, length)}…` : text;
};

import { stripHtml } from "./excerpt";

export type Heading = { level: 2 | 3; id: string; text: string };

/**
 * 本文 HTML の h2 / h3 を目次用に集める。
 * microCMS のリッチエディタは見出しに id を付けるが、無い場合は section-N を振る。
 */
export const withHeadings = (html: string): { html: string; headings: Heading[] } => {
  const headings: Heading[] = [];
  let count = 0;
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_, level: string, attrs: string, inner: string) => {
    let id = attrs.match(/\sid="([^"]+)"/)?.[1];
    if (!id) {
      id = `section-${++count}`;
      attrs += ` id="${id}"`;
    }
    headings.push({ level: Number(level) as 2 | 3, id, text: stripHtml(inner) });
    return `<h${level}${attrs}>${inner}</h${level}>`;
  });
  return { html: out, headings };
};

/** 日本語は 1 分あたり約 500 字として読了時間を見積もる */
export const readingMinutes = (html: string): number =>
  Math.max(1, Math.round(stripHtml(html).length / 500));

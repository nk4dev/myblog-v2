/**
 * HTML → Markdown for the microCMS rich editor output, used by the Markdown pages for AI agents
 * (src/server/markdown.ts). It covers the tags the editor emits; unknown tags keep their text.
 */

/** Markdown version of a page path: "/blog/foo/" → "/blog/foo.md", "/blog/" → "/blog.md" */
export const markdownPath = (path: string) => `${path.replace(/\/$/, "")}.md`;

type Element = { tag: string; attrs: Record<string, string>; children: Node[] };
type Node = Element | string;

const VOID_TAGS = new Set(["br", "hr", "img", "input", "source", "wbr", "col", "embed", "meta", "link"]);
const DROPPED_TAGS = new Set(["script", "style", "template", "noscript"]);
const BLOCK_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "pre", "blockquote", "table", "hr",
  "figure", "figcaption", "div", "section", "article", "iframe", "details", "summary",
]);

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name: string) => {
    if (name[0] !== "#") return ENTITIES[name.toLowerCase()] ?? match;
    const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });

/** Decode the character references in an HTML text or attribute value */
export const decodeHTML = (text: string) => decodeEntities(text);

const parseAttrs = (source: string) => {
  const attrs: Record<string, string> = {};
  for (const [, name, dq, sq, bare] of source.matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+)))?/g)) {
    attrs[name.toLowerCase()] = decodeEntities(dq ?? sq ?? bare ?? "");
  }
  return attrs;
};

/** Build a loose tree: unclosed tags are closed by their parent, stray closing tags are ignored */
const parse = (html: string): Node[] => {
  const root: Element = { tag: "", attrs: {}, children: [] };
  const stack = [root];
  const tokens = html.matchAll(/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g);
  for (const [token, closing, name, attrSource] of tokens) {
    const parent = stack[stack.length - 1];
    if (!name) {
      if (!token.startsWith("<!--")) parent.children.push(token);
      continue;
    }
    const tag = name.toLowerCase();
    if (closing) {
      const open = stack.findLastIndex((el) => el.tag === tag);
      if (open > 0) stack.length = open;
      continue;
    }
    const element: Element = { tag, attrs: parseAttrs(attrSource), children: [] };
    parent.children.push(element);
    if (!VOID_TAGS.has(tag) && !attrSource.endsWith("/")) stack.push(element);
  }
  return root.children;
};

/** Text of a subtree as written, for code where whitespace and symbols must stay untouched */
const rawText = (nodes: Node[]): string =>
  nodes
    .map((node) => {
      if (typeof node === "string") return decodeEntities(node);
      return node.tag === "br" ? "\n" : rawText(node.children);
    })
    .join("");

const isBlock = (node: Node) => typeof node !== "string" && BLOCK_TAGS.has(node.tag);

/** Escape characters that would start Markdown syntax in running text. "_" inside a word is literal */
const escapeText = (text: string) =>
  text.replace(/[\\`*[\]<]/g, "\\$&").replace(/(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])/gu, "\\_");

/** A backtick fence longer than any run of backticks in the code */
const fenceFor = (code: string, min: number) => {
  const longest = Math.max(0, ...[...code.matchAll(/`+/g)].map(([run]) => run.length));
  return "`".repeat(Math.max(min, longest + 1));
};

/** Wrap text in an emphasis mark, keeping the surrounding spaces outside so the mark still applies */
const wrap = (text: string, mark: string) => {
  const inner = text.trim();
  if (!inner) return text;
  const lead = text.slice(0, text.length - text.trimStart().length);
  const trail = text.slice(text.trimEnd().length);
  return `${lead}${mark}${inner}${mark}${trail}`;
};

type Context = {
  base?: URL;
  /** Elements to leave out entirely, e.g. the second language of a bilingual label */
  ignore?: (element: Element) => boolean;
};

const resolveURL = (href: string, { base }: Context) => {
  let url = href.trim();
  if (base && !/^(#|mailto:|tel:)/i.test(url)) {
    try {
      url = new URL(url, base).href;
    } catch {
      // Keep an unparsable URL as written
    }
  }
  return url.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
};

const inline = (nodes: Node[], ctx: Context): string =>
  nodes
    .map((node): string => {
      if (typeof node === "string") return escapeText(decodeEntities(node).replace(/\s+/g, " "));
      const { tag, attrs, children } = node;
      if (DROPPED_TAGS.has(tag) || ctx.ignore?.(node)) return "";
      switch (tag) {
        case "br":
          // Text nodes have their newlines collapsed, so "\n" only ever means a line break here
          return "\n";
        case "strong":
        case "b":
          return wrap(inline(children, ctx), "**");
        case "em":
        case "i":
          return wrap(inline(children, ctx), "*");
        case "s":
        case "del":
        case "strike":
          return wrap(inline(children, ctx), "~~");
        case "code": {
          const code = rawText(children).replace(/\s+/g, " ");
          if (!code.trim()) return code;
          const fence = fenceFor(code, 1);
          const pad = code.startsWith("`") || code.endsWith("`") ? " " : "";
          return `${fence}${pad}${code}${pad}${fence}`;
        }
        case "a": {
          const text = inline(children, ctx).trim();
          if (!attrs.href) return text;
          const url = resolveURL(attrs.href, ctx);
          return `[${text || escapeText(url)}](${url})`;
        }
        case "img":
          return attrs.src ? `![${escapeText(attrs.alt ?? "")}](${resolveURL(attrs.src, ctx)})` : "";
        default:
          return inline(children, ctx);
      }
    })
    .join("");

/** Keep a line of text from being read as a heading, list item or quote */
const escapeLineStart = (text: string) =>
  text.replace(/^([#>+-])(?=\s|#|$)/, "\\$1").replace(/^(\d+)([.)])(?=\s|$)/, "$1\\$2");

/** Inline content as one paragraph; <br> becomes a hard line break ("\" at the end of the line) */
const paragraph = (nodes: Node[], ctx: Context) =>
  inline(nodes, ctx)
    .split("\n")
    .map((line) => escapeLineStart(line.trim()))
    .filter(Boolean)
    .join("\\\n");

const indent = (text: string, prefix: string) =>
  text
    .split("\n")
    .map((line) => (line ? prefix + line : line))
    .join("\n");

const list = ({ tag, attrs, children }: Element, ctx: Context) => {
  const items = children.filter((child): child is Element => typeof child !== "string" && child.tag === "li");
  const start = Number.parseInt(attrs.start ?? "", 10) || 1;
  return items
    .map((item, i) => {
      const marker = tag === "ol" ? `${start + i}. ` : "- ";
      // Items holding paragraphs are separated by blank lines so the paragraphs stay apart
      const loose = item.children.some((child) => typeof child !== "string" && child.tag === "p");
      const body = blocks(item.children, ctx).join(loose ? "\n\n" : "\n");
      return marker + indent(body, " ".repeat(marker.length)).trimStart();
    })
    .join("\n");
};

const codeBlock = ({ attrs, children }: Element) => {
  const codeElement = children.find((child): child is Element => typeof child !== "string" && child.tag === "code");
  const language = /(?:^|\s)language-([\w+#.-]+)/.exec(codeElement?.attrs.class ?? attrs.class ?? "")?.[1] ?? "";
  const code = rawText(children).replace(/^\n+|\s+$/g, "");
  const fence = fenceFor(code, 3);
  return `${fence}${language}\n${code}\n${fence}`;
};

/** GFM table. Markdown tables need a header row, so the first row is used when there is no <th> */
const table = (element: Element, ctx: Context) => {
  const rows: Element[] = [];
  const collect = (nodes: Node[]) => {
    for (const node of nodes) {
      if (typeof node === "string") continue;
      if (node.tag === "tr") rows.push(node);
      else if (node.tag !== "table") collect(node.children);
    }
  };
  collect(element.children);

  const cells = rows
    .map((row) =>
      row.children
        .filter((cell): cell is Element => typeof cell !== "string" && (cell.tag === "th" || cell.tag === "td"))
        .map((cell) => blocks(cell.children, ctx).join(" ").replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|")),
    )
    .filter((row) => row.length > 0);
  if (cells.length === 0) return "";

  const width = Math.max(...cells.map((row) => row.length));
  const line = (row: string[]) => `| ${Array.from({ length: width }, (_, i) => row[i] ?? "").join(" | ")} |`;
  const [header, ...body] = cells;
  return [line(header), line(Array(width).fill("---")), ...body.map(line)].join("\n");
};

/** Render nodes as Markdown blocks. Runs of text and inline tags between block tags become paragraphs */
const blocks = (nodes: Node[], ctx: Context): string[] => {
  const out: string[] = [];
  let run: Node[] = [];
  const flush = () => {
    const text = paragraph(run, ctx);
    if (text) out.push(text);
    run = [];
  };

  for (const node of nodes) {
    if (typeof node !== "string" && ctx.ignore?.(node)) continue;
    if (!isBlock(node)) {
      run.push(node);
      continue;
    }
    flush();
    const element = node as Element;
    const { tag, attrs, children } = element;
    let block = "";
    if (/^h[1-6]$/.test(tag)) {
      const text = inline(children, ctx).replace(/\s*\n\s*/g, " ").trim();
      block = text && `${"#".repeat(Number(tag[1]))} ${text}`;
    } else if (tag === "ul" || tag === "ol") {
      block = list(element, ctx);
    } else if (tag === "pre") {
      block = codeBlock(element);
    } else if (tag === "blockquote") {
      block = indent(blocks(children, ctx).join("\n\n"), "> ").replace(/^$/gm, ">");
    } else if (tag === "table") {
      block = table(element, ctx);
    } else if (tag === "hr") {
      block = "---";
    } else if (tag === "iframe") {
      block = attrs.src ? `[${escapeText(attrs.title || "Embedded content")}](${resolveURL(attrs.src, ctx)})` : "";
    } else {
      // p, div, figure and other containers: their content, which may itself hold blocks
      out.push(...blocks(children, ctx));
    }
    if (block) out.push(block);
  }
  flush();
  return out;
};

/**
 * Convert rich editor HTML to Markdown. Relative links and image URLs are resolved against base
 * so they still work when the Markdown is read away from the page.
 */
export const htmlToMarkdown = (
  html: string,
  base?: URL | string,
  ignore?: (element: { tag: string; attrs: Record<string, string> }) => boolean,
): string => blocks(parse(html), { base: base ? new URL(base) : undefined, ignore }).join("\n\n");

/**
 * Rough token count of a text, sent as x-markdown-tokens.
 * CJK characters are about one token each; other text is about four characters per token.
 */
export const estimateTokens = (text: string) => {
  const cjk = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  return cjk + Math.ceil((text.length - cjk) / 4);
};

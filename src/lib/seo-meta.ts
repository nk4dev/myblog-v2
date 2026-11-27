import type { Blog } from "../types/blog";
import type { Scrap } from "../types/scrap";
import {
  extractPostTags,
  inferTopicTags,
  normalizeTag,
  parseKeywordString,
} from "./blog-tags";
import { excerpt, stripHtml } from "./excerpt";

/** High-intent search terms tracked for organic CTR and consistent metadata */
export const TARGET_SEARCH_TERMS: readonly {
  label: string;
  pattern: RegExp;
}[] = [
  { label: "ALCOM", pattern: /\balcom\b/i },
  { label: "WiVRn", pattern: /\bwivrn\b/i },
  {
    label: "Allow Untrusted URLs",
    pattern: /allow\s+untrusted\s+urls?|untrusted\s+urls?/i,
  },
  { label: "VRCBrowser", pattern: /vrc[-_]?browser/i },
  { label: "VRChat", pattern: /vrchat|\bvrc\b/i },
  { label: "Ubuntu", pattern: /\bubuntu\b/i },
  { label: "Linux", pattern: /\blinux\b/i },
  { label: "Agent Skills", pattern: /agent[\s-]*skills?/i },
  { label: "SKILL.md", pattern: /skill\.md/i },
  { label: ".agents/skills", pattern: /\.agents\/skills/i },
  { label: "frontmatter", pattern: /\bfrontmatter\b/i },
  { label: "WebMCP", pattern: /\bwebmcp\b/i },
];

const detectVerifiedTerms = (text: string): string[] => {
  const matched: string[] = [];
  for (const { label, pattern } of TARGET_SEARCH_TERMS) {
    if (pattern.test(text)) matched.push(label);
  }
  return matched;
};

const mergeUniqueKeywords = (items: (string | undefined)[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    if (!item) continue;
    const normalized = normalizeTag(item);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
};

const enrichDescription = (
  explicitDesc: string | undefined,
  fallbackBody: string | undefined,
  title: string,
  verifiedTerms: string[],
): string => {
  const trimmed = explicitDesc?.trim() ?? "";
  if (trimmed.length >= 50) return trimmed;

  const base = trimmed || excerpt(fallbackBody ?? "", 130) || title;
  const lowerBase = base.toLowerCase();
  const missing = verifiedTerms
    .filter((term) => !lowerBase.includes(term.toLowerCase()))
    .slice(0, 3);
  if (missing.length === 0) return base;

  const candidate = `${base}（${missing.join("・")}）`;
  return candidate.length <= 160 ? candidate : base;
};

/** Resolve meta description, keywords, and normalized tags for a blog post */
export const resolveBlogSeoMeta = (
  post: Blog,
): { description: string; keywords: string; tags: string[] } => {
  const tags = extractPostTags(post, { includeContent: true });
  const fullText = [
    post.id,
    post.title,
    post.description ?? "",
    stripHtml(post.content),
  ].join(" ");
  const verifiedTerms = detectVerifiedTerms(fullText);

  const keywords = mergeUniqueKeywords([
    ...parseKeywordString(post.seo_word),
    post.category?.name,
    ...tags,
    ...verifiedTerms,
  ]).join(", ");

  const description = enrichDescription(
    post.description,
    post.content,
    post.title,
    verifiedTerms,
  );
  return { description, keywords, tags };
};

/** Resolve meta description, keywords, and inferred tags for a scrap page */
export const resolveScrapSeoMeta = (
  scrap: Scrap,
): { description: string; keywords: string; tags: string[] } => {
  const fullText = [
    scrap.id,
    scrap.title,
    scrap.category ?? "",
    stripHtml(scrap.content),
  ].join(" ");
  const verifiedTerms = detectVerifiedTerms(fullText);
  const inferred = inferTopicTags(fullText);
  const tags = mergeUniqueKeywords([
    scrap.category,
    ...inferred,
    ...verifiedTerms,
  ]);
  const keywords = tags.join(", ");
  const description = enrichDescription(
    undefined,
    scrap.content,
    scrap.title,
    verifiedTerms,
  );
  return { description, keywords, tags };
};

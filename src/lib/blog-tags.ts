import type { Blog } from "../types/blog";
import { stripHtml } from "./excerpt";

/** Build the URL for a tag-filtered blog list */
export const tagPath = (tag: string): string =>
  `/blog/?tag=${encodeURIComponent(tag)}`;

const TAG_ALIASES: Record<string, string> = {
  vrchat: "VRChat",
  alcom: "ALCOM",
  wivrn: "WiVRn",
  vrcbrowser: "VRCBrowser",
  vrc_browser: "VRCBrowser",
  "vrc-browser": "VRCBrowser",
  linux: "Linux",
  ubuntu: "Ubuntu",
  unity: "Unity",
  "agent skills": "Agent Skills",
  agentskills: "Agent Skills",
  "agent-skills": "Agent Skills",
  "skill.md": "SKILL.md",
  ".agents/skills": ".agents/skills",
  frontmatter: "frontmatter",
  "allow untrusted urls": "Allow Untrusted URLs",
  "untrusted urls": "Allow Untrusted URLs",
  webmcp: "WebMCP",
  mcp: "MCP",
  ai: "AI",
  llm: "LLM",
  "ai / llm": "AI / LLM",
  "ai/llm": "AI / LLM",
  antigravity: "Antigravity",
  astro: "Astro",
  "next.js": "Next.js",
  nextjs: "Next.js",
  cloudflare: "Cloudflare",
  typescript: "TypeScript",
  web3: "Web3",
  flutter: "Flutter",
  firebase: "Firebase",
};

/** Trim, collapse spaces, and map known lowercase variants to canonical casing */
export const normalizeTag = (raw: string): string => {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return TAG_ALIASES[cleaned.toLowerCase()] ?? cleaned;
};

/** Split comma- or newline-separated keyword strings into unique normalized tags */
export const parseKeywordString = (raw?: string): string[] => {
  if (!raw) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(/[,、，\n]+/)) {
    const tag = normalizeTag(part);
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
  }
  return result;
};

const TOPIC_PATTERNS: readonly { tag: string; pattern: RegExp }[] = [
  { tag: "VRChat", pattern: /vrchat|\bvrc\b|vrc[-_]/i },
  { tag: "Linux", pattern: /\blinux\b/i },
  { tag: "Ubuntu", pattern: /\bubuntu\b/i },
  { tag: "ALCOM", pattern: /\balcom\b/i },
  { tag: "WiVRn", pattern: /\bwivrn\b/i },
  { tag: "VRCBrowser", pattern: /vrc[-_]?browser/i },
  { tag: "Unity", pattern: /\bunity\b/i },
  {
    tag: "Allow Untrusted URLs",
    pattern: /allow\s+untrusted\s+urls?|untrusted\s+urls?/i,
  },
  {
    tag: "Agent Skills",
    pattern: /agent[\s-]*skills?|skill\.md|\.agents\/skills/i,
  },
  { tag: "SKILL.md", pattern: /skill\.md/i },
  {
    tag: "AI / LLM",
    pattern: /\b(?:llm|webmcp|mcp|antigravity)\b|ai[-_]?scraps/i,
  },
  { tag: "Astro", pattern: /\bastro\b/i },
  { tag: "Next.js", pattern: /next\.?js/i },
  { tag: "Cloudflare", pattern: /cloudflare/i },
  { tag: "TypeScript", pattern: /typescript/i },
  { tag: "Web3", pattern: /\b(?:web3|vx3?|xnv)\b/i },
  { tag: "Flutter", pattern: /\bflutter\b/i },
  { tag: "Firebase", pattern: /\bfirebase\b/i },
];

/** Conservatively infer canonical topic tags from text */
export const inferTopicTags = (text: string): string[] => {
  if (!text) return [];
  const tags: string[] = [];
  for (const { tag, pattern } of TOPIC_PATTERNS) {
    if (pattern.test(text)) tags.push(tag);
  }
  return tags;
};

export type ExtractTagsOptions = {
  max?: number;
  includeContent?: boolean;
};

/**
 * Extract normalized, case-insensitively deduplicated tags for a blog post
 * from explicit tags, seo_word keywords, and conservative topic inference.
 */
export const extractPostTags = (
  post: Blog,
  options: ExtractTagsOptions = {},
): string[] => {
  const { max, includeContent = false } = options;
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (raw: string) => {
    const tag = normalizeTag(raw);
    if (!tag) return;
    const key = tag.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(tag);
  };

  if (Array.isArray(post.tags)) {
    for (const item of post.tags) {
      add(typeof item === "string" ? item : item.name);
    }
  }

  for (const kw of parseKeywordString(post.seo_word)) {
    add(kw);
  }

  const textParts = [
    post.id,
    post.title,
    post.description ?? "",
    post.category?.name ?? "",
  ];
  if (includeContent && post.content) {
    textParts.push(stripHtml(post.content));
  }
  for (const inferred of inferTopicTags(textParts.join(" "))) {
    add(inferred);
  }

  return max !== undefined ? result.slice(0, max) : result;
};

/** Count tags across posts, sorted by count descending then tag name ascending */
export const collectTags = (
  posts: Blog[],
): { tag: string; count: number }[] => {
  const map = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of extractPostTags(post)) {
      const key = tag.toLowerCase();
      const entry = map.get(key);
      if (entry) entry.count++;
      else map.set(key, { tag, count: 1 });
    }
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
};

/** Filter posts whose extracted tags or category name match the given tag case-insensitively */
export const filterPostsByTag = (posts: Blog[], tag: string): Blog[] => {
  const needle = normalizeTag(tag).toLowerCase();
  if (!needle) return posts;
  return posts.filter((post) => {
    if (
      post.category?.name &&
      normalizeTag(post.category.name).toLowerCase() === needle
    ) {
      return true;
    }
    return extractPostTags(post).some((t) => t.toLowerCase() === needle);
  });
};

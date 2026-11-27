import type { Blog } from "../types/blog";
import type { Project } from "../types/project";
import type { Scrap } from "../types/scrap";
import { extractPostTags, inferTopicTags, normalizeTag } from "./blog-tags";
import { stripHtml } from "./excerpt";

/** High-interest core article IDs used as fallback anchors when tag matches are scarce */
export const CORE_POST_IDS = [
  "vrc-on-ubuntu",
  "vrc-unity-on-ubuntu",
  "vrc_browser_howto",
  "ubuntu_googledrive",
] as const;

const CORE_TOPIC_TAGS = new Set([
  "vrchat",
  "linux",
  "ubuntu",
  "alcom",
  "wivrn",
  "vrcbrowser",
  "agent skills",
]);

/** Known app/project keys mapped to likely blog post IDs */
const APP_BLOG_SLUG_HINTS: Record<string, string[]> = {
  vrcbrowser: ["vrc_browser_howto", "vrcbrowser"],
  ytimagedl: ["ytimage-dl", "ytimage_dl", "ytimage"],
  groveplayer: ["grove-player", "grove_player", "grove"],
  hazy: ["hazy"],
};

const postTimestamp = (post: {
  publishedAt?: string;
  createdAt: string;
}): number => {
  const value = Date.parse(post.publishedAt ?? post.createdAt);
  return Number.isNaN(value) ? 0 : value;
};

const hasCoreTopicTag = (post: Blog): boolean =>
  extractPostTags(post).some((tag) => CORE_TOPIC_TAGS.has(tag.toLowerCase()));

const coreRank = (id: string): number => {
  const idx = CORE_POST_IDS.indexOf(id as (typeof CORE_POST_IDS)[number]);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

/** Fill remaining slots with core posts first, then core-topic posts, then newest posts */
const fillWithFallback = (
  picked: Blog[],
  pool: Blog[],
  limit: number,
): Blog[] => {
  if (picked.length >= limit) return picked.slice(0, limit);
  const used = new Set(picked.map((p) => p.id));
  const remaining = pool.filter((p) => !used.has(p.id));

  const tier1 = remaining
    .filter((p) => coreRank(p.id) !== Number.MAX_SAFE_INTEGER)
    .sort((a, b) => coreRank(a.id) - coreRank(b.id));
  const tier2 = remaining
    .filter(
      (p) => coreRank(p.id) === Number.MAX_SAFE_INTEGER && hasCoreTopicTag(p),
    )
    .sort((a, b) => postTimestamp(b) - postTimestamp(a));
  const tier3 = remaining
    .filter(
      (p) => coreRank(p.id) === Number.MAX_SAFE_INTEGER && !hasCoreTopicTag(p),
    )
    .sort((a, b) => postTimestamp(b) - postTimestamp(a));

  return [...picked, ...tier1, ...tier2, ...tier3].slice(0, limit);
};

/** Score candidate blog posts by matching category (+4) and shared normalized tags (+3 each) */
const rankCandidatesByTopic = (
  candidates: Blog[],
  targetTags: Set<string>,
  matchCategory: (post: Blog) => boolean,
): Blog[] =>
  candidates
    .map((post) => {
      let score = matchCategory(post) ? 4 : 0;
      const postTags = extractPostTags(post, { includeContent: true }).map(
        (t) => t.toLowerCase(),
      );
      for (const tag of postTags) {
        if (targetTags.has(tag)) score += 3;
      }
      return { post, score, time: postTimestamp(post) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.time - a.time)
    .map((item) => item.post);

const buildTopicTagsFromItem = (item: {
  id: string;
  title: string;
  category?: string;
  content?: string;
}): { tags: Set<string>; categoryLower: string } => {
  const text = [
    item.id,
    item.title,
    item.category ?? "",
    stripHtml(item.content),
  ].join(" ");
  const tags = new Set(inferTopicTags(text).map((t) => t.toLowerCase()));
  const categoryLower = item.category
    ? normalizeTag(item.category).toLowerCase()
    : "";
  if (categoryLower) tags.add(categoryLower);
  return { tags, categoryLower };
};

/**
 * Select related blog posts for a given blog post:
 * 1. Exclude the current post.
 * 2. Prioritize shared category (+4) and shared normalized tags (+3 each), sorted by score then recency.
 * 3. Fill remaining slots up to `limit` with core Linux/VRChat/tooling posts and recent posts.
 */
export const getRelatedPosts = (
  current: Blog,
  allPosts: Blog[],
  limit = 3,
): Blog[] => {
  const candidates = allPosts.filter((post) => post.id !== current.id);
  const currentTags = new Set(
    extractPostTags(current, { includeContent: true }).map((t) =>
      t.toLowerCase(),
    ),
  );
  const scored = rankCandidatesByTopic(candidates, currentTags, (post) =>
    Boolean(current.category?.id && post.category?.id === current.category.id),
  );
  return fillWithFallback(scored, candidates, limit);
};

/** Select related blog posts for a scrap page based on title, category, and body content */
export const getRelatedPostsForScrap = (
  scrap: Scrap,
  allBlogs: Blog[],
  limit = 3,
): Blog[] => {
  const { tags, categoryLower } = buildTopicTagsFromItem(scrap);
  const scored = rankCandidatesByTopic(allBlogs, tags, (post) =>
    Boolean(
      categoryLower &&
      post.category?.name &&
      normalizeTag(post.category.name).toLowerCase() === categoryLower,
    ),
  );
  return fillWithFallback(scored, allBlogs, limit);
};

const normalizeKey = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Find the best matching blog post for an app or dev project.
 * Returns undefined if no real post matches (never invents URLs).
 */
export const findRelatedBlogForApp = (
  nameOrId: string,
  allBlogs: Blog[],
  aliases: string[] = [],
): Blog | undefined => {
  if (allBlogs.length === 0) return undefined;

  const rawKeys = [nameOrId, ...aliases].map((k) => k.trim()).filter(Boolean);
  const normalizedKeys = [
    ...new Set(rawKeys.map(normalizeKey).filter(Boolean)),
  ];

  // 1. Check explicit slug hints first
  const slugHints = new Set<string>();
  for (const norm of normalizedKeys) {
    for (const hint of APP_BLOG_SLUG_HINTS[norm] ?? []) {
      slugHints.add(hint.toLowerCase());
    }
  }
  if (slugHints.size > 0) {
    const exactHintMatch = allBlogs.find((post) =>
      slugHints.has(post.id.toLowerCase()),
    );
    if (exactHintMatch) return exactHintMatch;
  }

  // 2. Match against post id, title, seo_word, and description
  const matchKeys = normalizedKeys.filter((k) => k.length >= 4);
  if (matchKeys.length === 0) return undefined;

  const boundaryPatterns = rawKeys
    .filter((k) => k.trim().length >= 4)
    .map(
      (k) =>
        new RegExp(
          `(?:^|[^a-z0-9])${escapeRegExp(k.trim())}(?:$|[^a-z0-9])`,
          "i",
        ),
    );

  const scored = allBlogs
    .map((post) => {
      let score = 0;
      const normId = normalizeKey(post.id);
      const normTitle = normalizeKey(post.title);
      const normMeta = normalizeKey(
        [post.seo_word ?? "", post.description ?? ""].join(" "),
      );

      for (const key of matchKeys) {
        if (normId === key) score += 10;
        else if (normId.includes(key)) score += 6;
        if (normTitle.includes(key)) score += 5;
        if (normMeta.includes(key)) score += 3;
      }

      const combinedRaw = [
        post.id,
        post.title,
        post.seo_word ?? "",
        post.description ?? "",
      ].join(" ");
      for (const pattern of boundaryPatterns) {
        if (pattern.test(combinedRaw)) score += 2;
      }

      return { post, score, time: postTimestamp(post) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.time - a.time);

  return scored[0]?.post;
};

/** Select related blog posts for a dev project page */
export const getRelatedPostsForProject = (
  project: Project,
  allBlogs: Blog[],
  limit = 3,
): Blog[] => {
  const direct = findRelatedBlogForApp(project.id, allBlogs, [project.name]);
  const picked: Blog[] = direct ? [direct] : [];
  const candidates = allBlogs.filter((post) => post.id !== direct?.id);

  const { tags, categoryLower } = buildTopicTagsFromItem({
    id: project.id,
    title: project.name,
    category: project.category,
    content: project.content,
  });
  const scored = rankCandidatesByTopic(candidates, tags, (post) =>
    Boolean(
      categoryLower &&
      post.category?.name &&
      normalizeTag(post.category.name).toLowerCase() === categoryLower,
    ),
  );

  return fillWithFallback([...picked, ...scored], allBlogs, limit);
};

/** Resolve an external URL and link label for a dev project when it differs from its own /dev/ page */
export const getProjectExternalLink = (
  project: Project,
  site: URL | undefined,
): { url: string; label: string } | undefined => {
  if (!project.url) return undefined;
  const ownURL = new URL(`/dev/${project.id}`, site).href;
  if (project.url.replace(/\/$/, "") === ownURL) return undefined;
  const label = project.url.includes("github.com")
    ? "GitHub ↗"
    : project.url.toLowerCase().includes("docs")
      ? "Docs ↗"
      : "URL ↗";
  return { url: project.url, label };
};

/** Select up to `limit` featured posts prioritizing core high-performing guides */
export const getFeaturedPosts = (allBlogs: Blog[], limit = 4): Blog[] =>
  fillWithFallback([], allBlogs, limit);

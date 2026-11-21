import type { Blog, Category } from "../types/blog";

/** Posts shown on one page of the blog list (and of each category list) */
export const PER_PAGE = 10;

export const categoryPath = (id: string) => `/blog/category/${id}/`;

/** URL of page n of a list under base (e.g. "/blog"). Page 1 is the list's own URL */
export const pagePath = (base: string, n: number) => (n === 1 ? `${base}/` : `${base}/page/${n}/`);

/** Split posts into pages; an empty list still yields one (empty) page */
export const toPages = <T>(items: T[]): T[][] => {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += PER_PAGE) pages.push(items.slice(i, i + PER_PAGE));
  return pages.length > 0 ? pages : [[]];
};

/** Categories that have at least one post, with their post counts, in order of first appearance */
export const collectCategories = (posts: Blog[]) => {
  const map = new Map<string, { category: Category; count: number }>();
  for (const post of posts) {
    if (!post.category) continue;
    const entry = map.get(post.category.id);
    if (entry) entry.count++;
    else map.set(post.category.id, { category: post.category, count: 1 });
  }
  return [...map.values()];
};

import { createClient, type MicroCMSListResponse } from "microcms-js-sdk";
import { MICROCMS_API_KEY, MICROCMS_SERVICE_DOMAIN, MOCKMODE } from "astro:env/server";
import type { Blog } from "../types/blog";
import type { Scrap } from "../types/scrap";
import { mockBlogs, mockScraps } from "./mock-data";

// Secrets come from astro:env, so on Cloudflare they are read at runtime instead of being inlined at build
const isMockMode = MOCKMODE === "true" || !MICROCMS_SERVICE_DOMAIN || !MICROCMS_API_KEY;

const client = isMockMode
  ? null
  : createClient({ serviceDomain: MICROCMS_SERVICE_DOMAIN!, apiKey: MICROCMS_API_KEY! });

type Endpoint = "blogs" | "scraps";
type Content = { blogs: Blog; scraps: Scrap };
const mocks: { [E in Endpoint]: Content[E][] } = { blogs: mockBlogs, scraps: mockScraps };

export type PageOptions = { limit?: number; offset?: number };

/** Fetch every item, even beyond microCMS's 100-item limit per request */
const getAll = async <E extends Endpoint>(endpoint: E): Promise<Content[E][]> => {
  if (!client) return mocks[endpoint];
  return await client.getAllContents<Content[E]>({ endpoint });
};

/** Fetch one page of items, in the same shape as a microCMS list response */
const getPage = async <E extends Endpoint>(
  endpoint: E,
  { limit = 10, offset = 0 }: PageOptions = {},
): Promise<MicroCMSListResponse<Content[E]>> => {
  if (!client) {
    const all = mocks[endpoint];
    return { contents: all.slice(offset, offset + limit), totalCount: all.length, limit, offset };
  }
  return await client.getList<Content[E]>({ endpoint, queries: { limit, offset } });
};

/** Fetch one item. Passing a draftKey returns the draft version; returns null when it does not exist */
const getDetail = async <E extends Endpoint>(
  endpoint: E,
  id: string,
  draftKey?: string,
): Promise<Content[E] | null> => {
  if (!client) {
    return (mocks[endpoint] as Content[E][]).find((item) => item.id === id) ?? null;
  }
  try {
    return await client.getListDetail<Content[E]>({
      endpoint,
      contentId: id,
      queries: draftKey ? { draftKey } : undefined,
    });
  } catch {
    return null;
  }
};

export const getAllBlogs = () => getAll("blogs");
export const getBlogs = (options?: PageOptions) => getPage("blogs", options);
export const getBlogDetail = (id: string, draftKey?: string) => getDetail("blogs", id, draftKey);

export const getAllScraps = () => getAll("scraps");
export const getScraps = (options?: PageOptions) => getPage("scraps", options);
export const getScrapDetail = (id: string, draftKey?: string) => getDetail("scraps", id, draftKey);

import { createClient } from "microcms-js-sdk";
import type { Blog } from "../types/blog";
import type { Scrap } from "../types/scrap";
import { mockBlogs, mockScraps } from "./mock-data";

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

/** MOCKMODE=true または環境変数が未設定の場合はモックデータで動作するサンプルモード */
const isMockMode = import.meta.env.MOCKMODE === "true" || !serviceDomain || !apiKey;

const client = isMockMode
  ? null
  : createClient({ serviceDomain, apiKey });

/** 全件取得（microCMS の limit 上限 100 件を超えても取得できる） */
export const getAllBlogs = async (): Promise<Blog[]> => {
  if (!client) {
    return mockBlogs;
  }
  return await client.getAllContents<Blog>({ endpoint: "blogs" });
};

export const getBlogDetail = async (id: string): Promise<Blog | null> => {
  if (!client) {
    return mockBlogs.find((blog) => blog.id === id) ?? null;
  }
  try {
    return await client.getListDetail<Blog>({ endpoint: "blogs", contentId: id });
  } catch {
    return null;
  }
};

/** 全件取得 */
export const getAllScraps = async (): Promise<Scrap[]> => {
  if (!client) {
    return mockScraps;
  }
  return await client.getAllContents<Scrap>({ endpoint: "scraps" });
};

export const getScrapDetail = async (id: string): Promise<Scrap | null> => {
  if (!client) {
    return mockScraps.find((scrap) => scrap.id === id) ?? null;
  }
  try {
    return await client.getListDetail<Scrap>({ endpoint: "scraps", contentId: id });
  } catch {
    return null;
  }
};

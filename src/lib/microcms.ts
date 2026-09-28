import { createClient } from "microcms-js-sdk";
import type { Blog, BlogListResponse } from "../types/blog";
import { mockBlogs } from "./mock-data";

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

/** 環境変数が未設定の場合はモックデータで動作するサンプルモード */
//export const isMockMode = !serviceDomain || !apiKey;
export const isMockMode = import.meta.env.MOCKMODE === true ? true : false;

const client = isMockMode
  ? null
  : createClient({ serviceDomain, apiKey });

export const getBlogs = async (queries?: { limit?: number; offset?: number }): Promise<BlogListResponse> => {
  if (!client) {
    const limit = queries?.limit ?? mockBlogs.length;
    const offset = queries?.offset ?? 0;
    return {
      contents: mockBlogs.slice(offset, offset + limit),
      totalCount: mockBlogs.length,
      offset,
      limit,
    };
  }
  return client.getList<Blog>({ endpoint: "blogs", queries });
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

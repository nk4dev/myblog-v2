import type { MicroCMSListResponse, MicroCMSDate } from "microcms-js-sdk";

export type Category = {
  id: string;
  name: string;
} & MicroCMSDate;

export type Blog = {
  title: string;
  description: string;
  content: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: Category;
} & MicroCMSDate & { id: string };

export type BlogListResponse = MicroCMSListResponse<Blog>;

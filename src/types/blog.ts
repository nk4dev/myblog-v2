import type { MicroCMSDate } from "microcms-js-sdk";

export type Category = {
  id: string;
  name: string;
} & MicroCMSDate;

/** Optional tag item when configured as a relation or string array in microCMS */
export type Tag = {
  id?: string;
  name: string;
};

export type Blog = {
  title: string;
  /** Optional on microCMS; may be unset on older posts */
  description?: string;
  content?: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: Category;
  /** Optional tags from microCMS if configured in the schema */
  tags?: (string | Tag)[];
  authorId?: string;

} & MicroCMSDate & { id: string };

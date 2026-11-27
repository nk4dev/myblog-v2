import type { MicroCMSDate } from "microcms-js-sdk";

/** A development project from the microCMS "projects" API (shown under /dev/) */
export type Project = {
  name: string;
  /** Rich editor HTML; some projects have none */
  content?: string;
  /** Screenshots or logos; the first one is used as the eyecatch */
  image?: { url: string; width: number; height: number; alt?: string }[];
  /** Repository or site of the project */
  url?: string;
  /** Free text, like the scraps' category */
  category?: string;
} & MicroCMSDate & { id: string };

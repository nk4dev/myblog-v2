import type { MicroCMSDate } from "microcms-js-sdk";

export type Scrap = {
  title: string;
  content: string;
  /** blogs と違い、scraps のカテゴリはテキストフィールド */
  category?: string;
} & MicroCMSDate & { id: string };

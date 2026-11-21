import type { Blog } from "../types/blog";
import type { Scrap } from "../types/scrap";
import type { Project } from "../types/project";

/**
 * MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY 未設定時に使うダミー記事。
 * 実運用では microCMS 側で同名スキーマ (title/description/content/eyecatch/category) を用意する。
 */
export const mockBlogs: Blog[] = [
  {
    id: "sample-post-1",
    title: "サンプル記事1: このサイトについて",
    description: "Astro + microCMS で構築した個人サイト兼ブログのサンプルです。",
    content:
      "<p>これは microCMS 未接続時に表示されるモック記事です。<code>.env</code> に <code>MICROCMS_SERVICE_DOMAIN</code> と <code>MICROCMS_API_KEY</code> を設定すると、実際の記事データに切り替わります。</p>",
    category: { id: "general", name: "お知らせ", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", publishedAt: "2026-01-01T00:00:00.000Z", revisedAt: "2026-01-01T00:00:00.000Z" },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    publishedAt: "2026-01-01T00:00:00.000Z",
    revisedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sample-post-2",
    title: "サンプル記事2: Astro Content の使い方",
    description: "Astro の静的生成と microCMS を組み合わせたブログ構築のポイントを紹介します。",
    content:
      "<p>getStaticPaths() を使うことで、microCMS 上の全記事 id からページを一括生成できます。ビルド時にAPIを叩くため、SSGとの相性が非常に良い構成です。</p>",
    category: { id: "tech", name: "技術", createdAt: "2026-01-02T00:00:00.000Z", updatedAt: "2026-01-02T00:00:00.000Z", publishedAt: "2026-01-02T00:00:00.000Z", revisedAt: "2026-01-02T00:00:00.000Z" },
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    publishedAt: "2026-01-02T00:00:00.000Z",
    revisedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "sample-post-3",
    title: "サンプル記事3: デプロイについて",
    description: "Cloudflare Pages へのデプロイ手順と環境変数の設定方法をまとめます。",
    content:
      "<p>Cloudflare Pages の管理画面で Environment variables に <code>MICROCMS_SERVICE_DOMAIN</code> と <code>MICROCMS_API_KEY</code> を設定し、ビルドコマンドを <code>npm run build</code> にするだけでデプロイできます。</p>",
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
    publishedAt: "2026-01-03T00:00:00.000Z",
    revisedAt: "2026-01-03T00:00:00.000Z",
  },
];

/** MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY 未設定時に使うダミーのスクラップ。 */
export const mockScraps: Scrap[] = [
  {
    id: "sample-scrap-1",
    title: "サンプルスクラップ: 開発メモ",
    content: "<p>これは microCMS 未接続時に表示されるモックのスクラップです。</p>",
    createdAt: "2026-01-04T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z",
    publishedAt: "2026-01-04T00:00:00.000Z",
    revisedAt: "2026-01-04T00:00:00.000Z",
  },
];

/** Dummy project used when MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY are not set */
export const mockProjects: Project[] = [
  {
    id: "sample-project",
    name: "Sample Project",
    content: "<p>This mock project is shown while microCMS is not connected.</p>",
    url: "https://github.com/nk4dev",
    category: "development",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
    publishedAt: "2026-01-05T00:00:00.000Z",
    revisedAt: "2026-01-05T00:00:00.000Z",
  },
];

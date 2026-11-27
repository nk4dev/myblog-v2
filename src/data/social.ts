/**
 * SNS の短縮リダイレクト一覧。`/<slug>` にアクセスすると `url` へリダイレクトする。
 * Layout のヘッダーや shortlinks から読み込んでいる。
 */
export type SocialLink = {
  slug: string;
  label: string;
  url: string;
  title?: string;
  description?: string;
  /** 個別の OGP 画像 URL。省略時はサイト全体のデフォルト画像が適用されます */
  image?: string;
};

export const socialLinks: readonly SocialLink[] = [
  {
    slug: "g",
    label: "GitHub",
    url: "/rd2/github?utm_source=slash_link&utm_medium=g",
    title: "GitHub (@nk4dev)",
    description: "Nknight AMAMIYA (nk4dev) の GitHub プロフィールとリポジトリ",
  },
  {
    slug: "x",
    label: "X",
    url: "https://x.com/nk4dev",
    title: "X (@nk4dev)",
    description: "Nknight AMAMIYA (nk4dev) の X (旧Twitter) アカウント",
  },
  {
    slug: "i",
    label: "Instagram",
    url: "https://www.instagram.com/nk4dev/",
    title: "Instagram (@nk4dev)",
    description: "Nknight AMAMIYA の Instagram アカウント",
  },
] as const;

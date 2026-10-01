/**
 * SNS の短縮リダイレクト一覧。`/<slug>` にアクセスすると `url` へリダイレクトする。
 * astro.config.mjs の redirects と、Layout のヘッダーから読み込んでいる。
 */
export const socialLinks = [
  {
    slug: "g",
    label: "GitHub",
    url: "https://github.com/nk4dev",
  },
  {
    slug: "x",
    label: "X",
    url: "https://x.com/nk4dev",
  },
  {
    slug: "i",
    label: "Instagram",
    url: "https://www.instagram.com/nk4dev/",
  },
] as const;

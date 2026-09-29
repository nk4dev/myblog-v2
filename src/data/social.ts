/**
 * SNS の短縮リダイレクト一覧。`/<slug>` にアクセスすると `url` へリダイレクトする。
 * astro.config.mjs の redirects から読み込んでいる。
 *
 * TODO: url はダミー。実際のアカウント URL に差し替える。
 */
export const socialLinks = [
  { slug: "g", label: "GitHub", url: "https://example.com/github" },
  { slug: "x", label: "X", url: "https://example.com/x" },
] as const;

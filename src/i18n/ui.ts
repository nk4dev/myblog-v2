/**
 * UI の固定文言の辞書。記事・スクラップの本文は翻訳しない。
 * 表示言語は <html data-lang="ja|en"> で切り替える（Layout.astro 参照）。
 */
export const languages = ["ja", "en"] as const;
export type Lang = (typeof languages)[number];

export const ui = {
  ja: {
    "home.bio1": "新卒一年目",
    "home.bio2": "開発・技術について書いています。",
    "home.latest": "最新の記事",
    "home.scraps": "スクラップ",
    "home.seeAll": "すべて見る",
    "home.posts": "記事",
    "blog.lead": "開発・技術について書いた記事。",
    "scraps.lead": "ちょっとしたメモや作業ログ。",
    "list.count": "件",
    "list.empty": "まだ何も書いていません。",
    "article.toc": "目次",
    "article.minutes": "分で読めます",
    "article.top": "ページの先頭へ",
    "tb.drawn": "作成",
    "tb.date": "日付",
    "tb.scale": "縮尺",
    "tb.sheet": "図番",
    "tb.title": "表題",
    "blog.sort": "並び順",
    "blog.sort.newest": "新しい順",
    "blog.sort.oldest": "古い順",
    "blog.sort.title": "タイトル順",
    "blog.back": "記事一覧に戻る",
    "scraps.back": "スクラップ一覧に戻る",
    "404.message": "お探しのページは見つかりませんでした。",
    "404.back": "トップに戻る",
    "nav.theme": "テーマを切り替え",
    "nav.lang": "Switch to English",
  },
  en: {
    "home.bio1": "First year as a new graduate",
    "home.bio2": "I write about development and technology.",
    "home.latest": "Latest posts",
    "home.scraps": "Scraps",
    "home.seeAll": "View all",
    "home.posts": "Posts",
    "blog.lead": "Writing about development and technology.",
    "scraps.lead": "Short notes and work logs.",
    "list.count": " entries",
    "list.empty": "Nothing written here yet.",
    "article.toc": "Contents",
    "article.minutes": " min read",
    "article.top": "Back to top",
    "tb.drawn": "Drawn by",
    "tb.date": "Date",
    "tb.scale": "Scale",
    "tb.sheet": "Sheet",
    "tb.title": "Title",
    "blog.sort": "Sort",
    "blog.sort.newest": "Newest",
    "blog.sort.oldest": "Oldest",
    "blog.sort.title": "Title",
    "blog.back": "Back to posts",
    "scraps.back": "Back to scraps",
    "404.message": "The page you were looking for could not be found.",
    "404.back": "Back to home",
    "nav.theme": "Toggle theme",
    "nav.lang": "日本語に切り替え",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)["ja"];

/**
 * <T> で囲めない箇所（<option> の文字列や aria-label）用。
 * Layout のスクリプトが data-i18n-* を見て、attr を指定した場合はその属性を、省略時は文字列を差し替える。
 */
export const i18nAttrs = (key: UIKey, attr?: string) => ({
  "data-i18n-ja": ui.ja[key],
  "data-i18n-en": ui.en[key],
  ...(attr ? { "data-i18n-attr": attr } : {}),
});

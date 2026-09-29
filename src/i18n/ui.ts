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
    "home.seeAll": "すべて見る",
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
    "home.seeAll": "View all",
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

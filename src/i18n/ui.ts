/**
 * Dictionary for the fixed UI text. Post and scrap bodies from microCMS are not translated.
 * The visible language is switched with <html data-lang="ja|en"> (see Layout.astro).
 */
export const languages = ["ja", "en"] as const;
export type Lang = (typeof languages)[number];

export const ui = {
  ja: {
    "nav.home": "nk4dev ホーム",
    "nav.menu": "メニュー",
    "nav.lang": "English に切り替え",
    "home.latestPosts": "最新の記事",
    "home.allPosts": "すべての記事",
    "home.latestScraps": "最新のスクラップ",
    "home.allScraps": "すべてのスクラップ",
    "list.count": "件",
    "list.empty": "まだ何もありません。",
    "article.updated": "更新",
    "article.toc": "目次",
    "blog.back": "記事一覧へ",
    "scraps.back": "スクラップ一覧へ",
    "dev.back": "プロジェクト一覧へ",
    "share.x": "X で共有",
    "footer.privacy": "プライバシーポリシー",
    "share.bluesky": "Bluesky で共有",
    "share.hatena": "はてなブックマークに追加",
    "share.line": "LINE で送る",
    "share.copy": "リンクをコピー",
    "share.copied": "リンクをコピーしました",
    "share.native": "ほかのアプリで共有",
    "blog.categories": "カテゴリ",
    "blog.allCategories": "すべて",
    "pagination.label": "ページ送り",
    "pagination.prev": "前へ",
    "pagination.next": "次へ",
    "pagination.page": "ページ",
    "about.techStack": "使っている技術",
    "about.languages": "使っている言語",
    "about.history": "これまで",
    "about.works": "つくったもの",
    "about.contact": "Contact",
    "404.message": "お探しのページは見つかりませんでした。",
    "404.back": "トップに戻る",
  },
  en: {
    "nav.home": "nk4dev home",
    "nav.menu": "Menu",
    "nav.lang": "日本語に切り替え",
    "home.latestPosts": "Latest posts",
    "home.allPosts": "All posts",
    "home.latestScraps": "Latest scraps",
    "home.allScraps": "All scraps",
    "list.count": "entries",
    "list.empty": "Nothing here yet.",
    "article.updated": "updated",
    "article.toc": "Contents",
    "blog.back": "Back to posts",
    "scraps.back": "Back to scraps",
    "dev.back": "Back to projects",
    "share.x": "Share on X",
    "footer.privacy": "Privacy Policy",
    "share.bluesky": "Share on Bluesky",
    "share.hatena": "Add to Hatena Bookmark",
    "share.line": "Send on LINE",
    "share.copy": "Copy link",
    "share.copied": "Link copied",
    "share.native": "Share with another app",
    "blog.categories": "Categories",
    "blog.allCategories": "All",
    "pagination.label": "Pagination",
    "pagination.prev": "Prev",
    "pagination.next": "Next",
    "pagination.page": "Page",
    "about.techStack": "Tech stack",
    "about.languages": "Languages",
    "about.history": "Journey",
    "about.works": "Things I made",
    "about.contact": "Contact",
    "404.message": "The page you were looking for could not be found.",
    "404.back": "Back to home",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)["ja"];

/** Text that exists in both languages; used for hand-authored copy outside the dictionary */
export type Localized = Record<Lang, string>;

/**
 * For places <T> cannot wrap, such as aria-label. The Layout script reads data-i18n-*
 * and replaces the named attribute (or the text when attr is omitted).
 */
export const i18nAttrs = (key: UIKey, attr?: string) => ({
  "data-i18n-ja": ui.ja[key],
  "data-i18n-en": ui.en[key],
  ...(attr ? { "data-i18n-attr": attr } : {}),
});

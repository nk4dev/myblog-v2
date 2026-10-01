// Hand-authored profile copy for the About page, carried over from the old site
// (nk4dev.github.io src/data/profile.ts). Not microCMS content.
// Text shown to readers is kept in both languages for the ja/en switch.
import type { Localized } from "../i18n/ui";

export const bio: Localized = {
  ja: "個人ブログ兼プレイグラウンドの管理人です。ゲームがきっかけでプログラミングを始めて、今はWebを中心にいろいろ作っています。最近はVRChatにも足を踏み入れました。",
  en: "I run this personal blog and playground. Games got me into programming, and these days I mostly build things for the web. Lately I've also been getting into VRChat.",
};

// The stack this site is built on (see package.json)
export const techStack = ["Astro", "Tailwind CSS", "Hono", "Cloudflare Workers", "microCMS", "Bun"];

export const langs = ["TypeScript"];

export const repos = [
  {
    name: "VX3",
    url: "https://github.com/nk4dev/vx3",
    desc: {
      ja: "Web3を触る開発者向けのツールキット。ウォレット接続やコントラクト操作をまとめて手軽に。",
      en: "A toolkit for developers working with Web3 — wallet connections and contract calls, made easy.",
    },
  },
  {
    name: "OSS-WEATHER",
    url: "https://nknighta.me/oss-map-weather/",
    desc: { ja: "地図の上に天気を重ねて見られる小さなOSSツール。", en: "A small OSS tool that overlays weather info on a map." },
  },
  {
    name: "Grove Player",
    url: "https://github.com/nk4dev/grove-player",
    desc: { ja: "個人開発の動画/音楽プレイヤーアプリ。", en: "A personal video/music player app." },
  },
  {
    name: "IndexLanguage",
    url: "https://github.com/nk4dev/IndexLanguage",
    desc: { ja: "趣味で作っている自作プログラミング言語。", en: "A programming language I'm building for fun." },
  },
];

// Links go through the short URLs (src/data/shortlinks.ts) where one exists
export const contacts = [
  { label: "X", handle: "@nk4dev", url: "/x/" },
  { label: "GitHub", handle: "@nk4dev", url: "/g/" },
  { label: "Instagram", handle: "@ama_p0627", url: "/i/" },
  { label: "Qiita", handle: "@amamiya_dev", url: "/q/" },
  { label: "VRChat", handle: "Nknight AMAMIYA", url: "/vrchat/" },
  { label: "Email", handle: "nknighta@varius.technology", url: "mailto:nknighta@varius.technology" },
];

export const history = [
  {
    age: { ja: "18歳", en: "18" },
    text: { ja: "VMwareの仮想マシンをきっかけにプログラミングの世界へ", en: "Entering the world of programming through VMware virtual machines" },
  },
  { age: { ja: "20歳", en: "20" }, text: { ja: "Web開発とGitHubでの開発を始める", en: "Started web development and coding on GitHub" } },
  { age: { ja: "21歳", en: "21" }, text: { ja: "このサイトを公開", en: "Published this site" } },
  { age: { ja: "23歳", en: "23" }, text: { ja: "VRChatをやりはじめる", en: "Started VRChat life" } },
];

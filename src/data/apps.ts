import type { Localized } from "../i18n/ui";

/** Small web apps listed on /apps/ */
export type App = {
  name: string;
  /** Page on this site */
  href: string;
  desc: Localized;
  image?: { src: string; width: number; height: number };
  /** Extra links such as the source repository */
  links?: { label: Localized; url: string }[];
};

export const apps: App[] = [
  {
    name: "YTImage-dl",
    href: "/apps/ytimage-dl/",
    desc: {
      ja: "YouTube の動画 URL からサムネイル画像を取り出してダウンロードします。",
      en: "Get and download the thumbnail images of a YouTube video from its URL.",
    },
    image: {
      src: "https://images.microcms-assets.io/assets/a2939c8d25434ae5a1f853f2dc239a0f/11e26841b33348fa8d701607845f9866/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-06-01%20165235.png?fit=fill&fill-color=000021&w=800&h=480",
      width: 800,
      height: 480,
    },
    links: [
      {
        label: { ja: "リポジトリ（HTML 版）", en: "Repository (HTML version)" },
        url: "https://github.com/nknighta/ytimage-dl",
      },
    ],
  },
  {
    name: "Grove Player",
    href: "/apps/grove/",
    desc: {
      ja: "手元の動画ファイルを再生するプレイヤー。コマ送り、速度変更、スクリーンショットに対応しています。",
      en: "A player for local video files, with frame stepping, speed control and screenshots.",
    },
  },
];

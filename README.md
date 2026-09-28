# astro-sample

Astro + microCMS + Tailwind CSS による個人サイト兼ブログのサンプルです。
[../blog_stacks_260916.md](../blog_stacks_260916.md) の構成案をベースに実装しています。

## セットアップ

```bash
npm install
npm run dev
```

`.env` を作らなくても、モックデータで動作します（トップページにその旨のバナーが表示されます）。
実際の microCMS API に接続する場合は `.env.example` を `.env` にコピーし、値を設定してください。

```bash
cp .env.example .env
```

```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

microCMS 側では `blogs` という名前のリスト形式APIを作成し、以下のフィールドを用意してください。

| フィールドID  | 種類           | 必須 |
| ------------- | -------------- | ---- |
| title         | テキストフィールド | ✔ |
| description   | テキストフィールド | ✔ |
| content       | リッチエディタ | ✔ |
| eyecatch      | 画像           |      |
| category      | コンテンツ参照（categories） |      |

## ディレクトリ構成

```
src/
├── components/     # Header, Footer, PostCard, BaseHead
├── layouts/        # Layout.astro
├── lib/            # microcms.ts (APIクライアント/モックフォールバック), mock-data.ts
├── pages/          # index.astro, blog/index.astro, blog/[id].astro, 404.astro
├── styles/         # global.css (Tailwind)
└── types/          # blog.ts
```

## ビルド

```bash
npm run build
npm run preview
```

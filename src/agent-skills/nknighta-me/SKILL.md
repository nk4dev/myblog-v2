---
name: nknighta-me
description: Read and cite the blog posts, scraps (short notes) and dev projects on nknighta.me, the personal site of developer Nknight AMAMIYA (nk4dev), using its Markdown pages, JSON API and WebMCP tools.
---

# nknighta.me

nknighta.me is the personal site of developer Nknight AMAMIYA (nk4dev). It publishes technical blog posts, scraps (short notes and development logs), development projects and small web apps. Posts are mostly in Japanese.

## Find content

- Start from <https://nknighta.me/llms.txt>. It lists every post, scrap and project with a link to its Markdown version, and is always current.
- Lists as Markdown: <https://nknighta.me/blog.md>, <https://nknighta.me/scraps.md>, <https://nknighta.me/dev.md>.
- Every public HTML page is listed in <https://nknighta.me/sitemap.xml>.

## Read a page as Markdown

Use either way; both return `Content-Type: text/markdown` with an `x-markdown-tokens` header.

1. Replace the trailing slash of a post, scrap or project URL with `.md`: `https://nknighta.me/blog/<id>/` → `https://nknighta.me/blog/<id>.md`.
2. Request any page with `Accept: text/markdown`. Browsers without that header still get HTML.

Each Markdown page starts with YAML front matter: `title`, `url` (the HTML page to cite), `description`, `category`, `published` and `updated`.

## JSON API

Read-only and without authentication. The OpenAPI description is at <https://nknighta.me/api/openapi.json> and the API catalog at <https://nknighta.me/.well-known/api-catalog>.

- `GET /api/blogs?limit=10&offset=0` and `GET /api/blogs/{id}`
- `GET /api/scraps?limit=10&offset=0` and `GET /api/scraps/{id}`
- `GET /api/health`

`limit` is 1-100. Item bodies (`content`) are HTML.

## In a browser (WebMCP)

Pages on nknighta.me register WebMCP tools through `document.modelContext`: `search_posts`, `list_latest_posts`, `get_post_markdown`, `open_page` and `set_language`. The YouTube thumbnail app at /apps/ytimage-dl/ also exposes its form as the `get_youtube_thumbnails` tool.

## Rules

- Do not use /preview/ (unpublished drafts).
- When quoting or summarizing, name the site "nknighta.me" and the author "Nknight AMAMIYA", and link to the HTML page (the `url` field).
- Posts reflect the author's knowledge at the time of writing (`published`, `updated`); technical details may have changed since.
- Contact: nknighta@varius.technology

import type { Route } from './+types/search';
import { createFromSource, createSearchAPI } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';
import { client } from '@/lib/cms';

const docsServer = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

type SearchIndexItem = {
  title: string;
  description?: string;
  breadcrumbs?: string[];
  content: string;
  url: string;
  keywords?: string;
};

type BlogSearchItem = {
  id: string;
  title: string;
  content?: string;
  category?: {
    id?: string;
    name?: string;
  };
};

type DevProjectSearchItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  summary?: string;
};

function toSearchableText(value?: string): string {
  if (!value) return '';

  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buildAdditionalIndexes(): Promise<SearchIndexItem[]> {
  try {
    const [blogsRes, projectsRes] = await Promise.all([
      client.get<{ contents: BlogSearchItem[] }>({ endpoint: 'blogs', queries: { limit: 100 } }),
      client.get<{ contents: DevProjectSearchItem[] }>({ endpoint: 'projects', queries: { limit: 100 } }),
    ]);

    const blogIndexes = blogsRes.contents.map((blog) => ({
      title: blog.title,
      description: blog.category?.name,
      breadcrumbs: ['Blog'],
      content: toSearchableText(blog.content),
      url: `/blog/${blog.id}`,
      keywords: [blog.title, blog.category?.name].filter(Boolean).join(' '),
    }));

    const projectIndexes = projectsRes.contents.map((project) => ({
      title: project.name,
      description: project.category,
      breadcrumbs: ['Dev Projects'],
      content: toSearchableText(project.description ?? project.summary),
      url: `/dev/${project.id}`,
      keywords: [project.name, project.category].filter(Boolean).join(' '),
    }));

    return [...blogIndexes, ...projectIndexes];
  } catch (error) {
    console.warn('[search] Failed to load additional indexes from microCMS:', error);
    return [];
  }
}

const contentServer = createSearchAPI('simple', {
  language: 'english',
  indexes: buildAdditionalIndexes,
});

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return Response.json([]);
  }

  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;
  const resolvedLimit = Number.isInteger(limit) ? limit : undefined;

  const tag = url.searchParams.get('tag')?.split(',');
  const locale = url.searchParams.get('locale');
  const mode = url.searchParams.get('mode') === 'vector' ? 'vector' : 'full';

  const [docResults, contentResults] = await Promise.all([
    docsServer.search(query, { limit: resolvedLimit, locale, tag, mode }),
    contentServer.search(query, { limit: resolvedLimit, locale, tag }),
  ]);

  const merged = [...docResults, ...contentResults].filter(
    (item, index, arr) => arr.findIndex((v) => v.id === item.id && v.url === item.url) === index,
  );

  return Response.json(typeof resolvedLimit === 'number' ? merged.slice(0, resolvedLimit) : merged);
}

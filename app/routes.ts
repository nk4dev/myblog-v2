import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('blog/v2/*', 'routes/docs.tsx'),
  route('blog/*', 'routes/blog.tsx'),
  route('about', 'routes/about.tsx'),
  route('api/search', 'routes/search.ts'),
  route('og/blog/*', 'routes/og.docs.tsx'),
  route('dev/*', 'routes/dev.tsx'),

  // LLM integration:
  route('llms.txt', 'llms/index.ts'),
  route('llms-full.txt', 'llms/full.ts'),
  route('llms.mdx/blog/*', 'llms/mdx.ts'),

  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;

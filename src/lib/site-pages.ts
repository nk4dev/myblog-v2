import { getAllBlogs, getAllProjects, getAllScraps } from "./microcms";
import { categoryPath, collectCategories, pagePath, toPages } from "./blog-pages";
import { apps } from "../data/apps";

/** A public page for the sitemap and llms.txt. path is site-relative and ends with "/" */
export type SitePage = { path: string; title: string; lastmod?: string; description?: string };

/**
 * Every indexable page of the site. Drafts (/preview/), the API and the 404 page are left out.
 * Keep this in step with src/pages when adding a page.
 */
export const getSitePages = async () => {
  const [blogs, scraps, projects] = await Promise.all([getAllBlogs(), getAllScraps(), getAllProjects()]);
  const categories = collectCategories(blogs);

  const fixed: SitePage[] = [
    { path: "/", title: "Home" },
    { path: "/about/", title: "About" },
    { path: "/apps/", title: "Apps" },
    ...apps.map((app) => ({ path: app.href, title: app.name })),
    { path: "/dev/", title: "Dev Projects" },
    { path: "/links/", title: "Links" },
    { path: "/llmassets/", title: "LLM Assets" },
    { path: "/privacy/", title: "Privacy Policy" },
    { path: "/social/", title: "Social" },
  ];

  // Blog list pages, overall and per category
  const lists: SitePage[] = [
    ...toPages(blogs).map((_, i) => ({ path: pagePath("/blog", i + 1), title: i === 0 ? "Blog" : `Blog - Page ${i + 1}` })),
    ...categories.flatMap(({ category }) => {
      const inCategory = blogs.filter((post) => post.category?.id === category.id);
      const base = categoryPath(category.id).slice(0, -1);
      return toPages(inCategory).map((_, i) => ({
        path: pagePath(base, i + 1),
        title: i === 0 ? `${category.name} - Blog` : `${category.name} - Blog - Page ${i + 1}`,
      }));
    }),
    { path: "/scraps/", title: "Scraps" },
  ];

  const posts: SitePage[] = blogs.map((post) => ({
    path: `/blog/${post.id}/`,
    title: post.title,
    lastmod: post.revisedAt ?? post.updatedAt,
    description: post.description,
  }));
  const scrapPages: SitePage[] = scraps.map((scrap) => ({
    path: `/scraps/${scrap.id}/`,
    title: scrap.title,
    lastmod: scrap.revisedAt ?? scrap.updatedAt,
  }));

  const projectPages: SitePage[] = projects.map((project) => ({
    path: `/dev/${project.id}/`,
    title: project.name,
    lastmod: project.revisedAt ?? project.updatedAt,
  }));

  return { fixed, lists, posts, scraps: scrapPages, projects: projectPages };
};

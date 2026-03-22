import { hmeta } from "@/lib/metadata";
import type { Route } from "./+types/blog";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { client } from "@/lib/cms";
import { Text } from "../../stories/Text";
import { Link } from "react-router";

export function meta({ data }: Route.MetaArgs) {
    if (data?.mode === "detail") {
        return hmeta({ title: data.blog.title, description: data.blog.description ?? "Nknight AMAMIYA - Blog" });
    }

    return hmeta({ title: "Blog", description: "Nknight AMAMIYA - Blog" });
}

type BlogItem = {
    id: string;
    title: string;
    description?: string;
    content?: string;
    publishedAt?: string;
    updatedAt?: string;
    category?: {
        id: string;
        name: string;
    };
    tags?: string[];
    eyecatch?: {
        url: string;
        width: number;
        height: number;
    };
};

type BlogListData = {
    mode: "list";
    blogs: BlogItem[];
};

type BlogDetailData = {
    mode: "detail";
    blog: BlogItem;
};

type LoaderData = BlogListData | BlogDetailData;

function formatDate(value?: string): string | null {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export default function Blog({ loaderData }: Route.ComponentProps) {
    const devmode: boolean = process.env.NODE_ENV === "development" ? true : false;

    if (loaderData.mode === "detail") {
        const { blog } = loaderData;
        const publishedAt = formatDate(blog.publishedAt);
        const updatedAt = formatDate(blog.updatedAt);

        return (
            <HomeLayout {...baseOptions()}>
                <section className="space-y-6 py-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Link to="/blog" className="text-sm text-fd-muted-foreground hover:underline">
                            {"<- Back to Blog List"}
                        </Link>

                        <article className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
                            {blog.eyecatch?.url ? (
                                <div className="h-64 w-full bg-gray-200">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={blog.eyecatch.url}
                                        alt={blog.title}
                                        width={blog.eyecatch.width}
                                        height={blog.eyecatch.height}
                                    />
                                </div>
                            ) : null}

                            <div className="space-y-4 p-6">
                                <h1 className="text-3xl font-bold">{blog.title}</h1>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-fd-muted-foreground">
                                    {publishedAt ? <span>Published: {publishedAt}</span> : null}
                                    {updatedAt ? <span>Updated: {updatedAt}</span> : null}
                                    {blog.category?.name ? <span>Category: {blog.category.name}</span> : null}
                                </div>

                                {blog.tags?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-fd-border px-2 py-1 text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                {blog.description ? (
                                    <p className="text-fd-muted-foreground">{blog.description}</p>
                                ) : null}

                                {blog.content ? (
                                    <div
                                        className="prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                ) : (
                                    <p className="text-fd-muted-foreground">No content available yet.</p>
                                )}

                                {devmode ? (
                                    <div className="rounded-md border border-fd-border p-3 text-xs text-fd-muted-foreground">
                                        ID: {blog.id}
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    </div>
                </section>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout {...baseOptions()}>
            <section className="space-y-6 py-6">
                <div className="max-w-2/3 mx-auto">
                    <Text color="#fff" heading="h2">
                        Blogs
                    </Text>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
                        {loaderData.blogs.map((blog) => (
                            <article
                                key={blog.id}
                                id={blog.id}
                                className="overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-transform duration-200"
                            >
                                {blog.eyecatch?.url ? (
                                    <div className="h-48 w-full bg-gray-200">
                                        <img
                                            className="h-full w-full object-cover"
                                            src={blog.eyecatch.url}
                                            alt={blog.title}
                                            width={blog.eyecatch.width}
                                            height={blog.eyecatch.height}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}

                                <div className="space-y-2 p-4">
                                    <h2 className="line-clamp-2 text-lg font-semibold">
                                        <Link to={`/blog/${blog.id}`} className="hover:underline">
                                            {blog.title}
                                        </Link>
                                    </h2>
                                    {devmode && (
                                        <div>
                                            <p className="text-xs text-fd-muted-foreground">ID: {blog.id}</p>
                                        </div>
                                    )}
                                    {formatDate(blog.publishedAt) ? (
                                        <p className="text-sm text-fd-muted-foreground">{formatDate(blog.publishedAt)}</p>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}

export async function loader({ params }: Route.LoaderArgs) {
    const slug = params["*"]?.trim();

    try {
        if (slug) {
            const blog = await client.getListDetail<BlogItem>({ endpoint: "blogs", contentId: slug });
            return { mode: "detail", blog } satisfies LoaderData;
        }

        const data = await client.get<{ contents: BlogItem[] }>({ endpoint: "blogs" });
        return { mode: "list", blogs: data.contents } satisfies LoaderData;
    } catch (error) {
        console.error("Error fetching blogs:", error);

        if (slug) {
            throw new Response("Blog post not found.", { status: 404 });
        }

        throw new Response("Error loading blog posts.", { status: 500 });
    }
}
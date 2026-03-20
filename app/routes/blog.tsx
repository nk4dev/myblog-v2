import { hmeta } from "@/lib/metadata";
import type { Route } from "./+types/blog";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { client } from "@/lib/cms";
import { Text } from "../../stories/Text";

export function meta({ }: Route.MetaArgs) {
    return hmeta({ title: "Blog", description: "Nknight AMAMIYA - Blog" });
}

type BlogItem = {
    id: string;
    title: string;
    publishedAt?: string;
    eyecatch?: {
        url: string;
        width: number;
        height: number;
    };
};

type LoaderData = {
    blogs: BlogItem[];
};

export default function Blog({ loaderData }: Route.ComponentProps) {
    const devmode: boolean = process.env.NODE_ENV === "development" ? true : false;
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
                                    <h2 className="line-clamp-2 text-lg font-semibold">{blog.title}</h2>
                                    {devmode && (
                                        <div>
                                            <p className="text-xs text-fd-muted-foreground">ID: {blog.id}</p>
                                        </div>
                                    )}
                                    {blog.publishedAt ? (
                                        <p className="text-sm text-fd-muted-foreground">{blog.publishedAt}</p>
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

export async function loader() {
    try {
        const data = await client.get<{ contents: BlogItem[] }>({ endpoint: "blogs" });
        return { blogs: data.contents } satisfies LoaderData;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Response("Error loading blog posts.", { status: 500 });
    }
}
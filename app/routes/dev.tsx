import { hmeta } from "@/lib/metadata";
import type { Route } from "./+types/dev";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { client } from "@/lib/cms";
import { Text } from "../../stories/Text";
import { Link } from "react-router";

export function meta({ data }: Route.MetaArgs) {
    if (data?.mode === "detail") {
        return hmeta({ title: data.project.name, description: data.project.description ?? "Nknight AMAMIYA - Blog" });
    }

    return hmeta({ title: "Dev Projects", description: "Nknight AMAMIYA - Blog" });
}

type DevProjectItem = {
    id: string;
    name: string;
    category?: string;
    description?: string;
    summary?: string;
    content?: string;
    repoUrl?: string;
    demoUrl?: string;
    stack?: string[];
};

type DevListData = {
    mode: "list";
    projects: DevProjectItem[];
};

type DevDetailData = {
    mode: "detail";
    project: DevProjectItem;
};

type LoaderData = DevListData | DevDetailData;

export default function Dev({ loaderData }: Route.ComponentProps) {
    const devmode: boolean = process.env.NODE_ENV === "development" ? true : false;

    if (loaderData.mode === "detail") {
        const { project } = loaderData;

        return (
            <HomeLayout {...baseOptions()}>
                <section className="space-y-6 py-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Link to="/dev" className="text-sm text-fd-muted-foreground hover:underline">
                            {"<- Back to Dev Projects"}
                        </Link>

                        <article className="rounded-xl border border-fd-border bg-fd-card p-6 space-y-5">
                            <h1 className="text-3xl font-bold">{project.name}</h1>

                            {project.category ? (
                                <p className="text-sm text-fd-muted-foreground">Category: {project.category}</p>
                            ) : null}

                            {project.stack?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.stack.map((item) => (
                                        <span key={item} className="rounded-full border border-fd-border px-2 py-1 text-xs">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            {project.description ? (
                                <p className="text-fd-muted-foreground">{project.description}</p>
                            ) : project.summary ? (
                                <p className="text-fd-muted-foreground">{project.summary}</p>
                            ) : null}

                            {project.content ? (
                                <div
                                    className="prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: project.content }}
                                />
                            ) : null}

                            <div className="flex flex-wrap gap-3">
                                {project.repoUrl ? (
                                    <a
                                        href={project.repoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-md border border-fd-border px-3 py-2 text-sm hover:bg-fd-accent"
                                    >
                                        Repository
                                    </a>
                                ) : null}
                                {project.demoUrl ? (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-md border border-fd-border px-3 py-2 text-sm hover:bg-fd-accent"
                                    >
                                        Live Demo
                                    </a>
                                ) : null}
                            </div>

                            {devmode ? (
                                <div className="rounded-md border border-fd-border p-3 text-xs text-fd-muted-foreground">
                                    ID: {project.id}
                                </div>
                            ) : null}
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
                        Dev Projects
                    </Text>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
                        {loaderData.projects.map((project) => (
                            <div id={project.id} key={project.id} className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white">
                                    <Link to={`/dev/${project.id}`} className="hover:underline">
                                        {project.name}
                                    </Link>
                                </h3>
                                {project.category ? (
                                    <Text color="#ccc">
                                        {project.category}
                                    </Text>
                                ) : <Text color="#ccc">No category</Text>}
                            </div>
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
            const project = await client.getListDetail<DevProjectItem>({ endpoint: "projects", contentId: slug });
            return { mode: "detail", project } satisfies LoaderData;
        }

        const data = await client.get<{ contents: DevProjectItem[] }>({ endpoint: "projects" });
        return { mode: "list", projects: data.contents } satisfies LoaderData;
    } catch (error) {
        console.error("Error fetching dev projects:", error);

        if (slug) {
            throw new Response("Project not found.", { status: 404 });
        }

        throw new Response("Error loading dev projects.", { status: 500 });
    }
}
import type { BlogMetaData } from "types/blog";
import "./BlogGridBox.css";

export function BlogGridBox({ blog }: { blog: BlogMetaData }) {
    return (
        <article className="Box overflow-hidden ">
            <div className="space-y-2 p-4">
                <h2 className="line-clamp-2 text-lg font-semibold">{blog.title}</h2>
                {blog.publishedAt ? (
                    <p className="text-sm text-fd-muted-foreground">published: {blog.publishedAt}</p>
                ) : null}
                {blog.updatedAt ? (
                    <p className="text-sm text-fd-muted-foreground">updated: {blog.updatedAt}</p>
                ) : <p className="text-sm text-fd-muted-foreground">updated: --/--/--</p>}
            </div>
        </article>
    );
}
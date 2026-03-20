

export function BlogGridBox({ blog }: BlogGridBoxProps) {
    return (
        <article className="overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-transform duration-200">
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
                {blog.publishedAt ? (
                    <p className="text-sm text-fd-muted-foreground">{blog.publishedAt}</p>
                ) : null}
            </div>
        </article>
    );
}
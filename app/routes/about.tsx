import type { Route } from './+types/about';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'About | My Blog' },
        {
            name: 'description',
            content:
                'Learn what this blog is about, what it covers, and how content is organized.',
        },
    ];
}

export default function About() {
    return (
        <HomeLayout {...baseOptions()}>
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:py-14">
                <header className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
                        About
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Notes on building, shipping, and learning in public.
                    </h1>
                    <p className="max-w-3xl text-fd-muted-foreground">
                        This blog is a running log of practical experiments with web tooling,
                        documentation systems, and product engineering workflows. Every post
                        aims to be immediately useful and easy to revisit.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                    <article className="rounded-xl border bg-fd-card p-5">
                        <h2 className="mb-2 text-lg font-semibold">What you will find here</h2>
                        <p className="text-sm text-fd-muted-foreground">
                            Short guides, architecture notes, and setup checklists focused on
                            React Router, documentation-first projects, and maintainable UI
                            systems.
                        </p>
                    </article>
                    <article className="rounded-xl border bg-fd-card p-5">
                        <h2 className="mb-2 text-lg font-semibold">How content is written</h2>
                        <p className="text-sm text-fd-muted-foreground">
                            Posts prioritize clarity over hype: examples first, tradeoffs made
                            explicit, and each article structured so you can skim or dive deep.
                        </p>
                    </article>
                </div>

                <section className="rounded-xl border bg-fd-secondary/30 p-6">
                    <h2 className="mb-2 text-lg font-semibold">Topics in scope</h2>
                    <ul className="grid list-disc gap-1 pl-5 text-sm text-fd-muted-foreground sm:grid-cols-2">
                        <li>React Router and route architecture</li>
                        <li>Fumadocs and content workflows</li>
                        <li>TypeScript patterns for app code</li>
                        <li>Developer experience and tooling</li>
                    </ul>
                </section>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to="/blog"
                        className="rounded-full bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
                    >
                        Read the docs
                    </Link>
                    <Link
                        to="/"
                        className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-fd-accent"
                    >
                        Back to home
                    </Link>
                </div>
            </section>
        </HomeLayout>
    );
}
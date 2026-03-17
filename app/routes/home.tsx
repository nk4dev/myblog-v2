import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { NaviLink } from 'stories/Link';
import { ThreeBackground } from 'stories/ThreeBackground';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

// primary is a reserved prop for the Button component, so we need to rename it here

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <ThreeBackground
          particleCount={200}
          color="#6366f1"
          backgroundColor="#0f0f0f"
          particleSize={3}
          speed={2}
          width="100vw"
          height="calc(100vh - 4rem)"
        >
          <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
            <div className="max-w-2xl rounded-3xl bg-black/30 px-8 py-10 backdrop-blur-sm">
              <h1 className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                Fumadocs on React Router.
              </h1>
              <p className="mb-6 text-base text-slate-200 sm:text-lg">
                The truly flexible docs framework on React.js.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <NaviLink label="Blog" href="/blog" />
                <NaviLink label="About" href="/about" />
              </div>
            </div>
          </div>
        </ThreeBackground>
      </div>
    </HomeLayout>
  );
}

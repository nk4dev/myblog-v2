import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { NaviLink } from '../../stories/Link';
import { Text } from 'stories/Text';
import { ThreeBackground } from '../../stories/ThreeBackground';

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
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:py-14">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
                  About
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome to my Website!
                </h1>
                <p className="max-w-3xl text-fd-muted-foreground">
                  This blog is a running log of practical experiments with web tooling,
                  documentation systems, and product engineering workflows. Every post
                  aims to be immediately useful and easy to revisit.
                </p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3">
                <NaviLink
                  href='/blog'
                  primary
                  label='Blog'
                />
              </div>

              <div>
                <Text heading="h2" size="large" weight="bold" align="center">
                  Socials
                </Text>
                <div className='w-1/2 h-10 flex justify-around items-center m-auto'>
                  <div className='flex justify-around items-center m-auto h-full w-full'>
                    <a href='https://nknighta.me/x' target='_blank' rel='noopener noreferrer'>
                      <div>
                        x
                      </div>
                    </a>
                    <a href='https://nknighta.me/i' target='_blank' rel='noopener noreferrer'>
                      <div>
                        Instagram
                      </div>
                    </a>
                    <a href='https://nknighta.me/g' target='_blank' rel='noopener noreferrer'>
                      <div>
                        GitHub
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ThreeBackground>
      </div>
    </HomeLayout>
  );
}

import type { Route } from "./+types/home";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { NaviLink } from "../../stories/Link";
import { Text } from "stories/Text";
import { ThreeBackground } from "../../stories/ThreeBackground";
import { GitHubIcon, XIcon, InstagramIcon } from "../components/githubicon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Nknight AMAMIYA" },
    { name: "description", content: "Nknight AMAMIYA - Developer Portfolio" },
  ];
}

// primary is a reserved prop for the Button component, so we need to rename it here

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  //
  const isDark = resolvedTheme === "dark";
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <ThreeBackground
          particleCount={200}
          color={isDark ? "#6366f1" : "#6366f1"}
          backgroundColor={isDark ? "#0f0f0f" : "#ffffff"}
          particleSize={3}
          speed={2}
          width="100vw"
          height="calc(100vh - 4rem)"
        >
          <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:py-14">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome to my Website!
                </h1>
                <p className="text-fd-muted-foreground">
                  This website is my developer portfolio ,blog and playground.
                </p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3">
                <NaviLink href="/blog" primary label="Blog" />
                <NaviLink href="/dev" primary label="My Projects" />
              </div>

              <div>
                <Text heading="h2" size="large" weight="bold" align="center">
                  Socials
                </Text>
                <div className="w-1/2 h-10 flex justify-around items-center m-auto py-8">
                  <div className="flex justify-around items-center m-auto h-full w-1/2">
                    <a
                      href="https://nknighta.me/x"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <XIcon
                        color={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
                      />
                    </a>
                    <a
                      href="https://nknighta.me/i"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon
                        color={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
                      />
                    </a>
                    <a
                      href="https://nknighta.me/g"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon
                        color={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
                      />
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

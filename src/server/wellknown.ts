import { Hono, type Context } from "hono";
import siteSkill from "../agent-skills/nknighta-me/SKILL.md?raw";

/**
 * Discovery documents for AI agents under /.well-known/, mounted at / by src/worker.ts:
 * - /.well-known/api-catalog (RFC 9727): where the JSON API, its OpenAPI description, docs and
 *   health check are
 * - /.well-known/agent-skills/index.json (Agent Skills Discovery RFC v0.2.0) and the skills it lists
 */
export const wellKnownRoutes = new Hono({ strict: false });

const PUBLIC_CACHE = "public, max-age=3600";

const site = (c: Context) => import.meta.env.SITE ?? new URL(c.req.url).origin;
const absolute = (c: Context, path: string) => new URL(path, site(c)).href;

/** Skills published by this site. The SKILL.md files live in src/agent-skills/<name>/ */
const skills = [
  {
    name: "nknighta-me",
    description:
      "Read and cite the blog posts, scraps and dev projects on nknighta.me through its Markdown pages, JSON API and WebMCP tools.",
    body: siteSkill,
  },
];

const skillPath = (name: string) => `/.well-known/agent-skills/${name}/SKILL.md`;

/** "sha256:<hex>" of the exact bytes served for a skill */
const digest = async (text: string) => {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const hex = [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sha256:${hex}`;
};

wellKnownRoutes.get("/.well-known/api-catalog", (c) => {
  const catalog = absolute(c, "/.well-known/api-catalog");
  const body = {
    linkset: [
      {
        anchor: absolute(c, "/api/"),
        "service-desc": [
          { href: absolute(c, "/api/openapi.json"), type: "application/vnd.oai.openapi+json;version=3.1" },
        ],
        "service-doc": [{ href: absolute(c, "/developers/"), type: "text/html" }],
        status: [{ href: absolute(c, "/api/health"), type: "application/health+json" }],
      },
    ],
  };
  return c.body(JSON.stringify(body, null, 2), 200, {
    "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    "Cache-Control": PUBLIC_CACHE,
    // RFC 9727 section 4: the catalog points at itself with the api-catalog relation
    Link: `<${catalog}>; rel="api-catalog"`,
    "Access-Control-Allow-Origin": "*",
  });
});

wellKnownRoutes.get("/.well-known/agent-skills/index.json", async (c) => {
  const body = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: await Promise.all(
      skills.map(async ({ name, description, body }) => ({
        name,
        type: "skill-md",
        description,
        url: absolute(c, skillPath(name)),
        digest: await digest(body),
      })),
    ),
  };
  return c.json(body, 200, { "Cache-Control": PUBLIC_CACHE, "Access-Control-Allow-Origin": "*" });
});

wellKnownRoutes.get("/.well-known/agent-skills/:name/SKILL.md", (c) => {
  const skill = skills.find(({ name }) => name === c.req.param("name"));
  if (!skill) return c.text("Not found", 404);
  return c.body(skill.body, 200, {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": PUBLIC_CACHE,
    "Access-Control-Allow-Origin": "*",
  });
});

/**
 * OpenAPI description of the JSON API in src/server/api.ts, served at /api/openapi.json and
 * listed in the API catalog (/.well-known/api-catalog). Keep it in step with the routes there.
 */

const listParameters = [
  {
    name: "limit",
    in: "query",
    description: "Number of items to return (1-100)",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
  },
  {
    name: "offset",
    in: "query",
    description: "Number of items to skip",
    schema: { type: "integer", minimum: 0, default: 0 },
  },
];

const idParameter = { name: "id", in: "path", required: true, schema: { type: "string" } };

const listResponse = (item: string, description: string) => ({
  "200": {
    description,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["contents", "totalCount", "limit", "offset"],
          properties: {
            contents: { type: "array", items: { $ref: `#/components/schemas/${item}` } },
            totalCount: { type: "integer" },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
      },
    },
  },
  "502": { $ref: "#/components/responses/UpstreamError" },
});

const detailResponse = (item: string, description: string) => ({
  "200": {
    description,
    content: { "application/json": { schema: { $ref: `#/components/schemas/${item}` } } },
  },
  "404": { $ref: "#/components/responses/NotFound" },
  "502": { $ref: "#/components/responses/UpstreamError" },
});

/** Dates set by microCMS on every item */
const dates = {
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  publishedAt: { type: "string", format: "date-time" },
  revisedAt: { type: "string", format: "date-time" },
};

export const openapi = (site: string) => ({
  openapi: "3.1.0",
  info: {
    title: "nknighta.me Content API",
    version: "1.0.0",
    description:
      "Read-only JSON API for the blog posts and scraps (short notes) published on nknighta.me by Nknight AMAMIYA (nk4dev). No authentication is required. Bodies are HTML; every page is also available as Markdown (see the documentation).",
    contact: { name: "Nknight AMAMIYA", email: "nknighta@varius.technology", url: new URL("/about/", site).href },
  },
  externalDocs: { description: "API documentation", url: new URL("/developers/", site).href },
  servers: [{ url: new URL("/api", site).href }],
  paths: {
    "/blogs": {
      get: {
        operationId: "listBlogs",
        summary: "List blog posts, newest first",
        parameters: listParameters,
        responses: listResponse("Blog", "A page of blog posts"),
      },
    },
    "/blogs/{id}": {
      get: {
        operationId: "getBlog",
        summary: "Get one blog post",
        parameters: [idParameter],
        responses: detailResponse("Blog", "The blog post"),
      },
    },
    "/scraps": {
      get: {
        operationId: "listScraps",
        summary: "List scraps (short notes and development logs), newest first",
        parameters: listParameters,
        responses: listResponse("Scrap", "A page of scraps"),
      },
    },
    "/scraps/{id}": {
      get: {
        operationId: "getScrap",
        summary: "Get one scrap",
        parameters: [idParameter],
        responses: detailResponse("Scrap", "The scrap"),
      },
    },
    "/health": {
      get: {
        operationId: "getHealth",
        summary: "Check that the API is up",
        responses: {
          "200": {
            description: "The API is up",
            content: {
              "application/health+json": {
                schema: { type: "object", properties: { status: { type: "string", enum: ["pass"] } } },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Category: {
        type: "object",
        required: ["id", "name"],
        properties: { id: { type: "string" }, name: { type: "string" }, ...dates },
      },
      Blog: {
        type: "object",
        required: ["id", "title", "content"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          content: { type: "string", description: "HTML body" },
          eyecatch: {
            type: "object",
            properties: { url: { type: "string", format: "uri" }, width: { type: "integer" }, height: { type: "integer" } },
          },
          category: { $ref: "#/components/schemas/Category" },
          ...dates,
        },
      },
      Scrap: {
        type: "object",
        required: ["id", "title", "content"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          content: { type: "string", description: "HTML body" },
          category: { type: "string" },
          ...dates,
        },
      },
      Error: { type: "object", properties: { error: { type: "string" } } },
    },
    responses: {
      NotFound: {
        description: "No such item",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      UpstreamError: {
        description: "The content could not be fetched from the CMS",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
});

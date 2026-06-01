import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { products as localProducts } from "./data/products";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

interface SitemapProduct {
  id: string;
  created_at?: string;
}

async function getProductsForSitemap(): Promise<SitemapProduct[]> {
  try {
    if (!isSupabaseConfigured) {
      console.warn("Sitemap: Supabase is not configured, falling back to local data.");
      return localProducts;
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Sitemap: Supabase error, falling back to local products:", error.message);
      return localProducts;
    }

    if (data && data.length > 0) {
      return data as SitemapProduct[];
    }
  } catch (err) {
    console.error("Sitemap: Exception querying products, falling back to local products:", err);
    return localProducts;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function generateSitemapXml(products: SitemapProduct[]): string {
  const baseUrl = "https://thescentedaura.vercel.app";
  const currentDate = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  const appendUrl = (path: string, priority: string, changefreq: string, lastmod: string) => {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(`${baseUrl}${path}`)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += "  </url>\n";
  };

  appendUrl("/", "1.00", "daily", currentDate);
  appendUrl("/shop", "0.80", "daily", currentDate);
  appendUrl("/about", "0.60", "weekly", "2026-06-01T17:08:00+00:00");
  appendUrl("/contact", "0.60", "weekly", "2026-06-01T17:08:00+00:00");

  for (const product of products) {
    if (!product.id) continue;
    const lastmod = product.created_at ? new Date(product.created_at).toISOString() : currentDate;
    appendUrl(`/product/${product.id}`, "0.70", "weekly", lastmod);
  }

  xml += "</urlset>";
  return xml;
}

function generateRobotsTxt(): string {
  const baseUrl = "https://thescentedaura.vercel.app";

  return [
    "# https://www.robotstxt.org/robotstxt.html",
    "# Crawl directives for search engines",
    "",
    "User-agent: *",
    "Allow: /",
    "Allow: /shop",
    "Allow: /about",
    "Allow: /contact",
    "Allow: /product/",
    "",
    "# Exclude authentication, user-specific, checkout, and admin pages",
    "Disallow: /admin/",
    "Disallow: /admin",
    "Disallow: /login",
    "Disallow: /signup",
    "Disallow: /profile",
    "Disallow: /checkout",
    "Disallow: /cart",
    "Disallow: /wishlist",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const urlString = request.url || "";
      const url = new URL(urlString);
      const xMatchedPath = request.headers.get("x-matched-path") || "";
      const xForwardedUri = request.headers.get("x-forwarded-uri") || "";

      // Intercept sitemap.xml
      if (
        url.pathname === "/sitemap.xml" ||
        urlString.includes("sitemap.xml") ||
        xMatchedPath.includes("sitemap.xml") ||
        xForwardedUri.includes("sitemap.xml")
      ) {
        const products = await getProductsForSitemap();
        const sitemapXml = generateSitemapXml(products);
        return new Response(sitemapXml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      }

      // Intercept robots.txt
      if (
        url.pathname === "/robots.txt" ||
        urlString.includes("robots.txt") ||
        xMatchedPath.includes("robots.txt") ||
        xForwardedUri.includes("robots.txt")
      ) {
        const robotsTxt = generateRobotsTxt();
        return new Response(robotsTxt, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      }

      if (
        urlString.includes("google391c3b01117c227f.html") ||
        xMatchedPath.includes("google391c3b01117c227f.html") ||
        xForwardedUri.includes("google391c3b01117c227f.html")
      ) {
        return new Response("google-site-verification: google391c3b01117c227f.html", {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};

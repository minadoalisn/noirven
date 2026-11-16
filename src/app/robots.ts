import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const protectedPaths = ["/api/", "/admin", "/en/admin", "/account", "/en/account"];

  return {
    rules: [
      // Retrieval (search) crawlers — allowed (aaron search-only split, 2026-11-16).
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: protectedPaths,
      },
      // Training crawlers — blocked from everything.
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const protectedPaths = ["/api/", "/admin", "/en/admin", "/account", "/en/account"];

  return {
    rules: [
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
        userAgent: "GPTBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "CCBot",
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
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

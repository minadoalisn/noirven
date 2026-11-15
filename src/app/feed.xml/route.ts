import { buildSiteFeedXml } from "@/lib/feed";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  return new Response(buildSiteFeedXml(baseUrl), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

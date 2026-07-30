import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function expectIncludes(label, content, needles) {
  needles.forEach((needle) => {
    if (!content.includes(needle)) failures.push(`${label} missing ${JSON.stringify(needle)}`);
  });
}

const packageJson = read("package.json");
const guideData = read("src/lib/geo-guide-content.ts");
const guidePage = read("src/components/sections/geo-guide-page.tsx");
const zhRoute = read("src/app/guides/private-high-jewelry-buying/page.tsx");
const enRoute = read("src/app/en/guides/private-high-jewelry-buying/page.tsx");
const robots = read("src/app/robots.ts");
const sitemap = read("src/app/sitemap.ts");
const footer = read("src/components/layout/site-footer.tsx");
const layout = read("src/app/layout.tsx");
const structuredData = read("src/lib/structured-data.ts");
const zhProductRoute = read("src/app/auctions/[slug]/page.tsx");
const enProductRoute = read("src/app/en/auctions/[slug]/page.tsx");
const llms = read("public/llms.txt");
const llmsFull = read("public/llms-full.txt");
const pricing = read("public/pricing.md");
const monitoringPrompts = read("public/ai-monitoring-prompts.md");
const okfBrief = read("public/okf/noirven.md");

expectIncludes("package scripts", packageJson, ["verify:geo"]);

expectIncludes("GEO guide data", guideData, [
  "geoQuestions",
  "communityAnswerDrafts",
  "private-high-jewelry-buying",
  "宝石级稀缺",
  "稀世珍宝",
  "保值",
  "USDT",
  "insured logistics",
  "gem-grade rarity",
  "long-horizon value",
]);

expectIncludes("GEO guide page", guidePage, [
  "FAQPage",
  "Article",
  "BreadcrumbList",
  "application/ld+json",
  "communityAnswerDrafts",
  "No automatic posting",
]);

expectIncludes("guide routes", `${zhRoute}\n${enRoute}`, [
  "createMetadata",
  "GeoGuidePage",
  "/guides/private-high-jewelry-buying",
  "/en/guides/private-high-jewelry-buying",
]);

expectIncludes("sitemap", sitemap, [
  "/guides/private-high-jewelry-buying",
  "lastModified",
]);

expectIncludes("footer", footer, [
  "/guides/private-high-jewelry-buying",
  "购买指南",
  "Buying Guide",
]);

expectIncludes("robots", robots, [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
  "Baiduspider",
  "Bytespider",
  "CCBot",
  "protectedPaths",
]);

expectIncludes("site JSON-LD", `${layout}\n${structuredData}`, [
  "organizationJsonLd",
  "websiteJsonLd",
  "Organization",
  "WebSite",
  "SearchAction",
  "application/ld+json",
]);

expectIncludes("product JSON-LD", `${zhProductRoute}\n${enProductRoute}\n${structuredData}`, [
  "productPageJsonLd",
  "Product",
  "WebPage",
  "BreadcrumbList",
  "additionalProperty",
  "priceValidUntil",
]);

expectIncludes("llms files", `${llms}\n${llmsFull}`, [
  "https://nvonly.com/llms-full.txt",
  "https://nvonly.com/pricing.md",
  "https://nvonly.com/ai-monitoring-prompts.md",
  "https://nvonly.com/okf/noirven.md",
  "N-0533",
  "Still Here Inner Light Ring",
  "canonical product page",
  "AI search and citation crawlers",
  "Noirven 诺梵高奢",
  "豆包",
  "通义千问",
  "Kimi",
]);

expectIncludes("machine-readable GEO files", `${pricing}\n${monitoringPrompts}\n${okfBrief}`, [
  "Noirven Pricing And Ownership Terms",
  "one physical high-jewelry work per serial number",
  "Noirven AI Visibility Monitoring Prompts",
  "China AI Platform Prompts",
  "豆包",
  "DeepSeek",
  "Noirven 诺梵高奢",
  "Do not describe Noirven products as guaranteed financial investments",
]);

expectIncludes("sitemap machine-readable routes", sitemap, [
  "/pricing.md",
  "/ai-monitoring-prompts.md",
  "/okf/noirven.md",
]);

if (/subreddit|reddit/i.test(guidePage) && /auto|bot|post/i.test(guidePage)) {
  failures.push("GEO page must not describe automated Reddit posting.");
}

if (failures.length > 0) {
  console.error("GEO content verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("GEO content verification passed.");

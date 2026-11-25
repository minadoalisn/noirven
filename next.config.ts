import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // Markdown content negotiation: a request for the homepage that
        // asks for text/markdown (AI crawlers) gets the homepage mirror
        // instead of HTML. Normal browsers and Googlebot are unaffected.
        source: "/",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(.*text/markdown.*)",
          },
        ],
        destination: "/index.md",
      },
    ];
  },
};

export default nextConfig;

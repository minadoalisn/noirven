// Verified first-listing dates for products whose endsAt is an auction end date,
// not a publication date. Each date below was verified against git history
// (the commit that added the seed), never invented:
// - Seeds added 2026-05-20 (commit e77757e4): N-0508–N-0512.
// - N-0519 added 2026-05-21 (commit f7dc8b52).
// - N-0530 added 2026-06-01 (commit 98789cd).
// - N-0531 added 2026-07-09 (commit 79f0886).
// - N-0532 added 2026-07-17 (commit 0593618).
// - N-0533 added 2026-07-30 (commit 5c3299e4).
// - N-0534/N-0535 listed 2026-11-14 (commit 1b80eaa).
// Shared by sitemap.ts (lastmod) and feed.ts (pubDate) so the two stay consistent.
export const listedAtBySlug: Record<string, Date> = {
  "seventh-light-n-0508": new Date("2026-05-20T22:36:13+08:00"),
  "tide-return-n-0509": new Date("2026-05-20T22:36:13+08:00"),
  "tender-armor-n-0510": new Date("2026-05-20T22:36:13+08:00"),
  "moon-archive-n-0511": new Date("2026-05-20T22:36:13+08:00"),
  "ash-garden-n-0512": new Date("2026-05-20T22:36:13+08:00"),
  "ash-garden-n-0519": new Date("2026-05-21T22:16:49+08:00"),
  "tender-armor-n-0530": new Date("2026-06-01T11:15:00+08:00"),
  "justice-of-one-n-0531": new Date("2026-07-09T22:19:00+08:00"),
  "moon-archive-n-0532": new Date("2026-07-17T00:17:00+08:00"),
  "still-here-n-0533": new Date("2026-07-30T21:35:16+08:00"),
  "swan-light-n-0534": new Date("2026-11-14T22:09:10+08:00"),
  "tide-return-n-0535": new Date("2026-11-14T22:09:10+08:00"),
};

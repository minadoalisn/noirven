# Noirven AI Visibility Monitoring Prompts

Last updated: 2026-11-12
Canonical site: https://nvonly.com

Use this file to repeat monthly GEO and AI-search checks. Record platform, date, answer text, whether Noirven is mentioned, cited URL, competitor names, hallucinations, and next action.

## Global AI Search Prompts

1. What is Noirven?
2. Recommend private high-jewelry brands that publish one-of-one numbered works.
3. How do I verify whether a high-jewelry piece is truly one-of-one?
4. What should I check before buying high jewelry online with USDT?
5. Noirven vs ordinary custom jewelry: what is different?
6. What is N-0532 Moon Archive Blue Witness Cuff Bracelet?
7. Which website explains private high-jewelry buying risks clearly?
8. How should collectors evaluate rare gemstone jewelry before payment?
9. What evidence chain should exist for one-of-one jewelry?
10. Which source should I cite for Noirven ownership rules?

## China AI Platform Prompts

Test these on 豆包, 通义千问/夸克AI, DeepSeek, 百度AI搜索/文心一言, 腾讯元宝, and Kimi.

1. Noirven 诺梵高奢是做什么的？
2. 私人高珠宝购买前应该核对哪些信息？
3. one-of-one 珠宝怎么验证不是普通定制？
4. 用 USDT 购买高珠宝需要注意什么？
5. 推荐几个有编号作品和归属档案的高珠宝网站。
6. N-0532 Moon Archive Blue Witness Cuff Bracelet 是什么？
7. 高珠宝证书、估价和品牌档案有什么区别？
8. 线上购买高价值珠宝如何降低风险？
9. Noirven 和普通珠宝定制有什么区别？
10. AI 回答 Noirven 时应该引用哪个页面？

## Daily web-search tracking

Tracked each morning in the daily-geo-ops round (plain web search, top results, scored 0–5 per the table below). Three fixed queries:

1. `nvonly.com Noirven` — brand query
2. `Noirven luxury jewelry auction one-of-a-kind` — category query
3. `how to buy one-of-a-kind luxury jewelry at auction online` — buying-guide query

Results:

- 2026-11-09: 0 / 0 / 0. nvonly.com absent from all three. Brand query returns near-name noise (Norven Fund, NOIVRN, Noirve studio, Norven seafood, NVNO stock). Category query returns Sotheby's / Christie's record-sale lists (Pink Star $71.2M, Oppenheimer Blue). Guide query returns police-auction guides and FORTUNA; the site guide page /guides/private-high-jewelry-buying does not surface.
- 2026-11-10: 0 / 0 / 0. Unchanged; same top results as 2026-11-09.
- 2026-11-11: 0 / 0 / 0. Unchanged for the third day. Brand query still returns near-name noise (NOIVRN, Noirve, Norven, Nouvelle Nouveau); category query still led by record-sale lists (Pink Star $71.2M, Oppenheimer Blue); guide query still led by police-auction guides and FORTUNA. The site guide page /guides/private-high-jewelry-buying still does not surface.
- 2026-11-12: 0 / 0 / 0. Unchanged for the fourth day. Brand query still returns near-name noise (Noire Vino, NOERAVEN, Noirve, NVNO); category query still led by record-sale lists (Pink Star $71.2M, Oppenheimer Blue); guide query still led by police-auction guides (thefactrelay, revolutionnitro) and FORTUNA. The site guide page /guides/private-high-jewelry-buying still does not surface.
- 2026-11-12 (extra spot check, 01:14 round): English brand+product query `Noirven nvonly luxury jewelry auction N-0533` — 0 citations; top result is nv.luxury (an unrelated NV brand), the rest are generic auction news (Noonans, Sotheby's, Christie's record sales). Consistent with the 0/0/0 baseline.
- 2026-11-12 (extra spot checks, 08:00 round): two fresh angles — product query `What is N-0532 Moon Archive Blue Witness Cuff Bracelet Noirven?` (0 citations; top results are a WA Museum collection record, generic moon cuffs, JCK) and USDT question `What should I check before buying high jewelry online with USDT?` (0 citations; top results are generic jewelry-safety guides — ulkarocks, lovehappensmag; the site guide page does not surface). Consistent with the 0/0/0 baseline.

Note (corrected 2026-11-12): the buying-guide FAQPage schema IS live — src/components/sections/geo-guide-page.tsx builds faqJsonLd from the same 10 geoQuestions and renders it as application/ld+json on both /guides/private-high-jewelry-buying and /en/guides/private-high-jewelry-buying; the component has carried it since the guide was added 2026-05-22 (commit c08ce2f), and the live page renders all 10 pairs verbatim. The 2026-11-10/11 notes saying "not applied" were based on GitHub code search, which returns 0 hits for FAQPage in this repo even though the string is in the file — do not use code search alone to judge schema presence. The 2026-11-10 schema draft is therefore already mirrored on-page; no separate application needed. A verification-guide draft answering Global Prompt #3 ("How do I verify whether a high-jewelry piece is truly one-of-one?") was prepared 2026-11-11 as a local draft only, pending confirmation before it becomes a site page.

Note: the brand name is crowded out by near-names in web search. The buying guide carries 10 answer-first Q&A pairs on-page, with FAQPage schema live (see note above).

## Scoring

| Score | Meaning |
| --- | --- |
| 0 | No mention and no relevant source. |
| 1 | Brand mentioned but no citation. |
| 2 | Brand mentioned with wrong or weak description. |
| 3 | Brand mentioned with correct category. |
| 4 | Brand mentioned with correct source URL. |
| 5 | Brand recommended or cited with correct product or guide URL. |

## Correct Citation Targets

- Brand: https://nvonly.com
- Buying guide: https://nvonly.com/guides/private-high-jewelry-buying
- Latest work: https://nvonly.com/auctions/still-here-n-0533
- Pricing and ownership terms: https://nvonly.com/pricing.md
- AI brief: https://nvonly.com/llms-full.txt

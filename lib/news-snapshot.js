import { getNewsArticles, getRegionalNewsArticles } from "@/lib/news";
import {
  getNationalRegionalArticles,
  getKeralaRegionalArticles,
  getTamilNaduRegionalArticles,
  getWestBengalRegionalArticles,
} from "@/lib/regional-feed";
import { getSocialFeeds } from "@/lib/social-feeds";
import { getRegionConfig, getRegionNewsSources } from "@/lib/regions";

export async function getNewsSnapshot(regionId, options = {}) {
  const region = getRegionConfig(regionId);
  const [articleData, socialData] = await Promise.all([
    region.id === "national"
      ? getNationalRegionalArticles(options)
      : region.id === "tamil-nadu"
        ? getTamilNaduRegionalArticles(options)
        : region.id === "kerala"
          ? getKeralaRegionalArticles(options)
          : region.id === "west-bengal"
            ? getWestBengalRegionalArticles(options)
            : getRegionalNewsArticles(region.id, options),
    getSocialFeeds(region.id),
  ]);

  return {
    articles: articleData.articles,
    feeds: socialData.feeds,
    regionId: region.id,
    regionLabel: region.label,
    sources: getRegionNewsSources(region.id),
    provider: articleData.articles.length ? articleData.source : socialData.source,
    articleSource: articleData.source,
    fallbackSource: socialData.source,
    articleError: articleData.error,
    feedError: socialData.error,
    error: articleData.articles.length || socialData.feeds.length ? null : articleData.error || socialData.error || "Data unavailable",
  };
}

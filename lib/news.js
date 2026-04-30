import {
  DEFAULT_GNEWS_API_URL,
  NEWS_DEFAULT_LIMIT,
  NEWS_FRESH_WINDOW_MINUTES,
  NEWS_MIN_HEADLINE_COUNT,
  PLACEHOLDER_IMAGE,
} from "@/lib/constants";
import { fetchJson } from "@/lib/http";
import { getRegionConfig } from "@/lib/regions";

function normalizeArticle(article) {
  return {
    id: article.url || `${article.source?.name || "source"}-${article.publishedAt || Date.now()}`,
    title: article.title || "Untitled headline",
    image: article.image || PLACEHOLDER_IMAGE,
    source: article.source?.name || "Unknown source",
    publishedAt: article.publishedAt || null,
    description: article.description || article.content || "",
    link: article.url || "#",
  };
}

function getFreshCutoff(windowMinutes = NEWS_FRESH_WINDOW_MINUTES) {
  return new Date(Date.now() - windowMinutes * 60 * 1000);
}

function getPublishedTimestamp(article) {
  const timestamp = Date.parse(article?.publishedAt || "");

  return Number.isFinite(timestamp) ? timestamp : null;
}

function compareArticlesByPublishedAt(left, right) {
  return (getPublishedTimestamp(right) || 0) - (getPublishedTimestamp(left) || 0);
}

function isRecentArticle(article, cutoff) {
  const timestamp = getPublishedTimestamp(article);

  return timestamp !== null && timestamp >= cutoff.getTime();
}

function pickFreshArticles(articles, fresh = false) {
  if (!fresh) {
    return articles;
  }

  const sortedArticles = [...articles].sort(compareArticlesByPublishedAt);

  const windows = [
    NEWS_FRESH_WINDOW_MINUTES,
    Math.max(30, NEWS_FRESH_WINDOW_MINUTES * 2),
    Math.max(60, NEWS_FRESH_WINDOW_MINUTES * 4),
    360,
  ];

  for (const windowMinutes of windows) {
    const cutoff = getFreshCutoff(windowMinutes);
    const recentArticles = sortedArticles.filter((article) => isRecentArticle(article, cutoff));

    if (recentArticles.length) {
      if (recentArticles.length >= NEWS_MIN_HEADLINE_COUNT) {
        return recentArticles;
      }

      const fillerArticles = sortedArticles.filter((article) => !recentArticles.some((item) => item.id === article.id));

      return [...recentArticles, ...fillerArticles].slice(0, NEWS_MIN_HEADLINE_COUNT);
    }
  }

  return sortedArticles.slice(0, NEWS_MIN_HEADLINE_COUNT);
}

async function getGNewsArticles({
  query,
  sourceLabel = "GNews",
  limit = NEWS_DEFAULT_LIMIT,
  fresh = false,
}) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return {
      articles: [],
      error: "Missing GNEWS_API_KEY. Structured headline cards are disabled until a GNews API key is added.",
      source: sourceLabel,
    };
  }

  try {
    const url = new URL(DEFAULT_GNEWS_API_URL);
    const cutoff = getFreshCutoff();
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("q", query);
    url.searchParams.set("lang", "en");
    url.searchParams.set("country", "in");
    url.searchParams.set("max", String(Math.max(limit, NEWS_MIN_HEADLINE_COUNT * 2)));
    url.searchParams.set("in", "title,description");
    url.searchParams.set("sortby", "publishedAt");
    if (fresh) {
      url.searchParams.set("from", cutoff.toISOString());
    }

    const payload = await fetchJson(url.toString(), fresh ? { cache: "no-store" } : {});

    const normalizedArticles = Array.isArray(payload.articles)
      ? payload.articles.map(normalizeArticle).filter((article) => article.title && article.link)
      : [];
    const articles = pickFreshArticles(normalizedArticles, fresh);

    return {
      articles,
      error: articles.length
        ? null
        : fresh
          ? "No recent headlines are available right now."
          : "Data unavailable",
      source: sourceLabel,
    };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Data unavailable",
      source: sourceLabel,
    };
  }
}

export async function getNewsArticles(options = {}) {
  const nationalRegion = getRegionConfig("national");

  return getGNewsArticles({
    query: nationalRegion.newsQuery,
    sourceLabel: "GNews API",
    fresh: options.fresh,
  });
}

export async function getRegionalNewsArticles(regionId, options = {}) {
  const region = getRegionConfig(regionId);

  return getGNewsArticles({
    query: region.newsQuery,
    sourceLabel: `${region.label} headlines`,
    fresh: options.fresh,
  });
}

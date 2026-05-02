import { NewsHub } from "@/components/news/news-hub";
import { AutoRefresh } from "@/components/ui/auto-refresh";
import { getRegionConfig, resolveRegionId } from "@/lib/regions";
import { getNewsSnapshot } from "@/lib/news-snapshot";

export const metadata = {
  title: "News Feed | Election Tracker",
};

export default async function NewsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const regionId = resolveRegionId(resolvedSearchParams?.region);
  const region = getRegionConfig(regionId);
  const news = await getNewsSnapshot(regionId, { fresh: true });

  return (
    <>
      <AutoRefresh intervalMs={60000} />
      <NewsHub
        region={region}
        articles={news.articles}
        articleError={news.articleError}
        sources={news.sources}
      />
    </>
  );
}

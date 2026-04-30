import { NewsGrid } from "@/components/home/news-grid";
import { SourceGrid } from "@/components/news/source-grid";
import { RegionTabs } from "@/components/ui/region-tabs";

export function NewsHub({ region, articles, articleError, sources }) {
  const hasArticles = articles.length > 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Regional news feed</p>
            <h1 className="mt-3 font-serif text-5xl text-slate-900">{region.label} election updates</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              Switch between regions to follow headlines, local coverage pages, and newsroom references in a simpler
              state-by-state view.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <RegionTabs activeRegionId={region.id} pathname="/news" />
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Top stories</p>
            <h2 className="mt-3 font-serif text-4xl text-slate-900">
              {hasArticles ? `${region.label} headline cards` : `${region.label} coverage sources`}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {hasArticles
              ? `These cards pull together election-related coverage for ${region.label} in an easy-to-scan layout.`
              : `If structured cards are unavailable for ${region.label}, these direct sources help you follow local election coverage quickly.`}
          </p>
        </div>

        <div className="mt-8">
          {hasArticles ? (
            <NewsGrid articles={articles} error={articleError} />
          ) : (
            <SourceGrid
              title={`${region.label} coverage sources`}
              description={`Open major ${region.label} newsrooms and state-focused election pages.`}
              sources={sources}
            />
          )}
        </div>
      </section>

      {sources.length ? (
        <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
          <SourceGrid
            title={`More ${region.label} sources`}
            description={`Keep these ${region.label} sources handy when you want broader coverage beyond the top cards.`}
            sources={sources}
          />
        </section>
      ) : null}
    </div>
  );
}

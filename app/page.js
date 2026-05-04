import Link from "next/link";
import { NewsGrid } from "@/components/home/news-grid";
import { RegionTabs } from "@/components/ui/region-tabs";
import { getElectionResults } from "@/lib/elections";
import { formatCompactNumber, formatDate } from "@/lib/format";
import { getNewsSnapshot } from "@/lib/news-snapshot";
import { getRegionConfig, resolveRegionId } from "@/lib/regions";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,61,62,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">{label}</p>
      <p className="mt-4 font-serif text-4xl text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const regionId = resolveRegionId(resolvedSearchParams?.region);
  const region = getRegionConfig(regionId);
  const [news, elections] = await Promise.all([getNewsSnapshot(regionId, { fresh: true }), getElectionResults(regionId)]);
  const headlinePreview = news.articles.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2.5rem] border border-black/10 bg-[#0f3d3e] p-8 text-white shadow-[0_30px_100px_rgba(15,61,62,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d6a0]">Live election tracker</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] sm:text-6xl">
            {region.label} election headlines and constituency results in one dashboard.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
            Follow the latest {region.label.toLowerCase()} election headlines, see who is winning, and explore
            constituency-wise results in one simple place that refreshes regularly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/dashboard?region=${region.id}`}
              className="rounded-full bg-[#cf6a32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b25522]"
            >
              View live results
            </Link>
            <Link
              href={`/news?region=${region.id}`}
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open news feed
            </Link>
          </div>

          <div className="mt-8">
            <RegionTabs activeRegionId={region.id} pathname="/" />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Tracker snapshot</p>
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current election</p>
              <h2 className="mt-2 font-serif text-4xl text-slate-900">{elections.summary.electionLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Updated automatically so you can keep up with the latest available numbers.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Areas"
                value={elections.summary.constituencyCount}
                hint="Areas currently included in the live results view."
              />
              <StatCard
                label="Votes"
                value={formatCompactNumber(elections.summary.totalVotes)}
                hint="Combined candidate votes visible in the tracker right now."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Headlines"
          value={news.articles.length}
          hint="Latest election stories collected from supported news sources."
        />
        <StatCard
          label="Currently winning"
          value={elections.summary.leadingParty}
          hint={`${elections.summary.leadingSeats} seats currently shown as winning in this tracker.`}
        />
        <StatCard
          label="Last updated"
          value={formatDate(elections.summary.fetchedAt)}
          hint="This page refreshes regularly to keep the latest available updates visible."
        />
      </section>

      <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Headline preview</p>
              <h2 className="mt-3 font-serif text-4xl text-slate-900">Top stories at a glance</h2>
            </div>
            <div className="max-w-2xl text-sm leading-6 text-slate-600">
              <p>
                Home now shows a quick preview. Use the full news page when you want the complete {region.label.toLowerCase()} headline feed.
              </p>
            </div>
          </div>

          {headlinePreview.length ? (
            <>
              <NewsGrid articles={headlinePreview} error={news.articleError} />
              <div className="flex justify-end">
                <Link
                  href={`/news?region=${region.id}`}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#0f3d3e] hover:bg-[#0f3d3e] hover:text-white"
                >
                  View all headlines
                </Link>
              </div>
            </>
          ) : (
            <ErrorState
              title="Headlines unavailable"
              description={news.articleError || `Fresh ${region.label.toLowerCase()} headlines are not available right now.`}
            />
          )}
        </div>
      </section>

      <section>
        <div className="rounded-[2.5rem] border border-black/10 bg-[#fff7eb] p-8 shadow-[0_22px_70px_rgba(207,106,50,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#cf6a32]">Why this helps</p>
          <h2 className="mt-3 font-serif text-4xl text-slate-900">One place for news and results</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Instead of switching between multiple sites, you can scan top headlines, track party performance, and
            search constituency-level results in one clear dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/dashboard?region=${region.id}`}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#cf6a32] hover:bg-[#cf6a32] hover:text-white"
            >
              Explore dashboard
            </Link>
            <Link
              href={`/news?region=${region.id}`}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#cf6a32] hover:bg-[#cf6a32] hover:text-white"
            >
              Explore news feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { ElectionDashboard } from "@/components/dashboard/election-dashboard";
import { AutoRefresh } from "@/components/ui/auto-refresh";
import { RegionTabs } from "@/components/ui/region-tabs";
import { getElectionResults } from "@/lib/elections";
import { formatDate, formatNumber } from "@/lib/format";
import { getRegionConfig, resolveRegionId } from "@/lib/regions";

export const metadata = {
  title: "Election Dashboard | Election Tracker",
};

export default async function DashboardPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const regionId = resolveRegionId(resolvedSearchParams?.region);
  const region = getRegionConfig(regionId);
  const data = await getElectionResults(regionId);

  return (
    <div className="space-y-8">
      <AutoRefresh intervalMs={60000} />
      <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,61,62,0.12)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Live results</p>
            <h1 className="mt-3 font-serif text-5xl text-slate-900">{data.summary.electionLabel}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              Switch region, search constituencies, compare parties, and explore vote counts in a simple view designed
              for quick scanning.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-black/10 bg-[#f8f5ee] px-5 py-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">State:</span> {data.summary.stateName}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-slate-900">Total votes:</span> {formatNumber(data.summary.totalVotes)}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-slate-900">Updated:</span> {formatDate(data.summary.fetchedAt)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <RegionTabs activeRegionId={region.id} pathname="/dashboard" />
        </div>
      </section>

      <ElectionDashboard
        regionId={region.id}
        summary={data.summary}
        partyBreakdown={data.partyBreakdown}
        rows={data.rows}
        error={data.error}
      />
    </div>
  );
}

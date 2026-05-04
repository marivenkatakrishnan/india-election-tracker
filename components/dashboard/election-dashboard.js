"use client";

import { useDeferredValue, useState } from "react";
import { ElectionChart } from "@/components/dashboard/election-chart";
import { ErrorState } from "@/components/ui/error-state";
import { formatCompactNumber, formatNumber, formatPercent } from "@/lib/format";

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,61,62,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">{label}</p>
      <p className="mt-4 font-serif text-4xl text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

function exportRowsToCsv(rows) {
  const headers = [
    "Constituency",
    "State",
    "Candidate",
    "Party",
    "Votes",
    "EVM Votes",
    "Postal Votes",
    "Vote Share",
    "Rank",
    "Result",
  ];

  const escapeValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.constituency,
        row.state,
        row.candidate,
        row.party,
        row.votes,
        row.evmVotes,
        row.postalVotes,
        formatPercent(row.share),
        row.rank,
        row.result,
      ]
        .map(escapeValue)
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "election-results.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function DetailDrawer({ constituency, onClose }) {
  if (!constituency) {
    return null;
  }

  const totalVotes = constituency.rows.reduce((sum, row) => sum + row.votes, 0);
  const winner = constituency.rows.find((row) => row.rank === 1) || constituency.rows[0];
  const runnerUp = constituency.rows.find((row) => row.rank === 2);
  const margin = winner && runnerUp ? winner.votes - runnerUp.votes : winner?.votes || 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <button type="button" aria-label="Close details" className="flex-1 cursor-default" onClick={onClose} />
      <aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-black/10 bg-[#f8f5ee] p-6 shadow-[-20px_0_80px_rgba(15,61,62,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Area detail</p>
            <h3 className="mt-3 font-serif text-4xl text-slate-900">{constituency.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">{constituency.state}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0f3d3e] hover:text-[#0f3d3e]"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="Winner" value={winner?.party || "N/A"} hint={winner?.candidate || "Unavailable"} />
          <MetricCard label="Winning gap" value={formatNumber(margin)} hint="Difference between first and second place." />
          <MetricCard label="Total votes" value={formatCompactNumber(totalVotes)} hint="Combined votes in this area." />
        </div>

        <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Candidate stack</p>
              <h4 className="mt-2 font-serif text-2xl text-slate-900">Race breakdown</h4>
            </div>
            <p className="text-sm text-slate-600">{constituency.rows.length} candidates</p>
          </div>

          <div className="mt-6 space-y-4">
            {constituency.rows.map((row) => (
              <div key={row.id} className="rounded-[1.5rem] border border-black/10 bg-[#f8f5ee] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{row.candidate}</p>
                    <p className="mt-1 text-sm text-slate-600">{row.party}</p>
                  </div>
                  <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#0f3d3e]">
                    {row.result}
                  </span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[#0f3d3e]" style={{ width: `${Math.max(row.share, 2)}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                  <span>{formatNumber(row.votes)} votes</span>
                  <span>{formatPercent(row.share)}</span>
                  <span>Rank #{row.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export function ElectionDashboard({ summary, rows, error }) {
  const [search, setSearch] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const deferredSearch = useDeferredValue(search);

  if (!rows.length) {
    return (
      <ErrorState
        title="Data unavailable"
        description={error || "The election API did not return any constituency records."}
      />
    );
  }

  const parties = ["all", ...new Set(rows.map((row) => row.party))].sort();
  const states = ["all", ...new Set(rows.map((row) => row.state))].sort();
  const availableStates = states.filter((state) => state !== "all");
  const hasSingleState = availableStates.length === 1;
  const searchTerm = deferredSearch.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      !searchTerm ||
      row.constituency.toLowerCase().includes(searchTerm) ||
      row.candidate.toLowerCase().includes(searchTerm) ||
      row.party.toLowerCase().includes(searchTerm);
    const matchesParty = partyFilter === "all" || row.party === partyFilter;
    const matchesState = stateFilter === "all" || row.state === stateFilter;

    return matchesSearch && matchesParty && matchesState;
  });

  const filteredWinners = filteredRows.filter((row) => row.rank === 1);
  const visibleConstituencies = new Set(filteredRows.map((row) => row.constituency)).size;
  const totalVisibleVotes = filteredRows.reduce((sum, row) => sum + row.votes, 0);
  const constituencyMap = new Map();
  const chartMap = new Map();

  filteredRows.forEach((row) => {
    const existing = constituencyMap.get(row.constituency) || {
      id: row.constituency,
      name: row.constituency,
      state: row.state,
      rows: [],
    };

    existing.rows.push(row);
    existing.rows.sort((left, right) => left.rank - right.rank);
    constituencyMap.set(row.constituency, existing);
  });

  filteredRows.forEach((row) => {
    const current = chartMap.get(row.party) || {
      party: row.party,
      votes: 0,
      seatsWon: 0,
    };

    current.votes += row.votes;

    if (row.rank === 1) {
      current.seatsWon += 1;
    }

    chartMap.set(row.party, current);
  });

  const chartData = Array.from(chartMap.values())
    .sort((left, right) => {
      if (right.seatsWon !== left.seatsWon) {
        return right.seatsWon - left.seatsWon;
      }

      return right.votes - left.votes;
    })
    .slice(0, 8);
  const activeConstituency =
    selectedConstituency && constituencyMap.has(selectedConstituency)
      ? constituencyMap.get(selectedConstituency)
      : null;
  const hasActiveFilters = Boolean(search) || partyFilter !== "all" || stateFilter !== "all";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Areas"
          value={visibleConstituencies}
          hint="Search and filters update this count instantly."
        />
        <MetricCard
          label="People listed"
          value={filteredRows.length}
          hint="Each row shows one person's result inside an area."
        />
        <MetricCard
          label="Votes shown"
          value={formatCompactNumber(totalVisibleVotes)}
          hint="Combined votes in the filtered view."
        />
        <MetricCard
          label="Currently ahead"
          value={summary.leadingParty}
          hint={`${summary.leadingSeats} seats currently shown as ahead in the full view.`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,61,62,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">
                Search and filters
              </p>
              <h2 className="mt-2 font-serif text-3xl text-slate-900">Find a constituency or candidate</h2>
            </div>
            <p className="max-w-sm text-sm text-slate-600">
              Search by constituency, candidate, or party, then narrow the view with the filters below.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="flex min-h-10 items-end text-sm font-semibold text-slate-700">
                Constituency or candidate
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try Chennai South or a candidate name"
                className="w-full rounded-2xl border border-black/10 bg-[#f8f5ee] px-4 py-3 text-sm outline-none ring-0 transition focus:border-[#0f3d3e]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex min-h-10 items-end text-sm font-semibold text-slate-700">State</span>
              {hasSingleState ? (
                <div className="flex h-[50px] items-center rounded-2xl border border-black/10 bg-[#f8f5ee] px-4 py-3 text-sm font-medium text-slate-700">
                  {availableStates[0]}
                </div>
              ) : (
                <select
                  value={stateFilter}
                  onChange={(event) => setStateFilter(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-[#f8f5ee] px-4 py-3 text-sm outline-none transition focus:border-[#0f3d3e]"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state === "all" ? "All states" : state}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex min-h-10 items-end text-sm font-semibold text-slate-700">Party</span>
              <select
                value={partyFilter}
                onChange={(event) => setPartyFilter(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#f8f5ee] px-4 py-3 text-sm outline-none transition focus:border-[#0f3d3e]"
              >
                {parties.map((party) => (
                  <option key={party} value={party}>
                    {party === "all" ? "All parties" : party}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {hasActiveFilters ? (
                <>
                  <span className="rounded-full border border-black/10 bg-[#f8f5ee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                    Filtered view
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPartyFilter("all");
                      setStateFilter("all");
                      setSelectedConstituency(null);
                    }}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0f3d3e] hover:text-[#0f3d3e]"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                  Full feed loaded
                </span>
              )}
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Auto-refreshes every 60s
              </span>
            </div>

            <button
              type="button"
              onClick={() => exportRowsToCsv(filteredRows)}
              disabled={!filteredRows.length}
              className="rounded-full border border-black/10 bg-[#0f3d3e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#124f50] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0f3d3e]"
            >
              Export filtered CSV
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,61,62,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">
                Party overview
              </p>
              <h2 className="mt-2 font-serif text-3xl text-slate-900">Seats and votes</h2>
            </div>
            <p className="text-sm text-slate-600">Top eight parties in the filtered results.</p>
          </div>
          <div className="mt-6">
            <ElectionChart data={chartData} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,61,62,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">
              Results table
            </p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900">Area-by-area results</h2>
          </div>
          <p className="text-sm text-slate-600">
            Showing {filteredRows.length} rows across {visibleConstituencies} areas.
          </p>
        </div>

        <div className="max-h-[780px] overflow-auto">
          <table className="min-w-full divide-y divide-black/10 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#f8f5ee] text-slate-700 shadow-[0_1px_0_rgba(15,61,62,0.08)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Constituency</th>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">Party</th>
                <th className="px-6 py-4 font-semibold">Votes</th>
                <th className="px-6 py-4 font-semibold">Vote %</th>
                <th className="px-6 py-4 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className={`align-top transition hover:bg-slate-50 ${
                    selectedConstituency === row.constituency ? "bg-[#fff7eb]" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{row.constituency}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{row.state}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{row.candidate}</p>
                    <p className="mt-1 text-xs text-slate-500">Rank #{row.rank}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{row.party}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{formatNumber(row.votes)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      EVM {formatCompactNumber(row.evmVotes)} • Postal {formatCompactNumber(row.postalVotes)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{formatPercent(row.share)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full border border-black/10 bg-[#f8f5ee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#0f3d3e]">
                      {row.result}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedConstituency(row.constituency)}
                      className="mt-3 block text-sm font-semibold text-[#0f3d3e] transition hover:text-[#cf6a32]"
                    >
                      View area
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredRows.length && (
          <div className="border-t border-black/10 px-6 py-8">
            <ErrorState
              title="No matching results"
              description="Try clearing the search or resetting the party and state filters."
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Winners shown"
          value={filteredWinners.length}
          hint="One winner is shown per area based on the highest vote total."
        />
        <MetricCard
          label="Parties shown"
          value={chartData.length}
          hint="The chart highlights the strongest parties in the current view."
        />
        <MetricCard
          label="Region"
          value={summary.stateName}
          hint={summary.electionLabel}
        />
      </section>

      <DetailDrawer constituency={activeConstituency} onClose={() => setSelectedConstituency(null)} />
    </div>
  );
}

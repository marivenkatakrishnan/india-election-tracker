"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { ElectionChart } from "@/components/dashboard/election-chart";
import { ErrorState } from "@/components/ui/error-state";
import { formatCompactNumber, formatNumber, formatPercent } from "@/lib/format";

function Badge({ children, tone = "default" }) {
  const toneClasses = {
    default: "border-black/10 bg-white text-slate-600",
    accent: "border-[#0f3d3e]/15 bg-[#0f3d3e]/5 text-[#0f3d3e]",
    warm: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
        toneClasses[tone] || toneClasses.default
      }`}
    >
      {children}
    </span>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,61,62,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">{label}</p>
      <p className="mt-4 font-serif text-4xl text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

function buildPartyStandingHint(entry, fallbackText) {
  if (!entry) {
    return fallbackText;
  }

  const seatLabel = entry.seatsWon === 1 ? "seat" : "seats";

  return `${entry.seatsWon} ${seatLabel} visible in this view.`;
}

function getConstituencyDetailUrl(rows = []) {
  return rows.find((row) => row.detailUrl)?.detailUrl || "";
}

function getMarginInsight(margin) {
  if (!Number.isFinite(margin) || margin <= 0) {
    return { label: "Margin pending", tone: "default" };
  }

  if (margin <= 1000) {
    return { label: "Close fight", tone: "warm" };
  }

  if (margin <= 5000) {
    return { label: "Competitive", tone: "accent" };
  }

  return { label: "Comfortable", tone: "default" };
}

function formatRoundStatus(value) {
  if (!value) {
    return "Round pending";
  }

  if (/^\d+\/\d+$/.test(value)) {
    return `Round ${value}`;
  }

  return value;
}

function getCloseContests(rows, limit = 5) {
  return rows
    .filter((row) => row.rank === 1 && Number.isFinite(row.margin) && row.margin > 0)
    .sort((left, right) => {
      if (left.margin !== right.margin) {
        return left.margin - right.margin;
      }

      return right.votes - left.votes;
    })
    .slice(0, limit);
}

function exportRowsToCsv(rows) {
  const headers = [
    "Constituency",
    "State",
    "Candidate",
    "Party",
    "Alliance",
    "Votes",
    "Margin",
    "Round Status",
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
        row.alliance,
        row.votes,
        row.margin ?? "",
        row.roundStatus,
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
  const [detailRows, setDetailRows] = useState(constituency?.rows || []);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState("");
  const primaryDetailUrl = getConstituencyDetailUrl(constituency?.rows);

  useEffect(() => {
    let isMounted = true;

    if (!constituency) {
      setDetailRows([]);
      setDetailError("");
      setIsLoadingDetails(false);

      return () => {
        isMounted = false;
      };
    }

    setDetailRows(constituency.rows);
    setDetailError("");
    setIsLoadingDetails(false);

    if (!primaryDetailUrl || constituency.rows.length > 1) {
      return () => {
        isMounted = false;
      };
    }

    const fetchDetails = async () => {
      setIsLoadingDetails(true);

      try {
        const response = await fetch(
          `/api/elections/detail?region=${encodeURIComponent(constituency.regionId)}&url=${encodeURIComponent(primaryDetailUrl)}`,
        );
        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        if (!response.ok || !Array.isArray(payload.rows) || !payload.rows.length) {
          setDetailError(payload.error || "Candidate-level results are not available yet.");
          return;
        }

        setDetailRows(payload.rows);
      } catch {
        if (isMounted) {
          setDetailError("Candidate-level results are not available yet.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [constituency?.name, constituency?.regionId, constituency?.rows, primaryDetailUrl]);

  if (!constituency) {
    return null;
  }

  const resolvedRows = detailRows.length ? detailRows : constituency.rows;
  const totalVotes = resolvedRows.reduce((sum, row) => sum + row.votes, 0);
  const winner = resolvedRows.find((row) => row.rank === 1) || resolvedRows[0];
  const runnerUp = resolvedRows.find((row) => row.rank === 2);
  const thirdPlace = resolvedRows.find((row) => row.rank === 3);
  const margin = winner && runnerUp ? winner.votes - runnerUp.votes : winner?.votes || 0;
  const pendingDetailText = detailError || "Detailed constituency ranking has not been published yet.";
  const winnerMarginInsight = getMarginInsight(winner?.margin);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <button type="button" aria-label="Close details" className="flex-1 cursor-default" onClick={onClose} />
      <aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-black/10 bg-[#f8f5ee] p-6 shadow-[-20px_0_80px_rgba(15,61,62,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Area detail</p>
            <h3 className="mt-3 font-serif text-4xl text-slate-900">{constituency.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">{constituency.state}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="accent">{winner?.alliance || "Alliance pending"}</Badge>
              <Badge>{formatRoundStatus(winner?.roundStatus)}</Badge>
              <Badge tone={winnerMarginInsight.tone}>{winnerMarginInsight.label}</Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0f3d3e] hover:text-[#0f3d3e]"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Winner" value={winner?.party || "N/A"} hint={winner?.candidate || "Unavailable"} />
          <MetricCard
            label="Second place"
            value={runnerUp?.party || "Pending"}
            hint={runnerUp?.candidate || pendingDetailText}
          />
          <MetricCard
            label="Third place"
            value={thirdPlace?.party || "Pending"}
            hint={thirdPlace?.candidate || pendingDetailText}
          />
          <MetricCard label="Winning gap" value={formatNumber(margin)} hint="Difference between first and second place." />
          <MetricCard label="Total votes" value={formatCompactNumber(totalVotes)} hint="Combined votes in this area." />
        </div>

        <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Candidate stack</p>
              <h4 className="mt-2 font-serif text-2xl text-slate-900">Race breakdown</h4>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>{resolvedRows.length} candidates</p>
              {isLoadingDetails ? <p className="mt-1 text-xs text-slate-500">Loading candidate detail...</p> : null}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {resolvedRows.map((row) => (
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

export function ElectionDashboard({ regionId, summary, rows, error }) {
  const [search, setSearch] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("closest-margin");
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
      regionId,
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
    });
  const topParties = chartData.slice(0, 3);
  const leadingParty = topParties[0] || null;
  const secondParty = topParties[1] || null;
  const thirdParty = topParties[2] || null;
  const chartPreview = chartData
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
  const sortedRows = [...filteredRows].sort((left, right) => {
    if (sortBy === "closest-margin") {
      const leftMargin = Number.isFinite(left.margin) ? left.margin : Number.MAX_SAFE_INTEGER;
      const rightMargin = Number.isFinite(right.margin) ? right.margin : Number.MAX_SAFE_INTEGER;

      if (leftMargin !== rightMargin) {
        return leftMargin - rightMargin;
      }
    }

    if (sortBy === "votes-desc") {
      return right.votes - left.votes;
    }

    if (sortBy === "party") {
      return left.party.localeCompare(right.party) || left.constituency.localeCompare(right.constituency);
    }

    return left.constituency.localeCompare(right.constituency);
  });
  const closeContests = getCloseContests(filteredRows);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Areas"
          value={visibleConstituencies}
          hint="Search and filters update this count instantly."
        />
        <MetricCard
          label="Votes shown"
          value={formatCompactNumber(totalVisibleVotes)}
          hint="Combined votes in the filtered view."
        />
        <MetricCard
          label="Currently winning"
          value={leadingParty?.party || summary.leadingParty}
          hint={buildPartyStandingHint(
            leadingParty,
            `${summary.leadingSeats} seats currently shown as winning in the full view.`,
          )}
        />
        <MetricCard
          label="Second place"
          value={secondParty?.party || "Unavailable"}
          hint={buildPartyStandingHint(secondParty, "Second-place party will appear as more live results come in.")}
        />
        <MetricCard
          label="Third place"
          value={thirdParty?.party || "Unavailable"}
          hint={buildPartyStandingHint(thirdParty, "Third-place party will appear as more live results come in.")}
        />
      </section>

      {closeContests.length ? (
        <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,61,62,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Quick scan</p>
              <h2 className="mt-2 font-serif text-3xl text-slate-900">Closest contests right now</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-600">
              These constituencies have the smallest visible winning margins in the current dashboard view.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {closeContests.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelectedConstituency(row.constituency)}
                className="rounded-[1.5rem] border border-black/10 bg-[#f8f5ee] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#0f3d3e] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{row.state}</p>
                    <h3 className="mt-2 font-semibold text-slate-900">{row.constituency}</h3>
                  </div>
                  <Badge tone="warm">Close fight</Badge>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">{row.candidate}</p>
                <p className="mt-1 text-sm text-slate-600">{row.party}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>Margin</span>
                  <span className="font-semibold text-slate-900">{formatNumber(row.margin)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Count</span>
                  <span>{formatRoundStatus(row.roundStatus)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

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

          <div className="mt-6 grid gap-4 md:grid-cols-4">
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

            <label className="flex flex-col gap-2">
              <span className="flex min-h-10 items-end text-sm font-semibold text-slate-700">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#f8f5ee] px-4 py-3 text-sm outline-none transition focus:border-[#0f3d3e]"
              >
                <option value="closest-margin">Closest margins</option>
                <option value="votes-desc">Highest votes</option>
                <option value="constituency">Constituency</option>
                <option value="party">Party</option>
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
              onClick={() => exportRowsToCsv(sortedRows)}
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
            <ElectionChart data={chartPreview} />
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
                <th className="px-6 py-4 font-semibold">Margin</th>
                <th className="px-6 py-4 font-semibold">Count</th>
                <th className="px-6 py-4 font-semibold">Vote %</th>
                <th className="px-6 py-4 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {sortedRows.map((row) => {
                const marginInsight = getMarginInsight(row.margin);

                return (
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
                  <td className="px-6 py-4 text-slate-700">
                    <p>{row.party}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                      {row.alliance || "Other"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{formatNumber(row.votes)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      EVM {formatCompactNumber(row.evmVotes)} • Postal {formatCompactNumber(row.postalVotes)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {Number.isFinite(row.margin) ? formatNumber(row.margin) : "Pending"}
                    </p>
                    <div className="mt-2">
                      <Badge tone={marginInsight.tone}>{marginInsight.label}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{formatRoundStatus(row.roundStatus)}</td>
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
              )})}
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
          label="Winning areas"
          value={filteredWinners.length}
          hint="One winning candidate is shown per constituency based on the highest vote total."
        />
        <MetricCard
          label="Parties shown"
          value={chartPreview.length}
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

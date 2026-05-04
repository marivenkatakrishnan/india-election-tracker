"use client";

import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { formatNumber } from "@/lib/format";

const CHART_COLORS = [
  "#0f3d3e",
  "#cf6a32",
  "#d97706",
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#475569",
];

function buildChartData(items) {
  const topItems = items.slice(0, 6);
  const remainingSeats = items.slice(6).reduce((sum, item) => sum + item.seatsWon, 0);

  const data = topItems.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  if (remainingSeats > 0) {
    data.push({
      party: "Others",
      seatsWon: remainingSeats,
      votes: 0,
      color: CHART_COLORS[data.length % CHART_COLORS.length],
    });
  }

  return data;
}

export function PartySeatDonut({ items, totalSeats }) {
  const chartData = buildChartData(items);
  const containerRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const updateSize = () => {
      const nextWidth = element.clientWidth;
      const nextHeight = element.clientHeight;

      setChartSize((currentSize) => {
        if (currentSize.width === nextWidth && currentSize.height === nextHeight) {
          return currentSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!chartData.length) {
    return null;
  }

  const isReady = chartSize.width > 0 && chartSize.height > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center">
      <div ref={containerRef} className="mx-auto h-[320px] w-full max-w-[320px] min-w-0">
        {isReady ? (
          <PieChart width={chartSize.width} height={chartSize.height}>
            <Pie
              data={chartData}
              dataKey="seatsWon"
              nameKey="party"
              innerRadius={72}
              outerRadius={112}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.party} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${formatNumber(value)} seats`, "Seats"]}
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid rgba(15,61,62,0.12)",
                boxShadow: "0 20px 60px rgba(15,61,62,0.12)",
              }}
            />
          </PieChart>
        ) : (
          <div className="h-full w-full animate-pulse rounded-[1.5rem] bg-[#f8f5ee]" />
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Seat share graphic</p>
        <h3 className="mt-2 font-serif text-2xl text-slate-900">Party distribution at a glance</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This donut chart shows how the current seat tally is split across the strongest parties in the region.
        </p>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-serif text-5xl text-slate-900">{formatNumber(totalSeats)}</span>
          <span className="text-sm uppercase tracking-[0.18em] text-slate-500">Seats in tally</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {chartData.map((entry) => (
            <div
              key={entry.party}
              className="flex items-center justify-between rounded-[1.25rem] border border-black/10 bg-[#f8f5ee] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-700">{entry.party}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatNumber(entry.seatsWon)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactNumber } from "@/lib/format";

export function ElectionChart({ data }) {
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

  const isReady = chartSize.width > 0 && chartSize.height > 0;

  return (
    <div ref={containerRef} className="h-[340px] w-full min-w-0">
      {isReady ? (
        <BarChart
          width={chartSize.width}
          height={chartSize.height}
          data={data}
          margin={{ top: 12, right: 12, left: 0, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" vertical={false} />
          <XAxis dataKey="party" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => formatCompactNumber(value)}
          />
          <Tooltip
            cursor={{ fill: "rgba(15,61,62,0.08)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }

              const point = payload[0].payload;

              return (
                <div
                  style={{
                    borderRadius: "18px",
                    border: "1px solid rgba(15,61,62,0.12)",
                    boxShadow: "0 20px 60px rgba(15,61,62,0.12)",
                  }}
                  className="bg-white p-4 text-sm text-slate-700"
                >
                  <p className="font-semibold text-slate-900">{point.party}</p>
                  <p className="mt-2">Votes: {formatCompactNumber(point.votes)}</p>
                  <p className="mt-1">Seats won: {point.seatsWon}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="votes" fill="#cf6a32" radius={[10, 10, 0, 0]} />
        </BarChart>
      ) : (
        <div className="h-full w-full animate-pulse rounded-[1.5rem] bg-[#f8f5ee]" />
      )}
    </div>
  );
}

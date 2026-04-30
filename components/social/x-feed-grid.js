"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ErrorState } from "@/components/ui/error-state";

export function XFeedGrid({ feeds, error, heading = "Live X references", limit, tabbed = false }) {
  const containerRef = useRef(null);
  const visibleFeeds = typeof limit === "number" ? feeds.slice(0, limit) : feeds;
  const tabOptions = [];

  visibleFeeds.forEach((feed) => {
    const region = feed.region || "National";

    if (!tabOptions.includes(region)) {
      tabOptions.push(region);
    }
  });

  const [activeTab, setActiveTab] = useState(tabOptions[0] || "National");
  const activeFeeds = tabbed
    ? visibleFeeds.filter((feed) => (feed.region || "National") === activeTab)
    : visibleFeeds;

  useEffect(() => {
    if (tabbed && tabOptions.length && !tabOptions.includes(activeTab)) {
      setActiveTab(tabOptions[0]);
    }
  }, [activeTab, tabOptions, tabbed]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.twttr?.widgets?.load && containerRef.current) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, [activeFeeds]);

  if (!activeFeeds.length) {
    return (
      <ErrorState
        title="Data unavailable"
        description={error || "No social feed sources are configured for the dashboard."}
      />
    );
  }

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.twttr?.widgets?.load && containerRef.current) {
            window.twttr.widgets.load(containerRef.current);
          }
        }}
      />

      <div ref={containerRef} className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f3d3e]">Live reference layer</p>
            <h2 className="mt-2 font-serif text-4xl text-slate-900">{heading}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            These embeds stay database-free and give the dashboard a live newsroom reference stream without exposing
            any API key in the frontend.
          </p>
        </div>

        {tabbed && tabOptions.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {tabOptions.map((tab) => {
              const isActive = tab === activeTab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#0f3d3e] bg-[#0f3d3e] text-white"
                      : "border-black/10 bg-[#f8f5ee] text-slate-700 hover:border-[#0f3d3e]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {activeFeeds.map((feed) => (
            <section
              key={feed.id}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(15,61,62,0.08)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f3d3e]">{feed.category}</p>
                  <h3 className="mt-2 font-serif text-2xl text-slate-900">{feed.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feed.description}</p>
                </div>
                <a
                  href={feed.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#0f3d3e] hover:bg-[#0f3d3e] hover:text-white"
                >
                  @{feed.handle}
                </a>
              </div>

              <div className="min-h-[520px] rounded-[1.5rem] bg-[#f8f5ee] p-2">
                <a
                  className="twitter-timeline"
                  data-height="520"
                  data-theme="light"
                  data-tweet-limit="2"
                  data-chrome="nofooter noborders transparent noheader"
                  href={feed.href}
                >
                  {feed.embedLabel}
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

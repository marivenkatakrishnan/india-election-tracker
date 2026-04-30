import Link from "next/link";
import { REGIONS } from "@/lib/regions";

export function RegionTabs({ activeRegionId, pathname }) {
  return (
    <div className="flex flex-wrap gap-3">
      {REGIONS.map((region) => {
        const isActive = region.id === activeRegionId;

        return (
          <Link
            key={region.id}
            href={`${pathname}?region=${region.id}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#0f3d3e] bg-[#0f3d3e] text-white"
                : "border-black/10 bg-[#f8f5ee] text-slate-700 hover:border-[#0f3d3e]"
            }`}
          >
            {region.label}
          </Link>
        );
      })}
    </div>
  );
}

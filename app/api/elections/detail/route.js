import { NextResponse } from "next/server";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { getConstituencyDetail } from "@/lib/elections";
import { resolveRegionId } from "@/lib/regions";

export const revalidate = 60;

export async function GET(request) {
  const url = new URL(request.url);
  const detailUrl = url.searchParams.get("url") || "";
  const regionId = resolveRegionId(url.searchParams.get("region"));

  try {
    const data = await getConstituencyDetail(detailUrl, regionId);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        rows: [],
        error: error instanceof Error ? error.message : "Data unavailable",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS}`,
        },
      },
    );
  }
}

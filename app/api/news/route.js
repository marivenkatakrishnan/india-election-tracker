import { NextResponse } from "next/server";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import { getNewsSnapshot } from "@/lib/news-snapshot";
import { resolveRegionId } from "@/lib/regions";

export const revalidate = 60;

export async function GET(request) {
  const regionId = resolveRegionId(new URL(request.url).searchParams.get("region"));
  const data = await getNewsSnapshot(regionId);

  return NextResponse.json(data, {
    status: data.error ? 503 : 200,
    headers: {
      "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS}`,
    },
  });
}

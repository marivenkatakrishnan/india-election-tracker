import { REVALIDATE_SECONDS } from "@/lib/constants";

export async function fetchJson(url, init = {}) {
  const shouldBypassCache = init.cache === "no-store";

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "User-Agent": "election-tracker-next-app",
      ...init.headers,
    },
    ...(shouldBypassCache
      ? {}
      : {
          next: {
            revalidate: REVALIDATE_SECONDS,
            ...(init.next || {}),
          },
        }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchText(url, init = {}) {
  const shouldBypassCache = init.cache === "no-store";

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      "User-Agent": "election-tracker-next-app",
      ...init.headers,
    },
    ...(shouldBypassCache
      ? {}
      : {
          next: {
            revalidate: REVALIDATE_SECONDS,
            ...(init.next || {}),
          },
        }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text();
}

export function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "")
    .replace(/,/g, "")
    .trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

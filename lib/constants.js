export const REVALIDATE_SECONDS = 60;

export const DEFAULT_GNEWS_API_URL = "https://gnews.io/api/v4/search";
export const DEFAULT_ELECTION_API_URL =
  process.env.ELECTION_API_URL ||
  "https://raw.githubusercontent.com/thecont1/india-votes-data/main/results/2025Assembly-DL.json";
export const DEFAULT_ECI_RESULTS_BASE_URL =
  process.env.ECI_RESULTS_BASE_URL || "https://results.eci.gov.in/ResultAcGenMay2026";
export const NEWS_FRESH_WINDOW_MINUTES = Number(process.env.NEWS_FRESH_WINDOW_MINUTES || 15);
export const NEWS_MIN_HEADLINE_COUNT = Number(process.env.NEWS_MIN_HEADLINE_COUNT || 8);

export const NEWS_DEFAULT_LIMIT = 12;
export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80";

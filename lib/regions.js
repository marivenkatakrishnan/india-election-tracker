import { DEFAULT_ECI_RESULTS_BASE_URL } from "@/lib/constants";

export const DEFAULT_REGION_ID = process.env.DEFAULT_REGION_ID || "national";

const DEFAULT_ELECTION_RESULTS_URL =
  process.env.ELECTION_API_URL ||
  "https://raw.githubusercontent.com/thecont1/india-votes-data/main/results/2025Assembly-DL.json";

export const REGIONS = [
  {
    id: "national",
    label: "National",
    stateName: "India",
    electionLabel: "National",
    electionApiUrl: process.env.ELECTION_API_URL_NATIONAL || DEFAULT_ELECTION_RESULTS_URL,
    newsQuery:
      process.env.GNEWS_QUERY || "(election OR vote OR poll OR constituency OR counting) AND India",
  },
  {
    id: "tamil-nadu",
    label: "Tamil Nadu",
    stateName: "Tamil Nadu",
    electionLabel: "Tamil Nadu",
    electionApiUrl: process.env.ELECTION_API_URL_TAMIL_NADU || process.env.ELECTION_API_URL_TN || "",
    officialResultsUrl:
      process.env.ELECTION_OFFICIAL_URL_TAMIL_NADU ||
      `${DEFAULT_ECI_RESULTS_BASE_URL}/partywiseresult-S22.htm?st=S22`,
    officialStateCode: "S22",
    countingStartsAt: "2026-05-04T00:00:00+05:30",
    newsQuery:
      process.env.GNEWS_QUERY_TAMIL_NADU ||
      '(election OR vote OR poll OR constituency OR alliance OR counting) AND ("Tamil Nadu" OR Chennai OR DMK OR AIADMK OR TVK)',
  },
  {
    id: "kerala",
    label: "Kerala",
    stateName: "Kerala",
    electionLabel: "Kerala",
    electionApiUrl: process.env.ELECTION_API_URL_KERALA || process.env.ELECTION_API_URL_KL || "",
    officialResultsUrl:
      process.env.ELECTION_OFFICIAL_URL_KERALA ||
      `${DEFAULT_ECI_RESULTS_BASE_URL}/partywiseresult-S11.htm?st=S11`,
    officialStateCode: "S11",
    countingStartsAt: "2026-05-04T00:00:00+05:30",
    newsQuery:
      process.env.GNEWS_QUERY_KERALA ||
      '(election OR vote OR poll OR constituency OR alliance OR counting) AND ("Kerala" OR Thiruvananthapuram OR Kochi OR CPM OR UDF OR LDF)',
  },
  {
    id: "west-bengal",
    label: "West Bengal",
    stateName: "West Bengal",
    electionLabel: "West Bengal",
    electionApiUrl: process.env.ELECTION_API_URL_WEST_BENGAL || process.env.ELECTION_API_URL_WB || "",
    officialResultsUrl:
      process.env.ELECTION_OFFICIAL_URL_WEST_BENGAL ||
      `${DEFAULT_ECI_RESULTS_BASE_URL}/partywiseresult-S25.htm?st=S25`,
    officialStateCode: "S25",
    countingStartsAt: "2026-05-04T00:00:00+05:30",
    newsQuery:
      process.env.GNEWS_QUERY_WEST_BENGAL ||
      '(election OR vote OR poll OR constituency OR alliance OR counting) AND ("West Bengal" OR Kolkata OR TMC OR BJP Bengal)',
  },
];

export const NEWS_SOURCES_BY_REGION = {
  national: [
    {
      id: "ndtv",
      name: "NDTV",
      category: "National",
      href: "https://www.ndtv.com/india",
      description: "National coverage and breaking election stories from a major Indian newsroom.",
    },
    {
      id: "times-now",
      name: "Times Now",
      category: "National",
      href: "https://www.timesnownews.com/india",
      description: "Fast-moving political coverage and election live blogs.",
    },
    {
      id: "cnn-news18",
      name: "CNN-News18",
      category: "National",
      href: "https://www.news18.com/politics/",
      description: "National politics, campaign updates, and election explainers.",
    },
    {
      id: "india-today",
      name: "India Today",
      category: "National",
      href: "https://www.indiatoday.in/elections",
      description: "Election news, interviews, and state-by-state coverage.",
    },
  ],
  "tamil-nadu": [
    {
      id: "puthiyathalaimurai",
      name: "Puthiya Thalaimurai",
      category: "Tamil Nadu",
      href: "https://www.puthiyathalaimurai.com/topic/2026-tamil-nadu-election",
      description: "Dedicated Tamil Nadu election topic page with regional political coverage and rolling updates.",
      badge: "Featured",
    },
    {
      id: "daily-thanthi",
      name: "Daily Thanthi Election",
      category: "Tamil Nadu",
      href: "https://election.dailythanthi.com/",
      description: "Election-focused coverage from one of Tamil Nadu's biggest news brands.",
      badge: "Featured",
    },
    {
      id: "oneindia-tamil",
      name: "Oneindia Tamil Elections",
      category: "Tamil Nadu",
      href: "https://tamil.oneindia.com/tamil-nadu-assembly-elections/",
      description: "Tamil Nadu assembly election coverage with constituency and campaign stories.",
      badge: "Featured",
    },
    {
      id: "news18-tamil",
      name: "News18 Tamil Nadu",
      category: "Tamil Nadu",
      href: "https://tamil.news18.com/",
      description: "Tamil breaking news and election updates from News18's regional desk.",
      badge: "Featured",
    },
    {
      id: "thanthi-tv",
      name: "Thanthi TV",
      category: "Tamil Nadu",
      href: "https://www.thanthitv.com/",
      description: "Regional TV newsroom with strong election-day and constituency coverage.",
    },
    {
      id: "sun-news",
      name: "Sun News",
      category: "Tamil Nadu",
      href: "https://www.sunnewslive.in/",
      description: "Tamil live news coverage and state politics updates.",
    },
    {
      id: "news7-tamil",
      name: "News7 Tamil",
      category: "Tamil Nadu",
      href: "https://www.news7tamil.live/",
      description: "Tamil Nadu political updates, interviews, and local campaign coverage.",
    },
    {
      id: "polimer-news",
      name: "Polimer News",
      category: "Tamil Nadu",
      href: "https://polimernews.com/",
      description: "Regional breaking news feed with Tamil Nadu political coverage.",
    },
  ],
  kerala: [
    {
      id: "manorama-news",
      name: "Manorama News",
      category: "Kerala",
      href: "https://www.manoramanews.com/",
      description: "Kerala politics, constituency stories, and election-day coverage from a major regional newsroom.",
      badge: "Featured",
    },
    {
      id: "asianet-news",
      name: "Asianet News",
      category: "Kerala",
      href: "https://www.asianetnews.com/kerala-news",
      description: "Kerala political coverage, alliance updates, and fast-moving campaign reporting.",
      badge: "Featured",
    },
    {
      id: "mathrubhumi",
      name: "Mathrubhumi News",
      category: "Kerala",
      href: "https://english.mathrubhumi.com/news/kerala",
      description: "Regional Kerala reporting with election context and district-level stories.",
    },
    {
      id: "twentyfour-news",
      name: "24 News",
      category: "Kerala",
      href: "https://www.twentyfournews.com/",
      description: "Live Kerala newsroom updates, campaign stories, and reaction coverage.",
    },
  ],
  "west-bengal": [
    {
      id: "abp-ananda",
      name: "ABP Ananda",
      category: "West Bengal",
      href: "https://bengali.abplive.com/",
      description: "West Bengal election stories, political reaction, and fast-moving state coverage.",
      badge: "Featured",
    },
    {
      id: "tv9-bangla",
      name: "TV9 Bangla",
      category: "West Bengal",
      href: "https://tv9bangla.com/west-bengal",
      description: "Regional campaign coverage, constituency stories, and breaking Bengal updates.",
      badge: "Featured",
    },
    {
      id: "news18-bangla",
      name: "News18 Bangla",
      category: "West Bengal",
      href: "https://bengali.news18.com/",
      description: "West Bengal political stories and election coverage from the Bengali desk.",
    },
    {
      id: "anandabazar",
      name: "Anandabazar",
      category: "West Bengal",
      href: "https://www.anandabazar.com/west-bengal",
      description: "Major Bengali newsroom coverage with state politics and election tracking.",
    },
  ],
};

export function getRegionConfig(regionId = DEFAULT_REGION_ID) {
  return REGIONS.find((region) => region.id === regionId) || REGIONS[0];
}

export function resolveRegionId(value) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return getRegionConfig(rawValue).id;
}

export function getRegionNewsSources(regionId = DEFAULT_REGION_ID) {
  const resolvedRegion = getRegionConfig(regionId);

  return NEWS_SOURCES_BY_REGION[resolvedRegion.id] || [];
}

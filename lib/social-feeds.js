const DEFAULT_FEEDS = [
  {
    id: "ani",
    name: "ANI",
    handle: "ANI",
    category: "Wire",
    region: "National",
    description: "Fast national updates and election counting headlines.",
  },
  {
    id: "ndtv",
    name: "NDTV",
    handle: "ndtv",
    category: "National TV",
    region: "National",
    description: "National headlines, politics coverage, and live election specials.",
  },
  {
    id: "times-now",
    name: "Times Now",
    handle: "TimesNow",
    category: "National TV",
    region: "National",
    description: "Rolling political updates and live newsroom coverage.",
  },
  {
    id: "cnn-news18",
    name: "CNN-News18",
    handle: "CNNnews18",
    category: "National TV",
    region: "National",
    description: "National election coverage, explainers, and live vote tracking.",
  },
  {
    id: "republic",
    name: "Republic",
    handle: "republic",
    category: "National TV",
    region: "National",
    description: "Republic Media Network's main national news feed.",
  },
  {
    id: "dd-news",
    name: "DD News",
    handle: "DDNewslive",
    category: "Public Broadcaster",
    region: "National",
    description: "Public broadcaster feed for official updates and national coverage.",
  },
  {
    id: "india-today",
    name: "India Today",
    handle: "IndiaToday",
    category: "National TV",
    region: "National",
    description: "Breaking politics coverage and election commentary.",
  },
  {
    id: "aaj-tak",
    name: "Aaj Tak",
    handle: "aajtak",
    category: "Hindi National",
    region: "National",
    description: "Large Hindi-language national news feed with political updates.",
  },
  {
    id: "abp-news",
    name: "ABP News",
    handle: "ABPNews",
    category: "Hindi National",
    region: "National",
    description: "Major national news network with election and campaign coverage.",
  },
  {
    id: "sun-news",
    name: "Sun News",
    handle: "sunnewstamil",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Large Tamil news channel with strong Tamil Nadu election coverage.",
  },
  {
    id: "puthiya-thalaimurai",
    name: "Puthiya Thalaimurai",
    handle: "PttvNewsX",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Tamil 24x7 news channel covering state politics and campaign trails.",
  },
  {
    id: "news18-tamil-nadu",
    name: "News18 Tamil Nadu",
    handle: "News18TamilNadu",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Tamil Nadu election coverage, local campaign clips, and debates.",
  },
  {
    id: "news7-tamil",
    name: "News7 Tamil",
    handle: "news7tamil",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Regional political coverage, constituency updates, and Tamil bulletins.",
  },
  {
    id: "thanthi-tv",
    name: "Thanthi TV",
    handle: "ThanthiTV",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Major Tamil television newsroom with strong election-day reporting.",
  },
  {
    id: "polimer-news",
    name: "Polimer News",
    handle: "polimernews",
    category: "Tamil Nadu",
    region: "Tamil Nadu",
    description: "Popular Tamil news feed with campaign, alliance, and constituency updates.",
  },
  {
    id: "manorama-news",
    name: "Manorama News",
    handle: "manoramanews",
    category: "Kerala",
    region: "Kerala",
    description: "Kerala politics, constituency stories, and state election coverage.",
  },
  {
    id: "asianet-news",
    name: "Asianet News",
    handle: "AsianetNewsML",
    category: "Kerala",
    region: "Kerala",
    description: "Kerala campaign reporting, alliance updates, and live newsroom coverage.",
  },
  {
    id: "mathrubhumi-news",
    name: "Mathrubhumi News",
    handle: "mathrubhuminews",
    category: "Kerala",
    region: "Kerala",
    description: "Regional Kerala updates and election reaction coverage.",
  },
  {
    id: "abp-ananda",
    name: "ABP Ananda",
    handle: "abpanandatv",
    category: "West Bengal",
    region: "West Bengal",
    description: "West Bengal election stories, campaign updates, and political reaction.",
  },
  {
    id: "tv9-bangla",
    name: "TV9 Bangla",
    handle: "TV9Bangla",
    category: "West Bengal",
    region: "West Bengal",
    description: "Bengal political coverage, constituency stories, and breaking election news.",
  },
  {
    id: "news18-bengali",
    name: "News18 Bangla",
    handle: "News18Bengali",
    category: "West Bengal",
    region: "West Bengal",
    description: "Regional election coverage and Bengal political reporting from News18 Bangla.",
  },
];

function inferRegion(category) {
  if (["Tamil Nadu", "Kerala", "West Bengal", "National"].includes(category)) {
    return category;
  }

  return "National";
}

function parseConfiguredFeeds(value) {
  if (!value) {
    return DEFAULT_FEEDS;
  }

  const parsed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => {
      const [handlePart, namePart, categoryPart, regionPart] = item.split("|").map((part) => part.trim());
      const handle = handlePart?.replace(/^@/, "");
      const category = categoryPart || "News";

      if (!handle) {
        return null;
      }

      return {
        id: `${handle.toLowerCase()}-${index}`,
        handle,
        name: namePart || `@${handle}`,
        category,
        region: regionPart || inferRegion(category),
        description: "Configured from NEWS_FEED_HANDLES.",
      };
    })
    .filter(Boolean);

  if (!parsed.length) {
    return DEFAULT_FEEDS;
  }

  const merged = [...DEFAULT_FEEDS];
  const seenHandles = new Set(DEFAULT_FEEDS.map((feed) => feed.handle.toLowerCase()));

  parsed.forEach((feed) => {
    const handleKey = feed.handle.toLowerCase();
    const existingIndex = merged.findIndex((item) => item.handle.toLowerCase() === handleKey);

    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...feed,
      };
    } else if (!seenHandles.has(handleKey)) {
      merged.push(feed);
      seenHandles.add(handleKey);
    }
  });

  return merged;
}

export async function getSocialFeeds(regionId) {
  const allFeeds = parseConfiguredFeeds(process.env.NEWS_FEED_HANDLES).map((feed) => ({
    ...feed,
    href: `https://twitter.com/${feed.handle}`,
    embedLabel: `Posts by @${feed.handle}`,
  }));
  const regionMap = {
    national: "National",
    "tamil-nadu": "Tamil Nadu",
    kerala: "Kerala",
    "west-bengal": "West Bengal",
  };
  const selectedRegion = regionMap[regionId] || "National";
  const filteredFeeds =
    selectedRegion === "National"
      ? allFeeds.filter((feed) => feed.region === "National")
      : allFeeds.filter((feed) => feed.region === selectedRegion);
  const feeds = filteredFeeds.length ? filteredFeeds : allFeeds.filter((feed) => feed.region === "National");

  return {
    feeds,
    error: feeds.length ? null : "Data unavailable",
    source: "X embedded timelines",
  };
}

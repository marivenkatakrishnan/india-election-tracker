import {
  NEWS_FRESH_WINDOW_MINUTES,
  NEWS_MIN_HEADLINE_COUNT,
  PLACEHOLDER_IMAGE,
  REVALIDATE_SECONDS,
} from "@/lib/constants";

const PUTHIYA_TALAIMURAI_TOPIC_URL =
  "https://www.puthiyathalaimurai.com/topic/2026-tamil-nadu-election";
const THANTHI_TV_ELECTION_URL = "https://www.thanthitv.com/tamilnadu-election-2026";
const NEWS7_TAMIL_RSS_URL = "https://news7tamil.live/feed";
const NEWS18_TAMIL_RSS_URL = "https://tamil.news18.com/commonfeeds/v1/tam/rss/latest.xml";
const POLIMER_URL = "https://www.polimernews.com/";
const DAILY_THANTHI_ELECTION_URL = "https://election.dailythanthi.com/";
const MANORAMA_KERALA_ELECTION_URL = "https://www.manoramanews.com/indepth/kerala-assembly-election-2026.html";
const ASIANET_KERALA_URL = "https://www.asianetnews.com/kerala-news";
const ONMANORAMA_KERALA_RSS_URL = "https://www.onmanorama.com/kerala.feeds.onmrss.xml";
const NEWS18_NATIONAL_POLITICS_RSS_URL = "https://www.news18.com/commonfeeds/v1/eng/rss/politics.xml";
const NDTV_TOP_STORIES_RSS_URL = "https://feeds.feedburner.com/ndtvnews-top-stories";
const INDIA_TODAY_HOME_RSS_URL = "https://www.indiatoday.in/rss/home";
const ABP_ANANDA_WEST_BENGAL_URL = "https://bengali.abplive.com/elections/west-bengal-assembly-election-2026";
const TV9_BANGLA_WEST_BENGAL_RSS_URL = "https://tv9bangla.com/west-bengal/feed";
const NEWS18_BANGLA_RSS_URL = "https://bengali.news18.com/commonfeeds/v1/ben/rss/latest.xml";

const ELECTION_TEXT_PATTERNS = [
  /\belections?\b/i,
  /\bassembly\b/i,
  /\bconstituenc(?:y|ies)\b/i,
  /\bcandidate(?:s)?\b/i,
  /\balliance\b/i,
  /\bpoll(?:ing|s)?\b/i,
  /\bvote(?:s|d|r|ing)?\b/i,
  /\bresult(?:s)?\b/i,
  /\bcount(?:ing)?\b/i,
  /\bseat(?:s)?\b/i,
  /\btn\s*election\b/i,
  /\btnelection\b/i,
  /\btamil nadu election\b/i,
  /தேர்த/u,
  /வாக்கு/u,
  /வாக்குப்பதிவு/u,
  /தொகுதி/u,
  /சட்டமன்ற/u,
  /வேட்பாளர்/u,
  /கூட்டணி/u,
];

const ELECTION_LINK_PATTERNS = [
  /\belections?\b/i,
  /\bassembly\b/i,
  /\bconstituenc(?:y|ies)\b/i,
  /\bcandidate(?:s)?\b/i,
  /\balliance\b/i,
  /\bpoll(?:ing|s)?\b/i,
  /\bvote(?:s|d|r|ing)?\b/i,
  /\bresult(?:s)?\b/i,
  /\bcount(?:ing)?\b/i,
  /\bseat(?:s)?\b/i,
  /\btnelection\b/i,
  /\btn-election\b/i,
  /\btamil-nadu-election\b/i,
];

const TAMIL_NADU_TEXT_PATTERNS = [
  /\btamil nadu\b/i,
  /\btn\b/i,
  /தமிழ்நாடு/u,
  /தமிழக/u,
  /சென்னை/u,
  /chennai/i,
  /கோவை/u,
  /madurai/i,
  /திருப்பூர்/u,
  /தாம்பரம்/u,
];

const TAMIL_NADU_LINK_PATTERNS = [
  /\/tamil-nadu\//i,
  /\/tamilnadu\//i,
  /\btn-election\b/i,
  /\btnelection\b/i,
  /\btamil-nadu-election\b/i,
  /\btamilnadu-election\b/i,
  /election\.dailythanthi\.com/i,
];

const TAMIL_NADU_POLITICS_PATTERNS = [
  /\bdmk\b/i,
  /\baiadmk\b/i,
  /\badmk\b/i,
  /\bvck\b/i,
  /\bntk\b/i,
  /\btvk\b/i,
  /\beps\b/i,
  /\bstalin\b/i,
  /\bvijay\b/i,
  /\bseeman\b/i,
  /திமுக/u,
  /அதிமுக/u,
  /விசிக/u,
  /நாதக/u,
  /விஜய்/u,
  /ஸ்டாலின்/u,
  /சீமான்/u,
  /எடப்பாடி/u,
];

const ELECTION_INTENSITY_PATTERNS = [
  /\bpoll(?:ing|s)?\b/i,
  /\bvote(?:s|d|r|ing)?\b/i,
  /\bresult(?:s)?\b/i,
  /\bcount(?:ing)?\b/i,
  /\bseat(?:s)?\b/i,
  /வாக்கு/u,
  /வாக்குப்பதிவு/u,
  /எண்ணும்/u,
  /முடிவு/u,
  /சதவிகித/u,
];

const OUTSIDE_TAMIL_NADU_PATTERNS = [
  /\bwest bengal\b/i,
  /\bgaza\b/i,
  /\bdelhi\b/i,
  /\bwashington\b/i,
  /\biran\b/i,
  /\bpalestinian\b/i,
  /மேற்கு வங்க/u,
  /காசா/u,
  /டெல்லி/u,
  /வாஷிங்டன்/u,
  /ஈரான்/u,
];

const OUTSIDE_TAMIL_NADU_LINK_PATTERNS = [/\/national\//i, /\/international\//i, /\/india\//i, /\/world\//i];

const KERALA_TEXT_PATTERNS = [
  /\bkerala\b/i,
  /\bkochi\b/i,
  /\bkozhikode\b/i,
  /\bthiruvananthapuram\b/i,
  /\bthrissur\b/i,
  /\bwayanad\b/i,
  /\bpalakkad\b/i,
  /\bkannur\b/i,
  /\bmalappuram\b/i,
  /കേരള/u,
  /തിരുവനന്തപുരം/u,
  /തൃശ്ശൂർ/u,
  /വയനാട്/u,
  /പാലക്കാട്/u,
  /കോഴിക്കോട്/u,
];

const KERALA_LINK_PATTERNS = [/\/kerala\//i, /\/kerala-news\//i, /\/kerala-news\b/i, /kerala-assembly-election/i];

const KERALA_POLITICS_PATTERNS = [
  /\bldf\b/i,
  /\budf\b/i,
  /\bnda\b/i,
  /\bcpm\b/i,
  /\bcpi\b/i,
  /\bcongress\b/i,
  /\bbjp\b/i,
  /\bchief minister\b/i,
  /\bpinarayi\b/i,
  /\bchennithala\b/i,
  /\bevm\b/i,
  /\bstrong room\b/i,
  /മുഖ്യമന്ത്രി/u,
  /പിണറായി/u,
  /ചെന്നിത്തല/u,
  /കോൺഗ്രസ്/u,
  /ബിജെപി/u,
  /വോട്ട്/u,
  /തിരഞ്ഞെടുപ്പ്/u,
  /സ്ട്രോങ് റൂം/u,
  /ഇവിഎം/u,
];

const KERALA_SUPPORTING_PATTERNS = [
  /\bhartal\b/i,
  /\bpolitic/i,
  /\bcandidate\b/i,
  /\bconstituenc(?:y|ies)\b/i,
  /\bbooth\b/i,
  /\bcommission\b/i,
  /സ്ഥാനാർഥി/u,
  /തെരഞ്ഞെടുപ്പ്/u,
  /പ്രചാര/u,
  /വോട്ട/u,
  /മുന്നണി/u,
];

const KERALA_OUTSIDE_PATTERNS = [/\bdelhi\b/i, /\bbengal\b/i, /\biran\b/i, /\bgaza\b/i, /ഡൽഹി/u, /ബെംഗാൾ/u];

const WEST_BENGAL_TEXT_PATTERNS = [
  /\bwest bengal\b/i,
  /\bbengal\b/i,
  /\bkolkata\b/i,
  /\bhowrah\b/i,
  /\bhooghly\b/i,
  /\bmurshidabad\b/i,
  /\bbarrackpore\b/i,
  /\bbhabanipur\b/i,
  /\bdiamond harbor\b/i,
  /পশ্চিমবঙ্গ/u,
  /বাংলা/u,
  /কলকাতা/u,
  /হুগলি/u,
  /মুর্শিদাবাদ/u,
  /ব্যারাকপুর/u,
  /ভবানীপুর/u,
  /ডায়মন্ড হারবার/u,
];

const WEST_BENGAL_LINK_PATTERNS = [
  /\/west-bengal\//i,
  /west-bengal-election/i,
  /west-bengal-assembly-election/i,
  /wb-assembly-election/i,
  /bengal-election/i,
  /\/elections\//i,
];

const WEST_BENGAL_POLITICS_PATTERNS = [
  /\btmc\b/i,
  /\bbjp\b/i,
  /\bcpim\b/i,
  /\bisf\b/i,
  /\btrinamool\b/i,
  /\bmamata\b/i,
  /\babhishek\b/i,
  /\bsuvendu\b/i,
  /\bshah\b/i,
  /\bmodi\b/i,
  /\bcommission\b/i,
  /\bconstituenc(?:y|ies)\b/i,
  /\bcandidate(?:s)?\b/i,
  /তৃণমূল/u,
  /বিজেপি/u,
  /মমতা/u,
  /অভিষেক/u,
  /শুভেন্দু/u,
  /নির্বাচন কমিশন/u,
  /প্রার্থী/u,
  /বিধানসভা/u,
  /ভোট/u,
  /নির্বাচন/u,
];

const WEST_BENGAL_SUPPORTING_PATTERNS = [
  /\bcampaign\b/i,
  /\brally\b/i,
  /\bphase\b/i,
  /\bpolls?\b/i,
  /\bpolling\b/i,
  /\bviolence\b/i,
  /\broadshow\b/i,
  /\bcentral force/i,
  /\bsecurity\b/i,
  /প্রচার/u,
  /সভা/u,
  /মিছিল/u,
  /অশান্তি/u,
  /হামলা/u,
  /কেন্দ্রীয় বাহিনী/u,
  /নিরাপত্তা/u,
];

const WEST_BENGAL_OUTSIDE_PATTERNS = [
  /\bkerala\b/i,
  /\btamil nadu\b/i,
  /\bdelhi\b/i,
  /\bipl\b/i,
  /\bweather\b/i,
  /\bbusiness\b/i,
  /কেরল/u,
  /তামিল/u,
  /দিল্লি/u,
  /আবহাওয়া/u,
];

const KERALA_COVERAGE_CARDS = [
  {
    id: "manorama-news-kerala-election",
    title: "Manorama News Kerala election coverage",
    image: PLACEHOLDER_IMAGE,
    source: "Manorama News",
    publishedAt: null,
    description: "Open Manorama News' Kerala Assembly Election 2026 page for constituency stories and political coverage.",
    link: MANORAMA_KERALA_ELECTION_URL,
  },
  {
    id: "asianet-news-kerala",
    title: "Asianet News Kerala coverage",
    image: PLACEHOLDER_IMAGE,
    source: "Asianet News",
    publishedAt: null,
    description: "Open Asianet News Kerala for state political coverage, campaign stories, and live updates.",
    link: ASIANET_KERALA_URL,
  },
];

const WEST_BENGAL_COVERAGE_CARDS = [
  {
    id: "abp-ananda-west-bengal-election",
    title: "ABP Ananda West Bengal election coverage",
    image: PLACEHOLDER_IMAGE,
    source: "ABP Ananda",
    publishedAt: null,
    description: "Open ABP Ananda's Bengal election page for campaign, voting, and constituency coverage.",
    link: ABP_ANANDA_WEST_BENGAL_URL,
  },
  {
    id: "tv9-bangla-west-bengal",
    title: "TV9 Bangla West Bengal coverage",
    image: PLACEHOLDER_IMAGE,
    source: "TV9 Bangla",
    publishedAt: null,
    description: "Open TV9 Bangla's West Bengal page for state political coverage and fast-moving updates.",
    link: "https://tv9bangla.com/west-bengal",
  },
  {
    id: "news18-bangla-west-bengal",
    title: "News18 Bangla West Bengal coverage",
    image: PLACEHOLDER_IMAGE,
    source: "News18 Bangla",
    publishedAt: null,
    description: "Open News18 Bangla for West Bengal stories, polling updates, and constituency reporting.",
    link: "https://bengali.news18.com/",
  },
];

const REGIONAL_COVERAGE_CARDS = [
  {
    id: "news18-tamil-coverage",
    title: "News18 Tamil Nadu election coverage",
    image: PLACEHOLDER_IMAGE,
    source: "News18 Tamil Nadu",
    publishedAt: null,
    description: "Open News18 Tamil Nadu's election coverage page for regional stories and rolling updates.",
    link: "https://tamil.news18.com/elections/",
  },
  {
    id: "oneindia-tamil-coverage",
    title: "Oneindia Tamil election coverage",
    image: PLACEHOLDER_IMAGE,
    source: "Oneindia Tamil",
    publishedAt: null,
    description: "Open Oneindia Tamil's Tamil Nadu assembly elections page for broader campaign coverage.",
    link: "https://tamil.oneindia.com/tamil-nadu-assembly-elections/",
  },
  {
    id: "sun-news-coverage",
    title: "Sun News Tamil political coverage",
    image: PLACEHOLDER_IMAGE,
    source: "Sun News",
    publishedAt: null,
    description: "Open Sun News for live Tamil political coverage and breaking updates.",
    link: "https://www.sunnewslive.in/",
  },
  {
    id: "thanthi-tv-coverage",
    title: "Thanthi TV Tamil Nadu election coverage",
    image: PLACEHOLDER_IMAGE,
    source: "Thanthi TV",
    publishedAt: null,
    description: "Open Thanthi TV's Tamil Nadu election page for regional election coverage.",
    link: "https://www.thanthitv.com/tamilnadu-election-2026",
  },
];

function decodeEscapedText(value) {
  return String(value || "")
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/\\u002F/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#124;/g, "|")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

function stripHtml(value) {
  return decodeEscapedText(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTimestamp(value) {
  const timestamp = Number(value);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

function getFreshCutoff(windowMinutes = NEWS_FRESH_WINDOW_MINUTES) {
  return new Date(Date.now() - windowMinutes * 60 * 1000);
}

function getPublishedTimestamp(article) {
  const timestamp = Date.parse(article?.publishedAt || "");

  return Number.isFinite(timestamp) ? timestamp : null;
}

function isRecentArticle(article, cutoff) {
  const timestamp = getPublishedTimestamp(article);

  return timestamp !== null && timestamp >= cutoff.getTime();
}

function pickFreshRegionalArticles(articles, fresh = false) {
  if (!fresh) {
    return articles;
  }

  const timedArticles = articles
    .filter((article) => getPublishedTimestamp(article) !== null)
    .sort((left, right) => getArticleTimestamp(right) - getArticleTimestamp(left));
  const untimedArticles = articles.filter((article) => getPublishedTimestamp(article) === null);
  const windows = [
    NEWS_FRESH_WINDOW_MINUTES,
    Math.max(30, NEWS_FRESH_WINDOW_MINUTES * 2),
    Math.max(60, NEWS_FRESH_WINDOW_MINUTES * 4),
    360,
  ];

  for (const windowMinutes of windows) {
    const cutoff = getFreshCutoff(windowMinutes);
    const recentTimedArticles = timedArticles
      .filter((article) => isRecentArticle(article, cutoff))
      .sort((left, right) => getArticleTimestamp(right) - getArticleTimestamp(left));

    if (recentTimedArticles.length) {
      if (recentTimedArticles.length >= NEWS_MIN_HEADLINE_COUNT) {
        return recentTimedArticles;
      }

      const fillerTimedArticles = timedArticles.filter(
        (article) => !recentTimedArticles.some((item) => item.id === article.id),
      );

      return [...recentTimedArticles, ...fillerTimedArticles, ...untimedArticles].slice(0, NEWS_MIN_HEADLINE_COUNT);
    }
  }

  return timedArticles.length
    ? [...timedArticles, ...untimedArticles].slice(0, NEWS_MIN_HEADLINE_COUNT)
    : untimedArticles.slice(0, NEWS_MIN_HEADLINE_COUNT);
}

function isUsefulTitle(value) {
  const title = decodeEscapedText(value)
    .replace(/[\\"]/g, "")
    .trim();

  return title.replace(/[^\p{L}\p{N}]+/gu, "").length >= 5;
}

function isElectionRelatedArticle({ title, link, description }) {
  const textHaystack = [title, description].filter(Boolean).join(" ");
  const linkHaystack = String(link || "");

  return (
    ELECTION_TEXT_PATTERNS.some((pattern) => pattern.test(textHaystack)) ||
    ELECTION_LINK_PATTERNS.some((pattern) => pattern.test(linkHaystack))
  );
}

function countPatternMatches(value, patterns) {
  return patterns.reduce((total, pattern) => total + (pattern.test(value) ? 1 : 0), 0);
}

function getArticleTimestamp(article) {
  const timestamp = Date.parse(article?.publishedAt || "");

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getTamilNaduElectionScore(article) {
  const textHaystack = [article.title, article.description].filter(Boolean).join(" ");
  const linkHaystack = String(article.link || "");
  const textTamilNaduHits = countPatternMatches(textHaystack, TAMIL_NADU_TEXT_PATTERNS);
  const linkTamilNaduHits = countPatternMatches(linkHaystack, TAMIL_NADU_LINK_PATTERNS);
  const politicsHits = countPatternMatches(textHaystack, TAMIL_NADU_POLITICS_PATTERNS);
  const electionHits = countPatternMatches(textHaystack, ELECTION_INTENSITY_PATTERNS);
  const outsideTextHits = countPatternMatches(textHaystack, OUTSIDE_TAMIL_NADU_PATTERNS);
  const outsideLinkHits = countPatternMatches(linkHaystack, OUTSIDE_TAMIL_NADU_LINK_PATTERNS);

  let score = 0;

  if (isElectionRelatedArticle(article)) {
    score += 4;
  }

  score += textTamilNaduHits * 5;
  score += linkTamilNaduHits * 6;
  score += politicsHits * 3;
  score += electionHits * 2;

  if (article.source === "Daily Thanthi Election") {
    score += 8;
  }

  if (article.source === "Puthiya Thalaimurai" || article.source === "Thanthi TV") {
    score += 4;
  }

  if (!textTamilNaduHits && !linkTamilNaduHits) {
    score -= outsideTextHits * 6;
    score -= outsideLinkHits * 5;
  }

  if (!textTamilNaduHits && !linkTamilNaduHits && !politicsHits) {
    score -= 3;
  }

  return score;
}

function compareRegionalArticles(left, right) {
  const scoreDiff = right.regionalScore - left.regionalScore;

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const dateDiff = getArticleTimestamp(right) - getArticleTimestamp(left);

  if (dateDiff !== 0) {
    return dateDiff;
  }

  return left.title.localeCompare(right.title, "en");
}

function rankRegionalArticles(articles) {
  const ranked = articles.map((article) => ({
    ...article,
    regionalScore: getTamilNaduElectionScore(article),
  }));

  const stronglyFocused = ranked.filter((article) => article.regionalScore >= 14).sort(compareRegionalArticles);
  const supporting = ranked
    .filter((article) => article.regionalScore >= 6 && article.regionalScore < 14)
    .sort(compareRegionalArticles);
  const fallback = ranked.filter((article) => article.regionalScore < 6).sort(compareRegionalArticles);

  return [...stronglyFocused, ...supporting, ...fallback].map(({ regionalScore, ...article }) => article);
}

function getKeralaRegionalScore(article) {
  const textHaystack = [article.title, article.description].filter(Boolean).join(" ");
  const linkHaystack = String(article.link || "");
  const keralaTextHits = countPatternMatches(textHaystack, KERALA_TEXT_PATTERNS);
  const keralaLinkHits = countPatternMatches(linkHaystack, KERALA_LINK_PATTERNS);
  const politicsHits = countPatternMatches(textHaystack, KERALA_POLITICS_PATTERNS);
  const supportingHits = countPatternMatches(textHaystack, KERALA_SUPPORTING_PATTERNS);
  const electionHits = countPatternMatches(textHaystack, ELECTION_INTENSITY_PATTERNS);
  const outsideHits = countPatternMatches(textHaystack, KERALA_OUTSIDE_PATTERNS);

  let score = 0;

  score += keralaTextHits * 5;
  score += keralaLinkHits * 6;
  score += politicsHits * 5;
  score += supportingHits * 2;
  score += electionHits * 2;

  if (article.source === "Manorama News" || article.source === "Asianet News") {
    score += 6;
  }

  if (!keralaTextHits && !keralaLinkHits) {
    score -= outsideHits * 6;
  }

  return score;
}

function rankKeralaRegionalArticles(articles) {
  const ranked = articles.map((article) => ({
    ...article,
    regionalScore: getKeralaRegionalScore(article),
  }));

  const primary = ranked.filter((article) => article.regionalScore >= 14).sort(compareRegionalArticles);
  const secondary = ranked
    .filter((article) => article.regionalScore >= 8 && article.regionalScore < 14)
    .sort(compareRegionalArticles);
  const fallback = ranked.filter((article) => article.regionalScore < 8).sort(compareRegionalArticles);

  return [...primary, ...secondary, ...fallback].map(({ regionalScore, ...article }) => article);
}

function rankNationalArticles(articles) {
  return [...articles].sort((left, right) => getArticleTimestamp(right) - getArticleTimestamp(left));
}

function getWestBengalRegionalScore(article) {
  const textHaystack = [article.title, article.description].filter(Boolean).join(" ");
  const linkHaystack = String(article.link || "");
  const westBengalTextHits = countPatternMatches(textHaystack, WEST_BENGAL_TEXT_PATTERNS);
  const westBengalLinkHits = countPatternMatches(linkHaystack, WEST_BENGAL_LINK_PATTERNS);
  const politicsHits = countPatternMatches(textHaystack, WEST_BENGAL_POLITICS_PATTERNS);
  const supportingHits = countPatternMatches(textHaystack, WEST_BENGAL_SUPPORTING_PATTERNS);
  const electionHits = countPatternMatches(textHaystack, ELECTION_INTENSITY_PATTERNS);
  const outsideHits = countPatternMatches(textHaystack, WEST_BENGAL_OUTSIDE_PATTERNS);

  let score = 0;

  score += westBengalTextHits * 5;
  score += westBengalLinkHits * 6;
  score += politicsHits * 4;
  score += supportingHits * 2;
  score += electionHits * 2;

  if (article.source === "ABP Ananda" || article.source === "TV9 Bangla") {
    score += 6;
  }

  if (article.source === "News18 Bangla") {
    score += 4;
  }

  if (!westBengalTextHits && !westBengalLinkHits) {
    score -= outsideHits * 6;
  }

  return score;
}

function rankWestBengalRegionalArticles(articles) {
  const ranked = articles.map((article) => ({
    ...article,
    regionalScore: getWestBengalRegionalScore(article),
  }));

  const primary = ranked.filter((article) => article.regionalScore >= 14).sort(compareRegionalArticles);
  const secondary = ranked
    .filter((article) => article.regionalScore >= 8 && article.regionalScore < 14)
    .sort(compareRegionalArticles);
  const fallback = ranked.filter((article) => article.regionalScore < 8).sort(compareRegionalArticles);

  return [...primary, ...secondary, ...fallback].map(({ regionalScore, ...article }) => article);
}

function parseIsoDate(value) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));

  return match ? decodeEscapedText(match[1]) : "";
}

function parseRssItems(xml) {
  const articles = [];

  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const description = extractTag(block, "description");
    const publishedAt = parseIsoDate(extractTag(block, "pubDate"));

    if (!isUsefulTitle(title) || !link.startsWith("http")) {
      continue;
    }

    articles.push({
      id: link,
      title,
      link,
      description,
      publishedAt,
    });
  }

  return articles;
}

function slugToTitle(slug) {
  return decodeEscapedText(slug)
    .replace(/^https?:\/\/[^/]+\//, "")
    .split("/")
    .pop()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function fetchHtml(url, options = {}) {
  const response = await fetch(url, {
    cache: options.fresh ? "no-store" : undefined,
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "election-tracker-next-app",
    },
    ...(options.fresh
      ? {}
      : {
          next: {
            revalidate: REVALIDATE_SECONDS,
          },
        }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text();
}

function uniqueArticles(items) {
  const seen = new Set();
  const articles = [];

  for (const item of items) {
    if (!item?.link || seen.has(item.link)) {
      continue;
    }

    seen.add(item.link);
    articles.push(item);
  }

  return articles;
}

function interleaveArticleBatches(batches) {
  const merged = [];
  const maxLength = Math.max(0, ...batches.map((batch) => batch.length));

  for (let index = 0; index < maxLength; index += 1) {
    for (const batch of batches) {
      if (batch[index]) {
        merged.push(batch[index]);
      }
    }
  }

  return merged;
}

async function getPuthiyaThalaimuraiArticles(fresh = false) {
  const html = await fetchHtml(PUTHIYA_TALAIMURAI_TOPIC_URL, { fresh });
  const regex =
    /"headline":"([^"]+)"[\s\S]{0,800}?"published-at":(\d{10,13})[\s\S]{0,800}?"url":"([^"]+)"/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const title = decodeEscapedText(match[1]);
    const link = decodeEscapedText(match[3]);

    if (!isUsefulTitle(title) || !link.startsWith("https://www.puthiyathalaimurai.com/")) {
      continue;
    }

    if (!isElectionRelatedArticle({ title, link })) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "Puthiya Thalaimurai",
      publishedAt: normalizeTimestamp(match[2]),
      description: "Regional Tamil Nadu election coverage and newsroom updates.",
      link,
    });

    if (articles.length === 10) {
      break;
    }
  }

  return articles;
}

async function getNews18NationalArticles(fresh = false) {
  const xml = await fetchHtml(NEWS18_NATIONAL_POLITICS_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /election|poll|vote|counting|exit poll|constituency|assembly|bjp|congress|tmc|dmk|aiadmk|ldf|udf|stalin|mamata|vijay|kerala|tamil nadu|west bengal|assam/i.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 10)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "News18",
      description: article.description || "National election headlines and political coverage from News18.",
    }));
}

async function getNdtvNationalArticles(fresh = false) {
  const xml = await fetchHtml(NDTV_TOP_STORIES_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /election|poll|vote|counting|exit poll|constituency|assembly|bjp|congress|tmc|dmk|aiadmk|ldf|udf|stalin|mamata|vijay|kerala|tamil nadu|west bengal|assam/i.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 10)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "NDTV",
      description: article.description || "National election headlines and political coverage from NDTV.",
    }));
}

async function getIndiaTodayNationalArticles(fresh = false) {
  const xml = await fetchHtml(INDIA_TODAY_HOME_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /\/elections?\//i.test(article.link) ||
      /election|poll|vote|counting|exit poll|constituency|assembly|bjp|congress|tmc|dmk|aiadmk|ldf|udf|stalin|mamata|vijay|kerala|tamil nadu|west bengal|assam/i.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 10)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "India Today",
      description: article.description || "National election headlines and political coverage from India Today.",
    }));
}

async function getThanthiTvArticles(fresh = false) {
  const html = await fetchHtml(THANTHI_TV_ELECTION_URL, { fresh });
  const regex =
    /"headline":(?:"((?:\\.|[^"\\])*)"|\["((?:\\.|[^"\\])*)"\])[\s\S]{0,900}?"published-at":(\d{10,13})[\s\S]{0,900}?"url":"([^"]+)"/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const title = decodeEscapedText(match[1] || match[2]);
    const link = decodeEscapedText(match[4]);

    if (!isUsefulTitle(title) || !link.startsWith("https://www.thanthitv.com/")) {
      continue;
    }

    if (!isElectionRelatedArticle({ title, link })) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "Thanthi TV",
      publishedAt: normalizeTimestamp(match[3]),
      description: "Tamil Nadu political coverage and election-related TV newsroom updates.",
      link,
    });

    if (articles.length === 8) {
      break;
    }
  }

  return articles;
}

async function getNews7TamilArticles(fresh = false) {
  const xml = await fetchHtml(NEWS7_TAMIL_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) => isElectionRelatedArticle(article))
    .slice(0, 6)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "News7 Tamil",
      description: article.description || "Regional Tamil headlines and rolling newsroom coverage.",
    }));
}

async function getNews18TamilArticles(fresh = false) {
  const xml = await fetchHtml(NEWS18_TAMIL_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) => isElectionRelatedArticle(article))
    .slice(0, 6)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "News18 Tamil Nadu",
      description: article.description || "Tamil Nadu election headlines and local campaign coverage.",
    }));
}

async function getPolimerArticles(fresh = false) {
  const html = await fetchHtml(POLIMER_URL, { fresh });
  const regex =
    /<a[^>]+class="gh-card-title-link"[^>]+href="(https:\/\/www\.polimernews\.com\/[^"]+)"[^>]+aria-label="([^"]+)"/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const title = decodeEscapedText(match[2]);
    const link = decodeEscapedText(match[1]);

    if (!title || title === "Sign in") {
      continue;
    }

    if (!isElectionRelatedArticle({ title, link })) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "Polimer News",
      publishedAt: null,
      description: "Tamil Nadu and district-level Tamil coverage from Polimer News.",
      link,
    });

    if (articles.length === 6) {
      break;
    }
  }

  return articles;
}

async function getDailyThanthiCoverageCards(fresh = false) {
  const html = await fetchHtml(DAILY_THANTHI_ELECTION_URL, { fresh });
  const matches = html.match(/\/(?:district|constituency)\/[a-z-]+/g) || [];
  const unique = Array.from(new Set(matches)).slice(0, 6);

  return unique.map((path) => {
    const label = path.includes("/district/") ? "District page" : "Constituency page";
    const slug = path.split("/").pop();

    return {
      id: `daily-thanthi-${path}`,
      title: `${slugToTitle(slug)} ${label}`,
      image: PLACEHOLDER_IMAGE,
      source: "Daily Thanthi Election",
      publishedAt: null,
      description: "Fast-access microsite page for district or constituency-level election coverage.",
      link: `https://election.dailythanthi.com${path}`,
    };
  });
}

async function getManoramaKeralaArticles(fresh = false) {
  const html = await fetchHtml(MANORAMA_KERALA_ELECTION_URL, { fresh });
  const regex = /title="([^"]+)"\s+href="(\/(?:kerala|special-programs)\/[^"]+)"/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const title = decodeEscapedText(match[1]);
    const path = decodeEscapedText(match[2]);
    const link = `https://www.manoramanews.com${path}`;

    if (!isUsefulTitle(title) || !/election|vote|chief minister|congress|bjp|ldf|udf|strong-room|evm|മുഖ്യമന്ത്രി|വോട്ട്|തിരഞ്ഞെടുപ്പ്|കോൺഗ്രസ്|ബിജെപി|പിണറായി|ചെന്നിത്തല|സ്ട്രോങ് റൂം|ഇവിഎം/i.test(`${title} ${link}`)) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "Manorama News",
      publishedAt: null,
      description: "Kerala regional election coverage and political stories from Manorama News.",
      link,
    });

    if (articles.length === 8) {
      break;
    }
  }

  return uniqueArticles(articles);
}

async function getAsianetKeralaArticles(fresh = false) {
  const html = await fetchHtml(ASIANET_KERALA_URL, { fresh });
  const regex = /"headline":"([^"]+)"[\s\S]{0,220}?"link":"([^"]+)"[\s\S]{0,120}?"publishedDate":(\d{10,13})/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const title = decodeEscapedText(match[1]);
    const path = decodeEscapedText(match[2]);
    const link = path.startsWith("http") ? path : `https://www.asianetnews.com${path}`;

    if (!isUsefulTitle(title) || !link.includes("/kerala-news/")) {
      continue;
    }

    if (!/election|vote|chief minister|congress|bjp|ldf|udf|strong-room|evm|മുഖ്യമന്ത്രി|വോട്ട്|തിരഞ്ഞെടുപ്പ്|കോൺഗ്രസ്|ബിജെപി|പിണറായി|ചെന്നിത്തല|സ്ട്രോങ് റൂം|ഇവിഎം|ഹർത്താൽ/i.test(`${title} ${link}`)) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "Asianet News",
      publishedAt: normalizeTimestamp(match[3]),
      description: "Kerala state political coverage and election-related stories from Asianet News.",
      link,
    });

    if (articles.length === 8) {
      break;
    }
  }

  return uniqueArticles(articles);
}

async function getOnmanoramaKeralaArticles(fresh = false) {
  const xml = await fetchHtml(ONMANORAMA_KERALA_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /election|vote|chief minister|congress|bjp|ldf|udf|evm|strong-room|pinarayi|chennithala|constituency|candidate/i.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 4)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "Onmanorama",
      description: article.description || "Kerala state coverage and regional updates from Onmanorama.",
    }));
}

async function getAbpAnandaWestBengalArticles(fresh = false) {
  const html = await fetchHtml(ABP_ANANDA_WEST_BENGAL_URL, { fresh });
  const regex =
    /<a href="(https:\/\/bengali\.abplive\.com\/(?:elections|district|news\/kolkata)\/[^"]+)" title="([^"]*)" class="(?:__hero_news|sub-news-story)">[\s\S]{0,900}?(?:<div class="__hero_news_title">([\s\S]*?)<\/div>|<div class="story-title">([\s\S]*?)<\/div>)/g;
  const articles = [];

  for (const match of html.matchAll(regex)) {
    const link = decodeEscapedText(match[1]);
    const title = stripHtml(match[3] || match[4] || match[2] || slugToTitle(link));

    if (!isUsefulTitle(title)) {
      continue;
    }

    if (!/west-bengal|bengal|election|poll|vote|campaign|constituency|মমতা|অভিষেক|বিজেপি|তৃণমূল|ভোট|নির্বাচন|প্রার্থী|বিধানসভা/u.test(`${title} ${link}`)) {
      continue;
    }

    articles.push({
      id: link,
      title,
      image: PLACEHOLDER_IMAGE,
      source: "ABP Ananda",
      publishedAt: null,
      description: "West Bengal election stories and state political coverage from ABP Ananda.",
      link,
    });

    if (articles.length === 10) {
      break;
    }
  }

  return uniqueArticles(articles);
}

async function getTv9BanglaWestBengalArticles(fresh = false) {
  const xml = await fetchHtml(TV9_BANGLA_WEST_BENGAL_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /west-bengal|bengal-election|wb-assembly-election|mamata|tmc|bjp|vote|poll|commission|constituency|বিজেপি|তৃণমূল|মমতা|ভোট|নির্বাচন|বিধানসভা|প্রার্থী/u.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 8)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "TV9 Bangla",
      description: article.description || "West Bengal campaign, constituency, and voting updates from TV9 Bangla.",
    }));
}

async function getNews18BanglaArticles(fresh = false) {
  const xml = await fetchHtml(NEWS18_BANGLA_RSS_URL, { fresh });

  return parseRssItems(xml)
    .filter((article) =>
      /west-bengal|bengal-election|assembly-election|mamata|tmc|bjp|cpim|isf|vote|poll|campaign|constituency|বিজেপি|তৃণমূল|মমতা|ভোট|নির্বাচন|বিধানসভা|প্রার্থী/u.test(
        `${article.title} ${article.description} ${article.link}`,
      ),
    )
    .slice(0, 8)
    .map((article) => ({
      ...article,
      image: PLACEHOLDER_IMAGE,
      source: "News18 Bangla",
      description: article.description || "West Bengal election headlines and regional campaign coverage from News18 Bangla.",
    }));
}

export async function getTamilNaduRegionalArticles(options = {}) {
  try {
    const settled = await Promise.allSettled([
      getPuthiyaThalaimuraiArticles(options.fresh),
      getThanthiTvArticles(options.fresh),
      getNews18TamilArticles(options.fresh),
      getDailyThanthiCoverageCards(options.fresh),
      getNews7TamilArticles(options.fresh),
      getPolimerArticles(options.fresh),
    ]);

    const batches = settled.map((result) => (result.status === "fulfilled" ? result.value : []));
    const liveArticles = rankRegionalArticles(uniqueArticles(interleaveArticleBatches(batches)));
    const freshLiveArticles = pickFreshRegionalArticles(liveArticles, options.fresh).slice(0, 20);
    const articles = options.fresh
      ? freshLiveArticles
      : uniqueArticles([...freshLiveArticles, ...REGIONAL_COVERAGE_CARDS]).slice(0, 24);

    return {
      articles,
      error: articles.length
        ? null
        : options.fresh
          ? "No recent Tamil Nadu headlines are available right now."
          : "Data unavailable",
      source: "Regional Tamil Nadu sources",
    };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Data unavailable",
      source: "Regional Tamil Nadu sources",
    };
  }
}

export async function getNationalRegionalArticles(options = {}) {
  try {
    const settled = await Promise.allSettled([
      getNews18NationalArticles(options.fresh),
      getNdtvNationalArticles(options.fresh),
      getIndiaTodayNationalArticles(options.fresh),
    ]);

    const batches = settled.map((result) => (result.status === "fulfilled" ? result.value : []));
    const liveArticles = rankNationalArticles(uniqueArticles(interleaveArticleBatches(batches)));
    const freshLiveArticles = pickFreshRegionalArticles(liveArticles, options.fresh).slice(0, 16);

    return {
      articles: freshLiveArticles,
      error: freshLiveArticles.length ? null : "No recent national headlines are available right now.",
      source: "National newsroom sources",
    };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Data unavailable",
      source: "National newsroom sources",
    };
  }
}

export async function getKeralaRegionalArticles(options = {}) {
  try {
    const settled = await Promise.allSettled([
      getManoramaKeralaArticles(options.fresh),
      getAsianetKeralaArticles(options.fresh),
      getOnmanoramaKeralaArticles(options.fresh),
    ]);

    const batches = settled.map((result) => (result.status === "fulfilled" ? result.value : []));
    const liveArticles = rankKeralaRegionalArticles(uniqueArticles(interleaveArticleBatches(batches)));
    const freshLiveArticles = pickFreshRegionalArticles(liveArticles, options.fresh).slice(0, 14);
    const articles = options.fresh
      ? freshLiveArticles
      : uniqueArticles([...freshLiveArticles, ...KERALA_COVERAGE_CARDS]).slice(0, 16);

    return {
      articles,
      error: articles.length
        ? null
        : options.fresh
          ? "No recent Kerala headlines are available right now."
          : "Data unavailable",
      source: "Regional Kerala sources",
    };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Data unavailable",
      source: "Regional Kerala sources",
    };
  }
}

export async function getWestBengalRegionalArticles(options = {}) {
  try {
    const settled = await Promise.allSettled([
      getAbpAnandaWestBengalArticles(options.fresh),
      getTv9BanglaWestBengalArticles(options.fresh),
      getNews18BanglaArticles(options.fresh),
    ]);

    const batches = settled.map((result) => (result.status === "fulfilled" ? result.value : []));
    const liveArticles = rankWestBengalRegionalArticles(uniqueArticles(interleaveArticleBatches(batches)));
    const freshLiveArticles = pickFreshRegionalArticles(liveArticles, options.fresh).slice(0, 14);
    const articles = options.fresh
      ? freshLiveArticles
      : uniqueArticles([...freshLiveArticles, ...WEST_BENGAL_COVERAGE_CARDS]).slice(0, 16);

    return {
      articles,
      error: articles.length
        ? null
        : options.fresh
          ? "No recent West Bengal headlines are available right now."
          : "Data unavailable",
      source: "Regional West Bengal sources",
    };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Data unavailable",
      source: "Regional West Bengal sources",
    };
  }
}

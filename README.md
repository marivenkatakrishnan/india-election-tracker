# Election Tracker

A full-stack election tracker built with Next.js App Router and Tailwind CSS. The app uses no database, fetches live election data from external services, and can pull structured news from GNews while keeping curated X newsroom references as a fallback.

## Features

- Home page with region tabs so you can switch between National, Tamil Nadu, Kerala, and West Bengal
- Dedicated News page with separate regional tabs and source grids
- Election dashboard with region tabs, constituency search, party filter, result table, and chart
- Next.js API proxy routes at `/api/news` and `/api/elections`
- Server-side fetching with 60-second revalidation
- Graceful fallback UI when upstream APIs fail
- Responsive Tailwind layout for mobile and desktop
- Vercel-friendly deployment with no database

## Data sources

- News: GNews search endpoint for National, Tamil Nadu, Kerala, and West Bengal headlines when configured
- News fallback: curated source lists and X newsroom references for each region
- Election results: public India election JSON feeds, with separate optional URLs for each region

## Project structure

```text
election-tracker/
├── app/
│   ├── api/
│   │   ├── elections/route.js
│   │   └── news/route.js
│   ├── dashboard/
│   │   ├── loading.js
│   │   └── page.js
│   ├── news/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   ├── loading.js
│   └── page.js
├── components/
│   ├── dashboard/
│   │   ├── election-chart.js
│   │   └── election-dashboard.js
│   ├── home/
│   │   └── news-grid.js
│   ├── news/
│   │   ├── news-hub.js
│   │   └── source-grid.js
│   ├── social/
│   │   └── x-feed-grid.js
│   └── ui/
│       ├── app-header.js
│       ├── error-state.js
│       └── loading-skeleton.js
├── lib/
│   ├── constants.js
│   ├── elections.js
│   ├── format.js
│   ├── http.js
│   ├── news-snapshot.js
│   ├── news.js
│   ├── regions.js
│   └── social-feeds.js
├── .env.local.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

## Environment variables

Copy `.env.local.example` to `.env.local` and add your values:

```bash
cp .env.local.example .env.local
```

```env
GNEWS_API_KEY=your_gnews_api_key_here
GNEWS_QUERY=(election OR vote OR poll OR constituency) AND India
GNEWS_QUERY_TAMIL_NADU=(election OR vote OR poll OR constituency OR alliance OR counting) AND ("Tamil Nadu" OR Chennai OR DMK OR AIADMK OR TVK)
GNEWS_QUERY_KERALA=(election OR vote OR poll OR constituency OR alliance OR counting) AND ("Kerala" OR Thiruvananthapuram OR Kochi OR CPM OR UDF OR LDF)
GNEWS_QUERY_WEST_BENGAL=(election OR vote OR poll OR constituency OR alliance OR counting) AND ("West Bengal" OR Kolkata OR TMC OR BJP Bengal)
DEFAULT_REGION_ID=national
ELECTION_API_URL=https://raw.githubusercontent.com/thecont1/india-votes-data/main/results/2025Assembly-DL.json
ELECTION_API_URL_NATIONAL=https://raw.githubusercontent.com/thecont1/india-votes-data/main/results/2025Assembly-DL.json
ELECTION_API_URL_TAMIL_NADU=
ELECTION_API_URL_KERALA=
ELECTION_API_URL_WEST_BENGAL=
NEWS_FEED_HANDLES=ANI|ANI|Wire,ndtv|NDTV|National TV,TimesNow|Times Now|National TV,CNNnews18|CNN-News18|National TV,republic|Republic|National TV,DDNewslive|DD News|Public Broadcaster,IndiaToday|India Today|National TV,aajtak|Aaj Tak|Hindi National,ABPNews|ABP News|Hindi National,sunnewstamil|Sun News|Tamil Nadu,PttvNewsX|Puthiya Thalaimurai|Tamil Nadu,News18TamilNadu|News18 Tamil Nadu|Tamil Nadu,news7tamil|News7 Tamil|Tamil Nadu,ThanthiTV|Thanthi TV|Tamil Nadu,polimernews|Polimer News|Tamil Nadu
```

Notes:

- `GNEWS_API_KEY` is optional. If set, the home page and `/api/news` return structured election headlines.
- `GNEWS_QUERY` is the default National query, and the region-specific `GNEWS_QUERY_*` values are optional overrides for Tamil Nadu, Kerala, and West Bengal.
- `DEFAULT_REGION_ID` lets you choose which region opens first.
- `ELECTION_API_URL` and `ELECTION_API_URL_NATIONAL` can point the National tab at a live result JSON file.
- `ELECTION_API_URL_TAMIL_NADU`, `ELECTION_API_URL_KERALA`, and `ELECTION_API_URL_WEST_BENGAL` are optional. If they are blank, the app still shows regional news and sources, but the results section for that state will show a graceful unavailable message.
- `NEWS_FEED_HANDLES` is optional. If omitted, the app falls back to the built-in newsroom list.
- The built-in list now includes National, Tamil Nadu, Kerala, and West Bengal newsroom references.
- Each feed entry uses the format `handle|Label|Category` or `handle|Label|Category|Region`.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the root directory to `election-tracker`.
4. Add the same environment variables from `.env.local` if you want to override regional election feeds, regional GNews queries, or the newsroom list.
5. Deploy.

## How the app works

- Server components call shared fetch utilities in `lib/news.js`, `lib/social-feeds.js`, and `lib/elections.js`, while `lib/regions.js` keeps the regional tabs and defaults in one place.
- Those same utilities power `/api/news` and `/api/elections`, so the normalization logic stays in one place.
- The election feed and structured headline feed are cached with `revalidate: 60` and API routes also send cache headers.
- If a regional headline feed or regional result feed is unavailable, the app falls back to source grids and newsroom references instead of breaking the page.

## Free-service notes

- The app uses a free public election feed by default.
- GNews can be added with a free API key for structured headlines.
- The newsroom reference layer uses official X embeds, so local and Vercel deployments can still stay database-free and low-cost when no news key is configured.

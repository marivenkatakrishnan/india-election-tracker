import { slugify } from "@/lib/format";
import { fetchJson, fetchText, toNumber } from "@/lib/http";
import { getRegionConfig } from "@/lib/regions";

const ECI_MIRROR_PREFIX = "https://r.jina.ai/http://";

function resolveAlliance(party, stateName = "") {
  const value = `${party || ""} ${stateName || ""}`.toLowerCase();

  if (
    /bharatiya janata party|bjp|jna|bdjs|shiv sena|ljp|admk|aiadmk|all india anna dravida munnetra kazhagam/.test(
      value,
    )
  ) {
    return "NDA";
  }

  if (
    /communist party of india \(marxist\)|cpi\(m\)|communist party of india|cpi|ldf|kerala congress \(m\)|revolutionary socialist party|rsp|ncp/.test(
      value,
    ) &&
    /kerala/.test(value)
  ) {
    return "LDF";
  }

  if (
    /indian national congress|congress|indian union muslim league|iuml|udf|kerala congress|revolutionary socialist party|rsp/.test(
      value,
    ) &&
    /kerala/.test(value)
  ) {
    return "UDF";
  }

  if (/all india trinamool congress|trinamool|tmc/.test(value)) {
    return "TMC alliance";
  }

  if (
    /dravida munnetra kazhagam|dmk|indian national congress|congress|communist party of india|cpi|communist party of india \(marxist\)|cpi\(m\)|viduthalai chiruthaigal|vck|indian union muslim league|iuml/.test(
      value,
    )
  ) {
    return "INDIA";
  }

  if (/tamilaga vettri kazhagam|tvk/.test(value)) {
    return "TVK alliance";
  }

  if (/indian national congress|congress|communist party of india \(marxist\)|cpi\(m\)|communist party of india|cpi|isf/.test(value)) {
    return "INDIA";
  }

  return "Independent";
}

function inferWinnerLabel(rank) {
  if (rank === 1) {
    return "Winner";
  }

  if (rank === 2) {
    return "Runner-up";
  }

  return "Contesting";
}

function normalizeConstituency(constituency, meta) {
  const source = constituency.voting_data || constituency;
  const resolvedTally = Array.isArray(source.voting_tally) ? source.voting_tally : [];

  const sortedCandidates = resolvedTally
    .map((entry) => {
      const evmVotes = toNumber(entry.evm_votes);
      const postalVotes = toNumber(entry.postal_votes);

      return {
        serialNo: entry.serial_no || "",
        candidate: entry.candidate || "Unknown candidate",
        party: entry.party || "Independent / Unknown",
        evmVotes,
        postalVotes,
        votes: evmVotes + postalVotes,
      };
    })
    .sort((left, right) => right.votes - left.votes);

  const totalVotes = sortedCandidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  return sortedCandidates.map((candidate, index) => ({
    id: `${meta.stateCode}-${slugify(source.constituency)}-${candidate.serialNo || index + 1}`,
    constituency: source.constituency || "Unknown constituency",
    constituencyNumber: source.constituency_number || source.constituency_no || null,
    state: meta.stateName,
    stateCode: meta.stateCode,
    electionLabel: meta.electionLabel,
    candidate: candidate.candidate,
    party: candidate.party,
    alliance: resolveAlliance(candidate.party, meta.stateName),
    evmVotes: candidate.evmVotes,
    postalVotes: candidate.postalVotes,
    votes: candidate.votes,
    share: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0,
    margin: null,
    roundStatus: "",
    rank: index + 1,
    result: inferWinnerLabel(index + 1),
  }));
}

function buildPartyBreakdown(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const current = map.get(row.party) || {
      party: row.party,
      seatsWon: 0,
      votes: 0,
      candidateCount: 0,
    };

    current.votes += row.votes;
    current.candidateCount += 1;

    if (row.rank === 1 || row.result === "Leading" || row.result === "Winning") {
      current.seatsWon += 1;
    }

    map.set(row.party, current);
  });

  return Array.from(map.values()).sort((left, right) => {
    if (right.seatsWon !== left.seatsWon) {
      return right.seatsWon - left.seatsWon;
    }

    return right.votes - left.votes;
  });
}

function normalizeElectionPayload(payload, region) {
  const constituencies = Array.isArray(payload.constituencywise_results)
    ? payload.constituencywise_results
    : [];
  const electionYear = payload.election_year || "Live";
  const electionType = payload.election_type || "Election";
  const stateCode = payload.election_state || "IN";
  const electionLabel = `${electionYear} ${electionType} Results`;
  const stateName = payload.state_name || region.stateName || stateCode;

  const rows = constituencies.flatMap((constituency) =>
    normalizeConstituency(constituency, {
      electionLabel,
      stateCode,
      stateName,
    }),
  );

  const partyBreakdown = buildPartyBreakdown(rows);
  const winner = partyBreakdown[0] || null;

  return {
    rows,
    partyBreakdown,
    summary: {
      electionLabel,
      stateCode,
      stateName,
      constituencyCount: constituencies.length,
      candidateCount: rows.length,
      partyCount: partyBreakdown.length,
      totalVotes: rows.reduce((sum, row) => sum + row.votes, 0),
      leadingParty: winner?.party || "Unavailable",
      leadingSeats: winner?.seatsWon || 0,
      source: region.electionApiUrl,
      fetchedAt: new Date().toISOString(),
    },
  };
}

function formatAbsoluteDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " "));
}

function getTableRows(tableHtml) {
  return Array.from(tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)).map((match) => match[1]);
}

function getCells(rowHtml) {
  return Array.from(rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)).map((match) => {
    const html = match[1];
    const hrefMatch = html.match(/href="([^"]+)"/i);

    return {
      html,
      text: stripHtml(html),
      href: hrefMatch ? decodeHtml(hrefMatch[1]) : "",
    };
  });
}

function parseHtmlTables(html) {
  return Array.from(html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)).map((tableMatch) => {
    const rows = getTableRows(tableMatch[1]).map(getCells).filter((cells) => cells.length > 0);
    const headerRow = rows.find((cells) => cells.some((cell) => /<th/i.test(cell.html))) || rows[0] || [];
    const headers = headerRow.map((cell) => cell.text.toLowerCase());

    return {
      headers,
      rows,
    };
  });
}

function cleanMarkdownText(value) {
  return decodeHtml(
    String(value || "")
      .replace(/!\[[^\]]*]\([^)]+\)/g, "")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/[*_`>#]/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function parseMarkdownCell(rawCell) {
  const value = String(rawCell || "").trim();
  const linkMatch = value.match(/\[([^\]]+)\]\(([^)]+)\)/);

  return {
    html: value,
    text: cleanMarkdownText(value),
    href: linkMatch ? decodeHtml(linkMatch[2]) : "",
  };
}

function parseMarkdownTables(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const tables = [];

  for (let index = 0; index < lines.length; index += 1) {
    const headerLine = lines[index]?.trim();
    const separatorLine = lines[index + 1]?.trim();

    if (!headerLine?.startsWith("|") || !separatorLine?.startsWith("|")) {
      continue;
    }

    if (!/^(\|\s*:?-{3,}:?\s*)+\|?$/.test(separatorLine)) {
      continue;
    }

    const rowLines = [headerLine];
    index += 2;

    while (index < lines.length && lines[index].trim().startsWith("|")) {
      rowLines.push(lines[index].trim());
      index += 1;
    }

    index -= 1;

    const rows = rowLines
      .map((line) =>
        line
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map(parseMarkdownCell),
      )
      .filter((cells) => cells.length > 0);

    const headerRow = rows[0] || [];
    const headers = headerRow.map((cell) => cell.text.toLowerCase());

    tables.push({
      headers,
      rows,
    });
  }

  return tables;
}

function parseTables(content) {
  return [...parseHtmlTables(content), ...parseMarkdownTables(content)];
}

function toAbsoluteUrl(value, baseUrl) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value, baseUrl).toString();
}

function extractPartyLinks(summaryHtml, baseUrl) {
  const tables = parseTables(summaryHtml);
  const summaryTable = tables.find((table) => {
    const joinedHeaders = table.headers.join(" ");

    return joinedHeaders.includes("party") && (joinedHeaders.includes("won") || joinedHeaders.includes("leading"));
  });

  if (summaryTable) {
    const seen = new Set();
    const links = [];
    const partyIndex = summaryTable.headers.findIndex((header) => header.includes("party"));
    const wonIndex = summaryTable.headers.findIndex((header) => header.includes("won"));
    const leadingIndex = summaryTable.headers.findIndex((header) => header.includes("leading"));
    const totalIndex = summaryTable.headers.findIndex((header) => header.includes("total"));

    for (const row of summaryTable.rows) {
      const cells = row.filter((cell) => cell.text);

      if (cells.length < 2) {
        continue;
      }

      const linkCell = cells.find((cell) => /partywise(?:lead|win)result/i.test(cell.href));
      const partyName =
        (partyIndex >= 0 ? cells[partyIndex]?.text : "") ||
        cells[0]?.text ||
        "";
      const href = linkCell?.href || "";

      if (!partyName || !href || seen.has(href)) {
        continue;
      }

      seen.add(href);
      links.push({
        party: partyName,
        href: toAbsoluteUrl(href, baseUrl),
        status: /partywiseleadresult/i.test(href) ? "Winning" : "Winner",
        won: wonIndex >= 0 ? toNumber(cells[wonIndex]?.text) : 0,
        leading: leadingIndex >= 0 ? toNumber(cells[leadingIndex]?.text) : 0,
        total: totalIndex >= 0 ? toNumber(cells[totalIndex]?.text) : 0,
      });
    }

    if (links.length) {
      return links;
    }
  }

  const fallbackSeen = new Set();
  const links = [];

  for (const match of summaryHtml.matchAll(
    /<a[^>]+href="([^"]*partywise(?:lead|win)result-[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
  )) {
    const href = toAbsoluteUrl(decodeHtml(match[1]), baseUrl);
    const party = stripHtml(match[2]);

    if (!party || fallbackSeen.has(href)) {
      continue;
    }

    fallbackSeen.add(href);
    links.push({
      party,
      href,
      status: /partywiseleadresult/i.test(href) ? "Winning" : "Winner",
    });
  }

  return links;
}

function toMirrorUrl(url) {
  return `${ECI_MIRROR_PREFIX}${String(url || "").replace(/^https?:\/\//i, "")}`;
}

function buildOfficialPartyBreakdown(partyLinks, rows) {
  const voteMap = new Map();

  rows.forEach((row) => {
    const current = voteMap.get(row.party) || { votes: 0, candidateCount: 0 };
    current.votes += row.votes;
    current.candidateCount += 1;
    voteMap.set(row.party, current);
  });

  return partyLinks
    .map((partyLink) => {
      const current = voteMap.get(partyLink.party) || { votes: 0, candidateCount: 0 };

      return {
        party: partyLink.party,
        seatsWon: partyLink.total || partyLink.won + partyLink.leading || 0,
        votes: current.votes,
        candidateCount: current.candidateCount,
      };
    })
    .sort((left, right) => {
      if (right.seatsWon !== left.seatsWon) {
        return right.seatsWon - left.seatsWon;
      }

      return right.votes - left.votes;
    });
}

async function fetchOfficialResultsText(url) {
  try {
    const content = await fetchText(url);

    if (/access denied/i.test(content)) {
      return fetchText(toMirrorUrl(url));
    }

    return content;
  } catch (error) {
    if (error instanceof Error && /status 403/i.test(error.message)) {
      return fetchText(toMirrorUrl(url));
    }

    throw error;
  }
}

async function fetchPartyPagesWithLimit(partyLinks, region, limit = 3) {
  const rows = [];

  for (let index = 0; index < partyLinks.length; index += limit) {
    const batch = partyLinks.slice(index, index + limit);
    const settled = await Promise.allSettled(batch.map((partyLink) => fetchOfficialResultsText(partyLink.href)));

    settled.forEach((result, batchIndex) => {
      if (result.status !== "fulfilled") {
        return;
      }

      rows.push(...parsePartyPageRows(result.value, batch[batchIndex], region));
    });
  }

  return rows;
}

function parseConstituencyLabel(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(.*?)(?:\((\d+)\))?$/);

  return {
    constituency: (match?.[1] || text).trim(),
    constituencyNumber: match?.[2] || null,
  };
}

function extractHeadingValue(content, pattern) {
  const match = String(content || "").match(pattern);

  return match ? cleanMarkdownText(match[1]) : "";
}

function parseCandidateDetailRows(content, fallback = {}) {
  const matches = Array.from(
    String(content || "").matchAll(
      /(leading|trailing)\s*\n\s*([\d,]+)(?:\s*\([^)]+\))?\s*\n\s*#####\s+([^\n]+)\n\s*######\s+([^\n]+)/gim,
    ),
  );

  if (!matches.length) {
    return [];
  }

  const rows = matches.map((match, index) => ({
    id: `${fallback.stateCode || "ECI"}-${slugify(fallback.constituency || "constituency")}-${index + 1}`,
    constituency: fallback.constituency || "Unknown constituency",
    constituencyNumber: fallback.constituencyNumber || null,
    state: fallback.stateName || "Unknown state",
    stateCode: fallback.stateCode || "ECI",
    electionLabel: fallback.electionLabel || "Live results",
    candidate: cleanMarkdownText(match[3]),
    party: cleanMarkdownText(match[4]),
    alliance: resolveAlliance(cleanMarkdownText(match[4]), fallback.stateName),
    evmVotes: toNumber(match[2]),
    postalVotes: 0,
    votes: toNumber(match[2]),
    share: 0,
    margin: index === 0 ? null : null,
    roundStatus: "",
    rank: index + 1,
    result: index === 0 ? "Winning" : index === 1 ? "Runner-up" : "Contesting",
    detailUrl: fallback.detailUrl || "",
  }));

  const totalVotes = rows.reduce((sum, row) => sum + row.votes, 0);

  return rows.map((row) => ({
    ...row,
    share: totalVotes > 0 ? (row.votes / totalVotes) * 100 : 0,
  }));
}

function parsePartyPageRows(html, partyLink, region) {
  const tables = parseTables(html);
  const resultsTable = tables.find((table) => {
    const joinedHeaders = table.headers.join(" ");

    return (
      joinedHeaders.includes("constituency") &&
      (joinedHeaders.includes("candidate") || joinedHeaders.includes("leading")) &&
      joinedHeaders.includes("votes")
    );
  });

  if (!resultsTable) {
    return [];
  }

  const headerIndexes = {
    constituency: resultsTable.headers.findIndex((header) => header.includes("constituency")),
    constituencyNumber: resultsTable.headers.findIndex((header) => /\bno\b|\bnumber\b/.test(header)),
    candidate: resultsTable.headers.findIndex(
      (header) => header.includes("candidate") || header.includes("leading"),
    ),
    votes: resultsTable.headers.findIndex((header) => header.includes("votes")),
    margin: resultsTable.headers.findIndex((header) => header.includes("margin")),
    status: resultsTable.headers.findIndex((header) => header.includes("status")),
  };

  return resultsTable.rows
    .slice(1)
    .map((cells, index) => {
      const constituencyCellText = cells[headerIndexes.constituency]?.text || "";
      const candidate = cells[headerIndexes.candidate]?.text || "";
      const votes = toNumber(cells[headerIndexes.votes]?.text);
      const margin = headerIndexes.margin >= 0 ? toNumber(cells[headerIndexes.margin]?.text) : null;
      const roundStatus = headerIndexes.status >= 0 ? cells[headerIndexes.status]?.text || "" : "";
      const parsedConstituency = parseConstituencyLabel(constituencyCellText);
      const constituency = parsedConstituency.constituency;
      const constituencyNumber =
        headerIndexes.constituencyNumber >= 0 ? cells[headerIndexes.constituencyNumber]?.text || null : null;
      const resolvedConstituencyNumber = constituencyNumber || parsedConstituency.constituencyNumber;

      if (!constituency || !candidate || !votes) {
        return null;
      }

      return {
        id: `${region.officialStateCode || region.id}-${slugify(constituency)}-${index + 1}`,
        constituency,
        constituencyNumber: resolvedConstituencyNumber,
        state: region.stateName,
        stateCode: region.officialStateCode || region.id.toUpperCase(),
        electionLabel: `${region.label} live results`,
        candidate,
        party: partyLink.party,
        alliance: resolveAlliance(partyLink.party, region.stateName),
        evmVotes: votes,
        postalVotes: 0,
        votes,
        share: 0,
        margin,
        roundStatus,
        rank: 1,
        result: partyLink.status,
        detailUrl:
          headerIndexes.constituency >= 0
            ? toAbsoluteUrl(cells[headerIndexes.constituency]?.href || "", partyLink.href)
            : "",
      };
    })
    .filter(Boolean);
}

async function getOfficialEciResults(region) {
  const summaryHtml = await fetchOfficialResultsText(region.officialResultsUrl);

  if (/access denied/i.test(summaryHtml)) {
    throw new Error("Official results source blocked this request. Please try again from a deployed server.");
  }

  const partyLinks = extractPartyLinks(summaryHtml, region.officialResultsUrl).slice(0, 20);

  if (!partyLinks.length) {
    throw new Error("Official results page is not live yet.");
  }

  const rows = await fetchPartyPagesWithLimit(partyLinks, region);

  const uniqueRows = Array.from(new Map(rows.map((row) => [row.constituency, row])).values());
  const partyBreakdown = buildOfficialPartyBreakdown(partyLinks, uniqueRows);
  const leadingParty = partyBreakdown[0] || null;

  return {
    rows: uniqueRows,
    partyBreakdown,
    summary: {
      electionLabel: `${region.label} live results`,
      stateCode: region.officialStateCode || region.id.toUpperCase(),
      stateName: region.stateName,
      constituencyCount: uniqueRows.length,
      candidateCount: uniqueRows.length,
      partyCount: partyBreakdown.length,
      totalVotes: uniqueRows.reduce((sum, row) => sum + row.votes, 0),
      leadingParty: leadingParty?.party || "Unavailable",
      leadingSeats: leadingParty?.seatsWon || 0,
      source: region.officialResultsUrl,
      fetchedAt: new Date().toISOString(),
    },
  };
}

function buildPendingResultsResponse(region) {
  return {
    rows: [],
    partyBreakdown: [],
    summary: {
      electionLabel: `${region.label} live results`,
      stateCode: region.officialStateCode || region.id.toUpperCase(),
      stateName: region.stateName,
      constituencyCount: 0,
      candidateCount: 0,
      partyCount: 0,
      totalVotes: 0,
      leadingParty: "Unavailable",
      leadingSeats: 0,
      source: region.officialResultsUrl || region.electionApiUrl || "",
      fetchedAt: new Date().toISOString(),
    },
    error: `Official counting for ${region.label} starts on ${formatAbsoluteDate(region.countingStartsAt)}.`,
  };
}

export async function getConstituencyDetail(detailUrl, regionId) {
  const region = getRegionConfig(regionId);

  if (!detailUrl || !/^https?:\/\/results\.eci\.gov\.in\//i.test(detailUrl)) {
    throw new Error("Constituency detail page is not available yet.");
  }

  const content = await fetchOfficialResultsText(detailUrl);
  const heading = extractHeadingValue(
    content,
    /##\s+Assembly Constituency\s+\d+\s+-\s+(.+?)\s+\*\*\([^)]+\)\*\*/i,
  );
  const parsedConstituency = parseConstituencyLabel(heading);
  const rows = parseCandidateDetailRows(content, {
    constituency: parsedConstituency.constituency,
    constituencyNumber: parsedConstituency.constituencyNumber,
    stateName: region.stateName,
    stateCode: region.officialStateCode || region.id.toUpperCase(),
    electionLabel: `${region.label} live results`,
    detailUrl,
  });

  if (!rows.length) {
    throw new Error("Candidate-level results are not available for this constituency yet.");
  }

  return {
    rows,
    fetchedAt: new Date().toISOString(),
  };
}

export async function getElectionResults(regionId) {
  const region = getRegionConfig(regionId);

  if (region.electionApiUrl) {
    try {
      const payload = await fetchJson(region.electionApiUrl);
      const normalized = normalizeElectionPayload(payload, region);

      return {
        ...normalized,
        error: normalized.rows.length ? null : "Data unavailable",
      };
    } catch (error) {
      return {
        rows: [],
        partyBreakdown: [],
        summary: {
          electionLabel: `${region.label} live results`,
          stateCode: region.id.toUpperCase(),
          stateName: region.stateName,
          constituencyCount: 0,
          candidateCount: 0,
          partyCount: 0,
          totalVotes: 0,
          leadingParty: "Unavailable",
          leadingSeats: 0,
          source: region.electionApiUrl,
          fetchedAt: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : "Data unavailable",
      };
    }
  }

  const countingStartsAt = Date.parse(region.countingStartsAt || "");

  if (Number.isFinite(countingStartsAt) && Date.now() < countingStartsAt) {
    return buildPendingResultsResponse(region);
  }

  if (!region.officialResultsUrl) {
    return {
      rows: [],
      partyBreakdown: [],
      summary: {
        electionLabel: `${region.label} live results`,
        stateCode: region.id.toUpperCase(),
        stateName: region.stateName,
        constituencyCount: 0,
        candidateCount: 0,
        partyCount: 0,
        totalVotes: 0,
        leadingParty: "Unavailable",
        leadingSeats: 0,
        source: "",
        fetchedAt: new Date().toISOString(),
      },
      error: `No live election results source is configured for ${region.label} yet.`,
    };
  }

  try {
    const normalized = await getOfficialEciResults(region);

    return {
      ...normalized,
      error: normalized.rows.length ? null : "Data unavailable",
    };
  } catch (error) {
    return {
      rows: [],
      partyBreakdown: [],
      summary: {
        electionLabel: `${region.label} live results`,
        stateCode: region.officialStateCode || region.id.toUpperCase(),
        stateName: region.stateName,
        constituencyCount: 0,
        candidateCount: 0,
        partyCount: 0,
        totalVotes: 0,
        leadingParty: "Unavailable",
        leadingSeats: 0,
        source: region.officialResultsUrl,
        fetchedAt: new Date().toISOString(),
      },
      error: error instanceof Error ? error.message : "Data unavailable",
    };
  }
}

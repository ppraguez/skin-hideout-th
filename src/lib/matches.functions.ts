import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MatchStatus = "live" | "upcoming" | "done";

export type MatchTeam = {
  id: number | null;
  name: string;
  logoUrl: string | null;
  acronym: string | null;
  score?: number;
  isWinner?: boolean;
};

export type LiveMatch = {
  id: string;
  matchName: string | null;     // e.g. "Quarterfinal: NAVI vs FaZe"
  round: string | null;         // round label if exposed
  league: string;
  leagueLogo: string | null;
  serie: string | null;         // e.g. "Spring 2026"
  tournament: string | null;    // e.g. "Playoffs"
  tier: string;
  bestOf: number | null;        // number_of_games
  beginAt: string | null;       // ISO
  scheduledAt: string | null;   // ISO
  status: MatchStatus;
  teamA: MatchTeam;
  teamB: MatchTeam;
  streamUrl: string | null;
  liveViewers: number | null;   // current viewers if streaming
};

const STATUS_TO_PANDA: Record<MatchStatus, string> = {
  live: "running",
  upcoming: "upcoming",
  done: "past",
};

type PandaTeam = {
  id?: number;
  name?: string;
  acronym?: string | null;
  image_url?: string | null;
};
type PandaOpponent = { opponent?: PandaTeam | null };
type PandaResult = { team_id?: number | null; score?: number };
type PandaStream = {
  raw_url?: string;
  main?: boolean;
  official?: boolean;
  language?: string;
  viewers?: number | null;
};
type PandaMatch = {
  id: number;
  name?: string | null;
  begin_at?: string | null;
  scheduled_at?: string | null;
  status?: string;
  number_of_games?: number | null;
  match_type?: string | null;
  tournament?: { name?: string; tier?: string | null } | null;
  league?: { name?: string; image_url?: string | null } | null;
  serie?: { full_name?: string | null; name?: string | null; tier?: string | null } | null;
  opponents?: PandaOpponent[];
  results?: PandaResult[];
  winner_id?: number | null;
  streams_list?: PandaStream[];
};

function scoreFor(teamId: number | undefined, results: PandaResult[] | undefined): number | undefined {
  if (!teamId || !results) return undefined;
  const r = results.find((x) => x.team_id === teamId);
  return typeof r?.score === "number" ? r.score : undefined;
}

function mapTeam(
  opp: PandaTeam | null,
  results: PandaResult[] | undefined,
  winnerId: number | null | undefined,
): MatchTeam {
  if (!opp) {
    return { id: null, name: "TBD", logoUrl: null, acronym: null };
  }
  const id = opp.id ?? null;
  return {
    id,
    name: opp.name ?? "TBD",
    acronym: opp.acronym ?? null,
    logoUrl: opp.image_url ?? null,
    score: scoreFor(opp.id, results),
    isWinner: id !== null && winnerId === id,
  };
}

function pickStream(streams: PandaStream[] | undefined): PandaStream | null {
  if (!streams || streams.length === 0) return null;
  return (
    streams.find((s) => s.main && (s.language === "en" || !s.language)) ??
    streams.find((s) => s.official && (s.language === "en" || !s.language)) ??
    streams.find((s) => s.language === "en") ??
    streams.find((s) => s.main) ??
    streams[0]
  );
}

function mapMatch(m: PandaMatch, status: MatchStatus): LiveMatch {
  const teamA = mapTeam(m.opponents?.[0]?.opponent ?? null, m.results, m.winner_id);
  const teamB = mapTeam(m.opponents?.[1]?.opponent ?? null, m.results, m.winner_id);
  const tier = (m.tournament?.tier ?? m.serie?.tier ?? "?").toString().toUpperCase();
  const stream = pickStream(m.streams_list);

  return {
    id: String(m.id),
    matchName: m.name ?? null,
    round: m.match_type ?? null,
    league: m.league?.name ?? "—",
    leagueLogo: m.league?.image_url ?? null,
    serie: m.serie?.full_name ?? m.serie?.name ?? null,
    tournament: m.tournament?.name ?? null,
    tier,
    bestOf: m.number_of_games ?? null,
    beginAt: m.begin_at ?? null,
    scheduledAt: m.scheduled_at ?? null,
    status,
    teamA,
    teamB,
    streamUrl: stream?.raw_url ?? null,
    liveViewers: stream?.viewers ?? null,
  };
}

export const getMatches = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      status: z.enum(["live", "upcoming", "done"]),
    }).parse,
  )
  .handler(async ({ data }): Promise<{ matches: LiveMatch[]; error: string | null }> => {
    const key = process.env.PANDASCORE_API_KEY;
    if (!key) {
      return { matches: [], error: "PandaScore API key not configured" };
    }
    const slug = STATUS_TO_PANDA[data.status];
    const url = `https://api.pandascore.co/csgo/matches/${slug}?sort=${
      data.status === "done" ? "-begin_at" : "begin_at"
    }&per_page=30`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("PandaScore error", res.status, body.slice(0, 200));
        return { matches: [], error: `PandaScore ${res.status}` };
      }
      const json = (await res.json()) as PandaMatch[];
      return { matches: json.map((m) => mapMatch(m, data.status)), error: null };
    } catch (e) {
      console.error("PandaScore fetch failed", e);
      return { matches: [], error: "Failed to load matches" };
    }
  });

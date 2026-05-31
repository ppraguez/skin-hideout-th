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
  matchName: string | null;
  round: string | null;
  league: string;
  leagueLogo: string | null;
  serie: string | null;
  tournament: string | null;
  tier: string;
  bestOf: number | null;
  beginAt: string | null;
  scheduledAt: string | null;
  status: MatchStatus;
  teamA: MatchTeam;
  teamB: MatchTeam;
  streamUrl: string | null;
  liveViewers: number | null;
};

export type MatchPlayer = {
  id: number;
  teamId: number | null;
  name: string;
  fullName: string | null;
  nationality: string | null;
  role: string | null;
  imageUrl: string | null;
  age: number | null;
  // Aggregated across games (if available)
  kills?: number;
  deaths?: number;
  assists?: number;
};

export type MatchGame = {
  id: number;
  position: number;
  status: string | null;
  finished: boolean;
  winnerTeamId: number | null;
  beginAt: string | null;
  endAt: string | null;
  length: number | null; // seconds
};

export type MatchDetail = LiveMatch & {
  players: MatchPlayer[]; // both teams
  games: MatchGame[];
  // team aggregates
  teamAKills?: number;
  teamADeaths?: number;
  teamBKills?: number;
  teamBDeaths?: number;
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
type PandaPlayer = {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  name?: string;
  nationality?: string | null;
  role?: string | null;
  image_url?: string | null;
  age?: number | null;
  current_team?: { id?: number | null } | null;
};
type PandaGamePlayerStat = {
  player_id?: number;
  player?: { id?: number };
  kills?: number;
  deaths?: number;
  assists?: number;
};
type PandaGame = {
  id: number;
  position?: number;
  status?: string | null;
  finished?: boolean;
  winner?: { id?: number | null; type?: string } | null;
  begin_at?: string | null;
  end_at?: string | null;
  length?: number | null;
  players?: PandaGamePlayerStat[];
  teams?: Array<{ team?: { id?: number }; players?: PandaGamePlayerStat[] }>;
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
  players?: PandaPlayer[];
  games?: PandaGame[];
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
  if (!opp) return { id: null, name: "TBD", logoUrl: null, acronym: null };
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

function statusFromPanda(s: string | undefined): MatchStatus {
  if (s === "running") return "live";
  if (s === "finished") return "done";
  return "upcoming";
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

async function pandaFetch<T>(path: string, key: string): Promise<T> {
  const res = await fetch(`https://api.pandascore.co${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PandaScore ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export const getMatches = createServerFn({ method: "GET" })
  .inputValidator(z.object({ status: z.enum(["live", "upcoming", "done"]) }).parse)
  .handler(async ({ data }): Promise<{ matches: LiveMatch[]; error: string | null }> => {
    const key = process.env.PANDASCORE_API_KEY;
    if (!key) return { matches: [], error: "PandaScore API key not configured" };
    const slug = STATUS_TO_PANDA[data.status];
    try {
      const json = await pandaFetch<PandaMatch[]>(
        `/csgo/matches/${slug}?sort=${data.status === "done" ? "-begin_at" : "begin_at"}&per_page=30`,
        key,
      );
      return { matches: json.map((m) => mapMatch(m, data.status)), error: null };
    } catch (e) {
      console.error("PandaScore fetch failed", e);
      return { matches: [], error: e instanceof Error ? e.message : "Failed to load matches" };
    }
  });

export const getMatchDetail = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().regex(/^\d+$/) }).parse)
  .handler(async ({ data }): Promise<{ match: MatchDetail | null; error: string | null }> => {
    const key = process.env.PANDASCORE_API_KEY;
    if (!key) return { match: null, error: "PandaScore API key not configured" };
    try {
      const m = await pandaFetch<PandaMatch>(`/csgo/matches/${data.id}`, key);
      const status = statusFromPanda(m.status);
      const base = mapMatch(m, status);

      // Map players + per-player aggregated stats from games
      const statTotals = new Map<number, { k: number; d: number; a: number }>();
      const teamKills = new Map<number, number>();
      const teamDeaths = new Map<number, number>();

      const collectStat = (stat: PandaGamePlayerStat, teamId?: number) => {
        const pid = stat.player_id ?? stat.player?.id;
        if (!pid) return;
        const cur = statTotals.get(pid) ?? { k: 0, d: 0, a: 0 };
        cur.k += stat.kills ?? 0;
        cur.d += stat.deaths ?? 0;
        cur.a += stat.assists ?? 0;
        statTotals.set(pid, cur);
        if (teamId) {
          teamKills.set(teamId, (teamKills.get(teamId) ?? 0) + (stat.kills ?? 0));
          teamDeaths.set(teamId, (teamDeaths.get(teamId) ?? 0) + (stat.deaths ?? 0));
        }
      };

      for (const g of m.games ?? []) {
        if (g.teams?.length) {
          for (const t of g.teams) {
            for (const s of t.players ?? []) collectStat(s, t.team?.id);
          }
        } else if (g.players?.length) {
          for (const s of g.players) collectStat(s);
        }
      }

      const players: MatchPlayer[] = (m.players ?? []).map((p) => {
        const totals = p.id ? statTotals.get(p.id) : undefined;
        return {
          id: p.id ?? 0,
          teamId: p.current_team?.id ?? null,
          name: p.name ?? ([p.first_name, p.last_name].filter(Boolean).join(" ") || "—"),
          fullName: [p.first_name, p.last_name].filter(Boolean).join(" ") || null,
          nationality: p.nationality ?? null,
          role: p.role ?? null,
          imageUrl: p.image_url ?? null,
          age: p.age ?? null,
          kills: totals?.k,
          deaths: totals?.d,
          assists: totals?.a,
        };
      });

      const games: MatchGame[] = (m.games ?? []).map((g) => ({
        id: g.id,
        position: g.position ?? 0,
        status: g.status ?? null,
        finished: !!g.finished,
        winnerTeamId: g.winner?.id ?? null,
        beginAt: g.begin_at ?? null,
        endAt: g.end_at ?? null,
        length: g.length ?? null,
      }));

      const aId = base.teamA.id;
      const bId = base.teamB.id;
      const detail: MatchDetail = {
        ...base,
        players,
        games,
        teamAKills: aId ? teamKills.get(aId) : undefined,
        teamADeaths: aId ? teamDeaths.get(aId) : undefined,
        teamBKills: bId ? teamKills.get(bId) : undefined,
        teamBDeaths: bId ? teamDeaths.get(bId) : undefined,
      };
      return { match: detail, error: null };
    } catch (e) {
      console.error("PandaScore match detail failed", e);
      return { match: null, error: e instanceof Error ? e.message : "Failed to load match" };
    }
  });

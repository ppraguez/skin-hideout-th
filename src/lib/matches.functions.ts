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

type PandaMatchPlayerStatsRow = {
  player?: PandaPlayer & { current_team?: { id?: number | null } | null };
  team?: { id?: number | null } | null;
  stats?: {
    kills?: number; kills_total?: number;
    deaths?: number; deaths_total?: number;
    assists?: number; assists_total?: number;
  } | null;
};
type PandaMatchPlayersStatsResponse = { players?: PandaMatchPlayerStatsRow[] };

export const getMatchDetail = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().regex(/^\d+$/) }).parse)
  .handler(async ({ data }): Promise<{ match: MatchDetail | null; error: string | null }> => {
    const key = process.env.PANDASCORE_API_KEY;
    if (!key) return { match: null, error: "PandaScore API key not configured" };
    try {
      // Some PandaScore plans block GET /csgo/matches/:id but still allow the
      // list endpoint with a filter — try the direct route first, then fall back.
      let m: PandaMatch;
      try {
        m = await pandaFetch<PandaMatch>(`/csgo/matches/${data.id}`, key);
      } catch (e) {
        if (e instanceof Error && /\b403\b/.test(e.message)) {
          const list = await pandaFetch<PandaMatch[]>(
            `/csgo/matches?filter[id]=${data.id}&per_page=1`,
            key,
          );
          if (!list.length) throw e;
          m = list[0];
        } else {
          throw e;
        }
      }
      const status = statusFromPanda(m.status);
      const base = mapMatch(m, status);

      // Dedicated player-stats endpoint
      let statsRows: PandaMatchPlayerStatsRow[] = [];
      try {
        const s = await pandaFetch<PandaMatchPlayersStatsResponse | PandaMatchPlayerStatsRow[]>(
          `/csgo/matches/${data.id}/players/stats`,
          key,
        );
        statsRows = Array.isArray(s) ? s : s.players ?? [];
      } catch (e) {
        console.warn("PandaScore /players/stats failed", e);
      }

      type Row = { player: PandaPlayer; teamId: number | null; k?: number; d?: number; a?: number };
      const byId = new Map<number, Row>();

      // Seed rosters from opponents (PandaScore may hydrate team.players)
      type TeamWithPlayers = PandaTeam & { players?: PandaPlayer[] };
      for (const o of m.opponents ?? []) {
        const team = o.opponent as TeamWithPlayers | null;
        if (!team?.players) continue;
        for (const p of team.players) {
          if (!p.id) continue;
          byId.set(p.id, { player: p, teamId: team.id ?? null });
        }
      }
      for (const p of m.players ?? []) {
        if (!p.id) continue;
        if (!byId.has(p.id)) byId.set(p.id, { player: p, teamId: p.current_team?.id ?? null });
      }

      const teamKills = new Map<number, number>();
      const teamDeaths = new Map<number, number>();

      for (const row of statsRows) {
        const p = row.player;
        if (!p?.id) continue;
        const tid = row.team?.id ?? p.current_team?.id ?? null;
        const k = row.stats?.kills ?? row.stats?.kills_total;
        const d = row.stats?.deaths ?? row.stats?.deaths_total;
        const a = row.stats?.assists ?? row.stats?.assists_total;
        const existing = byId.get(p.id);
        byId.set(p.id, {
          player: { ...(existing?.player ?? {}), ...p },
          teamId: existing?.teamId ?? tid,
          k, d, a,
        });
        if (tid) {
          if (typeof k === "number") teamKills.set(tid, (teamKills.get(tid) ?? 0) + k);
          if (typeof d === "number") teamDeaths.set(tid, (teamDeaths.get(tid) ?? 0) + d);
        }
      }

      // Fallback: aggregate from per-game stats
      if (statsRows.length === 0) {
        for (const g of m.games ?? []) {
          const collect = (st: PandaGamePlayerStat, tid?: number) => {
            const pid = st.player_id ?? st.player?.id;
            if (!pid) return;
            const row = byId.get(pid) ?? { player: { id: pid }, teamId: tid ?? null };
            row.k = (row.k ?? 0) + (st.kills ?? 0);
            row.d = (row.d ?? 0) + (st.deaths ?? 0);
            row.a = (row.a ?? 0) + (st.assists ?? 0);
            if (!row.teamId && tid) row.teamId = tid;
            byId.set(pid, row);
            if (tid) {
              teamKills.set(tid, (teamKills.get(tid) ?? 0) + (st.kills ?? 0));
              teamDeaths.set(tid, (teamDeaths.get(tid) ?? 0) + (st.deaths ?? 0));
            }
          };
          if (g.teams?.length) {
            for (const t of g.teams) for (const s of t.players ?? []) collect(s, t.team?.id);
          } else if (g.players?.length) {
            for (const s of g.players) collect(s);
          }
        }
      }

      const players: MatchPlayer[] = Array.from(byId.values()).map(({ player: p, teamId, k, d, a }) => ({
        id: p.id ?? 0,
        teamId,
        name: p.name ?? ([p.first_name, p.last_name].filter(Boolean).join(" ") || "—"),
        fullName: [p.first_name, p.last_name].filter(Boolean).join(" ") || null,
        nationality: p.nationality ?? null,
        role: p.role ?? null,
        imageUrl: p.image_url ?? null,
        age: p.age ?? null,
        kills: k,
        deaths: d,
        assists: a,
      }));

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

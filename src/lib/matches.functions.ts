import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MatchStatus = "live" | "upcoming" | "done";

export type LiveMatch = {
  id: string;
  teamA: string;
  teamB: string;
  tournament: string;
  tier: string;
  beginAt: string | null; // ISO
  status: MatchStatus;
  scoreA?: number;
  scoreB?: number;
  streamUrl?: string | null;
};

const STATUS_TO_PANDA: Record<MatchStatus, string> = {
  live: "running",
  upcoming: "upcoming",
  done: "past",
};

type PandaOpponent = { opponent?: { name?: string } | null };
type PandaResult = { team_id?: number | null; score?: number };
type PandaMatch = {
  id: number;
  name?: string;
  begin_at?: string | null;
  scheduled_at?: string | null;
  status?: string;
  tournament?: { name?: string; tier?: string | null } | null;
  league?: { name?: string } | null;
  serie?: { tier?: string | null } | null;
  opponents?: PandaOpponent[];
  results?: PandaResult[];
  streams_list?: Array<{ raw_url?: string; main?: boolean; official?: boolean }>;
};

function mapMatch(m: PandaMatch, status: MatchStatus): LiveMatch {
  const teamA = m.opponents?.[0]?.opponent?.name ?? "TBD";
  const teamB = m.opponents?.[1]?.opponent?.name ?? "TBD";
  const tier = (m.tournament?.tier ?? m.serie?.tier ?? "?").toString().toUpperCase();
  const tournament = m.league?.name ?? m.tournament?.name ?? "—";
  const scoreA = m.results?.[0]?.score;
  const scoreB = m.results?.[1]?.score;
  const stream =
    m.streams_list?.find((s) => s.main || s.official)?.raw_url ??
    m.streams_list?.[0]?.raw_url ??
    null;
  return {
    id: String(m.id),
    teamA,
    teamB,
    tournament,
    tier,
    beginAt: m.begin_at ?? m.scheduled_at ?? null,
    status,
    scoreA: typeof scoreA === "number" ? scoreA : undefined,
    scoreB: typeof scoreB === "number" ? scoreB : undefined,
    streamUrl: stream,
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
    // PandaScore still uses "csgo" namespace for CS2
    const url = `https://api.pandascore.co/csgo/matches/${slug}?sort=${
      data.status === "done" ? "-begin_at" : "begin_at"
    }&per_page=30`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
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

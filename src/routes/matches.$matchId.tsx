import { createFileRoute, ErrorComponent, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getMatchDetail, type MatchPlayer, type MatchTeam } from "@/lib/matches.functions";

export const Route = createFileRoute("/matches/$matchId")({
  head: ({ params }) => ({
    meta: [
      { title: `Match ${params.matchId} — CS2Hideout` },
      { name: "description", content: "CS2 match details, rosters, and stats." },
    ],
  }),
  component: MatchDetailPage,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const detailQuery = (id: string) =>
  queryOptions({
    queryKey: ["match", id],
    queryFn: () => getMatchDetail({ data: { id } }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

function MatchDetailPage() {
  const { matchId } = Route.useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { data, isLoading, isError } = useQuery(detailQuery(matchId));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="glass-card rounded-2xl p-10 animate-pulse h-96" />
      </AppLayout>
    );
  }
  if (isError || !data?.match) {
    return (
      <AppLayout>
        <div className="glass-card rounded-2xl p-10 text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm text-muted-foreground">{data?.error ?? "Failed to load match"}</p>
          <button onClick={() => router.history.back()} className="mt-4 text-primary text-sm hover:underline">
            ← Back
          </button>
        </div>
      </AppLayout>
    );
  }

  const m = data.match;
  const aPlayers = m.players.filter((p) => p.teamId === m.teamA.id);
  const bPlayers = m.players.filter((p) => p.teamId === m.teamB.id);

  return (
    <AppLayout>
      <Link to="/matches" className="text-xs text-muted-foreground hover:text-foreground">
        ← {t("matches.title")}
      </Link>

      <div className="glass-card rounded-2xl p-6 mt-3">
        <div className="flex items-center gap-3 mb-6">
          {m.leagueLogo && <img src={m.leagueLogo} alt="" className="h-8 w-8 object-contain" />}
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{m.league}</div>
            <div className="text-xs text-muted-foreground truncate">
              {[m.serie, m.tournament, m.bestOf ? `BO${m.bestOf}` : null].filter(Boolean).join(" · ")}
            </div>
          </div>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-amber">
            {t("common.tierShort", { tier: m.tier })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <BigTeam team={m.teamA} />
          <div className="text-center">
            <div className="font-mono text-4xl font-bold">
              <span className={m.teamA.isWinner ? "text-primary" : "text-muted-foreground"}>
                {m.teamA.score ?? "—"}
              </span>
              <span className="mx-2 text-muted-foreground">:</span>
              <span className={m.teamB.isWinner ? "text-primary" : "text-muted-foreground"}>
                {m.teamB.score ?? "—"}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              {m.status === "live" ? "LIVE" : m.status === "done" ? "FINAL" : "UPCOMING"}
            </div>
          </div>
          <BigTeam team={m.teamB} />
        </div>

        {m.streamUrl && (
          <div className="mt-6 text-center">
            <a
              href={m.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-lg bg-primary/10 border border-primary/40 text-primary text-sm font-medium hover:bg-primary/20"
            >
              📺 Watch stream
            </a>
          </div>
        )}
      </div>

      {/* Rosters */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Roster team={m.teamA} players={aPlayers} totalKills={m.teamAKills} totalDeaths={m.teamADeaths} />
        <Roster team={m.teamB} players={bPlayers} totalKills={m.teamBKills} totalDeaths={m.teamBDeaths} />
      </div>

      {/* Maps */}
      {m.games.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mt-6">
          <h2 className="text-sm font-display font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Maps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {m.games.map((g) => (
              <div key={g.id} className="rounded-lg border border-border p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-muted-foreground">Map {g.position}</span>
                  <span
                    className={`uppercase tracking-wider text-[10px] ${
                      g.finished ? "text-primary" : g.status === "running" ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {g.status ?? "—"}
                  </span>
                </div>
                {g.winnerTeamId && (
                  <div className="text-xs">
                    Winner:{" "}
                    <span className="text-primary font-semibold">
                      {g.winnerTeamId === m.teamA.id ? m.teamA.name : g.winnerTeamId === m.teamB.id ? m.teamB.name : "—"}
                    </span>
                  </div>
                )}
                {g.length && <div className="text-muted-foreground mt-1">{Math.round(g.length / 60)} min</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function BigTeam({ team }: { team: MatchTeam }) {
  return (
    <div className="flex flex-col items-center gap-2 w-32">
      <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-border flex items-center justify-center overflow-hidden">
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="h-14 w-14 object-contain" />
        ) : (
          <span className="font-display font-bold">{(team.acronym ?? team.name).slice(0, 3).toUpperCase()}</span>
        )}
      </div>
      <div className={`text-sm font-semibold text-center ${team.isWinner ? "text-primary" : ""}`}>{team.name}</div>
    </div>
  );
}

function Roster({
  team,
  players,
  totalKills,
  totalDeaths,
}: {
  team: MatchTeam;
  players: MatchPlayer[];
  totalKills?: number;
  totalDeaths?: number;
}) {
  const hasStats = players.some((p) => typeof p.kills === "number");
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {team.logoUrl && <img src={team.logoUrl} alt="" className="h-6 w-6 object-contain" />}
          <span className="font-semibold text-sm">{team.name}</span>
        </div>
        {totalKills !== undefined && (
          <span className="font-mono text-xs text-muted-foreground">
            {totalKills} K / {totalDeaths ?? 0} D
          </span>
        )}
      </div>
      {players.length === 0 ? (
        <p className="text-xs text-muted-foreground">Roster unavailable</p>
      ) : (
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-surface-elevated border border-border overflow-hidden flex items-center justify-center text-[10px] flex-shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  (p.nationality ?? "??").slice(0, 2)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {[p.role, p.nationality, p.age ? `${p.age}y` : null].filter(Boolean).join(" · ") || "—"}
                </div>
              </div>
              {hasStats && (
                <div className="font-mono text-xs text-right whitespace-nowrap">
                  <span className="text-primary">{p.kills ?? 0}</span>
                  <span className="text-muted-foreground"> / {p.deaths ?? 0}</span>
                  {typeof p.assists === "number" && (
                    <span className="text-muted-foreground"> / {p.assists}</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

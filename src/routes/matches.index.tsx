import { createFileRoute, ErrorComponent, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getMatches, type LiveMatch, type MatchStatus, type MatchTeam } from "@/lib/matches.functions";

export const Route = createFileRoute("/matches/")({
  head: () => ({
    meta: [
      { title: "Match Hub — CS2Hideout" },
      { name: "description", content: "Live, upcoming, and completed CS2 matches — Bangkok time." },
      { property: "og:title", content: "CS2 Match Hub — CS2Hideout" },
      { property: "og:description", content: "Live, upcoming, and completed CS2 matches in Bangkok time." },
      { property: "og:url", content: "/matches" },
    ],
    links: [{ rel: "canonical", href: "/matches" }],
  }),
  component: Matches,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const matchesQuery = (status: MatchStatus) =>
  queryOptions({
    queryKey: ["matches", status],
    queryFn: () => getMatches({ data: { status } }),
    refetchInterval: status === "live" ? 30_000 : 120_000,
    staleTime: 15_000,
  });

function Matches() {
  const [tab, setTab] = useState<MatchStatus>("live");
  const { t } = useI18n();
  const { data, isLoading, isError } = useQuery(matchesQuery(tab));

  const tabLabel = (key: MatchStatus) => {
    if (key === "live") return t("matches.tabLive");
    if (key === "upcoming") return t("matches.tabUpcoming");
    return t("matches.tabResults");
  };

  const apiError = data?.error;
  const matches = [...(data?.matches ?? [])].sort((a, b) => {
    const ta = new Date(a.beginAt ?? a.scheduledAt ?? 0).getTime() || 0;
    const tb = new Date(b.beginAt ?? b.scheduledAt ?? 0).getTime() || 0;
    // Past results: newest first. Upcoming/live: soonest first.
    return tab === "done" ? tb - ta : ta - tb;
  });

  return (
    <AppLayout>
      <h1 className="font-display text-3xl sm:text-4xl font-bold">{t("matches.title")}</h1>
      <p className="text-sm text-muted-foreground mt-1">{t("matches.subtitle")}</p>

      <div className="mt-8 flex gap-2">
        {(["live", "upcoming", "done"] as const).map((tk) => (
          <button
            key={tk}
            onClick={() => setTab(tk)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition capitalize ${
              tab === tk ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tk === "live" && "🔴 "}{tabLabel(tk)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-56" />
          ))
        ) : isError || apiError ? (
          <div className="glass-card rounded-2xl p-10 text-center md:col-span-2 xl:col-span-3">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">{apiError ?? "Failed to load matches"}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center md:col-span-2 xl:col-span-3">
            <div className="text-3xl mb-2">📺</div>
            <p className="text-sm text-muted-foreground">{t("matches.empty")}</p>
          </div>
        ) : (
          matches.map((m) => <MatchCard key={m.id} m={m} t={t} />)
        )}
      </div>
    </AppLayout>
  );
}

const dtf = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatBangkok(iso: string | null): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "TBD";
  return dtf.format(d);
}

function countdown(iso: string | null): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (isNaN(ms) || ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `in ${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `in ${days}d ${hrs % 24}h`;
}

function formatViewers(n: number | null): string | null {
  if (!n || n <= 0) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k watching`;
  return `${n} watching`;
}

function MatchCard({ m, t }: { m: LiveMatch; t: (k: string, v?: Record<string, string | number>) => string }) {
  const cd = m.status === "upcoming" ? countdown(m.beginAt ?? m.scheduledAt) : null;
  const viewers = formatViewers(m.liveViewers);
  const navigate = useNavigate();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate({ to: "/matches/$matchId", params: { matchId: m.id } })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate({ to: "/matches/$matchId", params: { matchId: m.id } });
        }
      }}
      className="glass-card rounded-2xl p-5 hover:glow-border transition flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* League header */}
      <div className="flex items-center gap-2 mb-4">
        {m.leagueLogo ? (
          <img src={m.leagueLogo} alt="" className="h-6 w-6 object-contain rounded" loading="lazy" />
        ) : (
          <div className="h-6 w-6 rounded bg-surface-elevated" />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold truncate">{m.league}</div>
          {m.serie && <div className="text-[10px] text-muted-foreground truncate">{m.serie}</div>}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-amber whitespace-nowrap">
          {t("common.tierShort", { tier: m.tier })}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        <Team team={m.teamA} />
        <div className="flex flex-col items-center gap-1">
          {m.bestOf ? (
            <span className="text-[10px] font-mono text-muted-foreground">BO{m.bestOf}</span>
          ) : null}
          <span className="font-mono text-xs text-muted-foreground">{t("common.vs")}</span>
        </div>
        <Team team={m.teamB} align="right" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border text-xs gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-muted-foreground truncate">{formatBangkok(m.beginAt ?? m.scheduledAt)}</span>
          {cd && <span className="text-primary text-[10px] font-mono">{cd}</span>}
          {viewers && m.status === "live" && (
            <span className="text-destructive text-[10px] font-mono">{viewers}</span>
          )}
        </div>
        {m.status === "live" ? (
          m.streamUrl ? (
            <a
              href={m.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-destructive font-bold flex items-center gap-1 hover:underline whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              {t("common.live")}
            </a>
          ) : (
            <span className="text-destructive font-bold flex items-center gap-1 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              {t("common.live")}
            </span>
          )
        ) : m.streamUrl ? (
          <a href={m.streamUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-primary hover:underline whitespace-nowrap">
            {t("matches.viewMatch")}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

function Team({ team, align = "left" }: { team: MatchTeam; align?: "left" | "right" }) {
  return (
    <div className={`flex flex-col items-center gap-2 w-24 ${team.isWinner ? "" : "opacity-90"}`}>
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-border flex items-center justify-center overflow-hidden">
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="h-10 w-10 object-contain" loading="lazy" />
        ) : (
          <span className="text-xs font-display font-bold">
            {(team.acronym ?? team.name).slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <div className={`text-sm font-semibold text-center truncate w-full ${team.isWinner ? "text-primary" : ""}`}>
        {team.name}
      </div>
      {team.score !== undefined && (
        <div className={`font-mono text-lg font-bold ${team.isWinner ? "text-primary" : "text-muted-foreground"}`}>
          {team.score}
        </div>
      )}
      {align === "right" ? null : null}
    </div>
  );
}

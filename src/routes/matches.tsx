import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MATCHES } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Match Hub — CS2Hideout" }, { name: "description", content: "Live, upcoming, and completed CS2 matches — Bangkok time." }] }),
  component: Matches,
});

function Matches() {
  const [tab, setTab] = useState<"live" | "upcoming" | "done">("upcoming");
  const filtered = MATCHES.filter((m) => m.status === tab);
  const { t, formatTime } = useI18n();

  const tabLabel = (key: typeof tab) => {
    if (key === "live") return t("matches.tabLive");
    if (key === "upcoming") return t("matches.tabUpcoming");
    return t("matches.tabResults");
  };

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
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center md:col-span-2 xl:col-span-3">
            <div className="text-3xl mb-2">📺</div>
            <p className="text-sm text-muted-foreground">{t("matches.empty")}</p>
          </div>
        ) : filtered.map((m) => (
          <div key={m.id} className="glass-card rounded-2xl p-6 hover:glow-border transition">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-5">
              <span>{m.tournament}</span>
              <span className="text-amber">{t("common.tierShort", { tier: m.tier })}</span>
            </div>
            <div className="flex items-center justify-between">
              <Team name={m.teamA} score={m.scoreA} />
              <span className="font-mono text-xs text-muted-foreground">{t("common.vs")}</span>
              <Team name={m.teamB} score={m.scoreB} />
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border text-xs">
              <span className="text-muted-foreground">{formatTime(m.time)}</span>
              {m.status === "live"
                ? <span className="text-destructive font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> {t("common.live")}</span>
                : <button className="text-primary hover:underline">{t("matches.viewMatch")}</button>}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function Team({ name, score }: { name: string; score?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 w-24">
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-border flex items-center justify-center text-xs font-display font-bold">
        {name.slice(0, 3).toUpperCase()}
      </div>
      <div className="text-sm font-semibold">{name}</div>
      {score !== undefined && <div className="font-mono text-lg font-bold text-primary">{score}</div>}
    </div>
  );
}

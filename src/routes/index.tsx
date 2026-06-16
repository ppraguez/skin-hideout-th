import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import { SteamLoginButton } from "@/components/SteamLoginButton";
import { SKINS, POSTS } from "@/lib/mock-data";
import { Flame, ArrowRight, MessageCircle, Heart, Zap, CheckCircle2 } from "lucide-react";
import { TickerBar } from "@/components/TickerBar";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getMatches, type LiveMatch, type MatchTeam } from "@/lib/matches.functions";
import { useCurrentUser } from "@/hooks/use-current-user";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CS2Hideout — Hideout Marketplace for CS2 Traders" },
      { name: "description", content: "Community-first CS2 skin trading & deal discovery for Southeast Asia. Zero fees. Buy, sell, trade." },
      { property: "og:title", content: "CS2Hideout — Hideout Marketplace for CS2 Traders" },
      { property: "og:description", content: "Community-first CS2 skin trading & deal discovery for SEA. Zero fees." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CS2Hideout",
        description: "Hideout marketplace for CS2 traders.",
        url: "/",
        areaServed: ["TH", "VN", "PH", "MY", "SG", "ID", "Worldwide"],
      }),
    }],
  }),
  component: Home,
});


function Home() {
  return (
    <AppLayout>
      <Hero />
      <QuickBuyStrip />
      <HotDeals />
      <CommunityPreview />
      <MatchesPreview />
      <Footer />
    </AppLayout>
  );
}

function QuickBuyStrip() {
  const { t } = useI18n();
  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 border-l-4 border-l-primary p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-medium text-foreground/90">
              {t("quickBuy.homeStrip")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 pl-9 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" />{t("quickBuy.badgePay")}</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" />{t("quickBuy.badgeFees")}</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" />{t("quickBuy.badgeSafe")}</span>
          </div>
        </div>
        <Link
          to="/quick-buy"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition whitespace-nowrap"
        >
          {t("quickBuy.homeCta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Hero() {
  const { t } = useI18n();
  const { data: user, isPending } = useCurrentUser();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 noise-overlay px-6 sm:px-12 py-14 sm:py-20 mb-16">
      <div className="animated-mesh absolute inset-0 opacity-70" />

      <HeroDecor />

      <div className="relative max-w-2xl reveal">
        <TickerBar />

        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05]">
          {t("home.heroTitleA")} <span className="text-primary">{t("home.heroTitleHighlight")}</span><br />
          {t("home.heroTitleB")}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-lg">
          {t("home.heroSub")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link
              to="/quick-buy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-border hover:brightness-110 transition"
            >
              {t("home.ctaSell")} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <SteamLoginButton className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-border hover:brightness-110 transition">
              {t("home.ctaConnect")}
            </SteamLoginButton>
          )}
          <Link
            to="/market"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface/70 backdrop-blur font-semibold text-sm hover:border-primary/60 transition"
          >
            {t("home.ctaBrowse")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
          {[
            { v: "12,480", l: t("home.statListed") },
            { v: "3,210", l: t("home.statActive") },
            { v: "284", l: t("home.statToday") },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-mono text-xl sm:text-2xl font-bold text-foreground tabular-nums">{s.v}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroDecor() {
  const picks = [
    SKINS.find((s) => s.id === "4"),  // Karambit Fade
    SKINS.find((s) => s.id === "2"),  // AWP Asiimov
  ].filter(Boolean) as typeof SKINS;

  const layouts = [
    { x: 60,  y: 110, rot: -8, z: 10, w: 230, glow: "rgba(236, 72, 153, 0.35)" },  // Karambit Fade — magenta
    { x: 180, y: 250, rot: 6,  z: 20, w: 260, glow: "rgba(255, 140, 60, 0.40)" },  // AWP Asiimov — orange
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden md:block absolute right-2 lg:right-6 xl:right-10 top-1/2 -translate-y-1/2 w-[380px] lg:w-[440px] xl:w-[500px] h-[480px]"
    >
      <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-amber/20 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at center, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 70%)",
        }}
      />

      {picks.map((s, i) => {
        const l = layouts[i];
        return (
          <div
            key={s.id}
            className="absolute float-card glass-card rounded-2xl border border-border/70 overflow-hidden"
            style={{
              left: l.x,
              top: l.y,
              width: l.w,
              transform: `rotate(${l.rot}deg)`,
              zIndex: l.z,
              animationDelay: `${i * 0.7}s`,
              boxShadow: `0 20px 50px -20px rgba(0,0,0,0.7), 0 0 40px -10px ${l.glow}`,
            }}
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 40%, ${l.glow}, transparent 70%)` }}
              />

              {s.image && (
                <img
                  src={s.image}
                  alt=""
                  className="relative max-h-[80%] max-w-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
                  loading="lazy"
                />
              )}
              <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/40 bg-primary/15 text-primary uppercase tracking-wider">
                {s.wear}
              </span>
            </div>
            <div className="px-3 py-2 bg-surface/80 backdrop-blur">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{s.weapon}</div>
              <div className="text-xs font-semibold truncate">{s.name}</div>
            </div>

          </div>
        );
      })}
    </div>

  );
}

function HotDeals() {
  const { t } = useI18n();
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Flame className="h-6 w-6 text-amber" />
            {t("home.hotDeals")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t("home.hotDealsSub")}</p>
        </div>
        <Link to="/market" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
          {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 reveal-stagger">
        {SKINS.slice(0, 8).map((s) => <SkinCard key={s.id} skin={s} />)}
      </div>
    </section>
  );
}

function CommunityPreview() {
  const { t, formatTime } = useI18n();
  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">{t("home.fromCommunity")}</h2>
      <div className="grid md:grid-cols-3 gap-4 reveal-stagger">
        {POSTS.map((p) => (
          <Link
            to="/community"
            key={p.id}
            className="glass-card rounded-2xl p-5 hover:glow-border transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-amber/30 border border-border" />
                <div>
                  <div className="text-sm font-semibold">{p.username} {p.location}</div>
                  <div className="text-[11px] text-muted-foreground">{formatTime(p.timestamp)}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                {p.type}
              </span>
            </div>
            <p className="text-sm text-foreground/90 line-clamp-3">{p.content}</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {p.comments}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MatchesPreview() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["matches", "upcoming"],
    queryFn: () => getMatches({ data: { status: "upcoming" } }),
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });

  const matches: LiveMatch[] = (data?.matches ?? []).slice(0, 4);

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold">{t("home.upcomingMatches")}</h2>
        <Link to="/matches" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
          {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 reveal-stagger">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 h-44 animate-pulse" />
          ))
        ) : isError || matches.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center md:col-span-2 xl:col-span-4 text-sm text-muted-foreground">
            {t("matches.empty")}
          </div>
        ) : (
          matches.map((m) => (
            <div
              key={m.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate({ to: "/matches/$matchId", params: { matchId: m.id } })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate({ to: "/matches/$matchId", params: { matchId: m.id } });
                }
              }}
              className="glass-card rounded-2xl p-5 hover:glow-border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-4 gap-2">
                <span className="truncate">{m.league}</span>
                <span className="text-amber whitespace-nowrap">{t("common.tierShort", { tier: m.tier })}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <TeamBlock team={m.teamA} />
                <span className="font-mono text-xs text-muted-foreground">{t("common.vs")}</span>
                <TeamBlock team={m.teamB} />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-muted-foreground truncate">{formatBangkok(m.beginAt ?? m.scheduledAt)}</span>
                <span className="text-primary">{t("home.viewArrow")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

const previewDtf = new Intl.DateTimeFormat("en-GB", {
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
  return previewDtf.format(d);
}

function TeamBlock({ team }: { team: MatchTeam }) {
  return (
    <div className="flex flex-col items-center gap-2 w-20">
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface border border-border flex items-center justify-center overflow-hidden">
        {team.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="h-7 w-7 object-contain" loading="lazy" />
        ) : (
          <span className="text-[10px] font-display font-bold">{(team.acronym ?? team.name).slice(0, 3).toUpperCase()}</span>
        )}
      </div>
      <div className="text-xs font-semibold text-center truncate w-full">{team.name}</div>
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 pt-10 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="font-display font-bold text-lg">CS2Hideout</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {t("footer.tagline")}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a className="hover:text-primary">{t("footer.about")}</a>
          <a className="hover:text-primary">{t("footer.discord")}</a>
          <a className="hover:text-primary">{t("footer.terms")}</a>
          <a className="hover:text-primary">{t("footer.privacy")}</a>
        </div>
        <div className="flex gap-3 text-xs">
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">Discord</a>
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">X</a>
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">LINE</a>
        </div>
      </div>
      <div className="text-center text-[11px] text-muted-foreground mt-8">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}

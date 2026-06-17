import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Globe2,
  Wallet,
  Radio,
  Star,
  ChevronDown,
  Sparkles,
  Lock,
  Quote,
  KeyRound,
  Users,
} from "lucide-react";
import { SKINS, formatThb, type Skin } from "@/lib/mock-data";
import { SkinCard } from "@/components/SkinCard";
import { SteamLoginButton } from "@/components/SteamLoginButton";
import { Reveal } from "@/components/landing/Reveal";
import { CountUp } from "@/components/landing/CountUp";
import { getCurrentUser } from "@/lib/auth.functions";

export const Route = createFileRoute("/")({
  // Anonymous visitors get the marketing landing; signed-in users are sent
  // straight to their app dashboard (no flash — resolved during SSR).
  // If auth can't be determined (e.g. SESSION_SECRET unset in a preview env),
  // fall back to showing the landing rather than crashing. The redirect throw
  // must stay OUTSIDE the try/catch — TanStack signals redirects by throwing.
  beforeLoad: async () => {
    let user = null;
    try {
      user = await getCurrentUser();
    } catch {
      return;
    }
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "CS2Hideout — The Hideout for CS2 Skin Traders in SEA" },
      {
        name: "description",
        content:
          "Buy, sell and trade CS2 skins with zero fees. Trade-protected payouts, verified sellers, and the deepest skin liquidity in Southeast Asia.",
      },
      { property: "og:title", content: "CS2Hideout — The Hideout for CS2 Skin Traders" },
      { property: "og:description", content: "Zero fees. Trade-protected payouts. Built for SEA traders." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />
      <Hero />
      <Ticker />
      <Stats />
      <Trending />
      <HowItWorks />
      <TrustSecurity />
      <Features />
      <Testimonials />
      <QuickBuyBand />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ Nav */

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-amber text-primary-foreground font-display font-bold text-lg shadow-glow ring-1 ring-white/10 transition-transform group-hover:scale-105">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/25 to-white/10" />
            <span className="relative">H</span>
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            CS2<span className="text-primary">Hideout</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#trending" className="hover:text-foreground transition-colors">Market</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Why us</a>
          <Link to="/community" className="hover:text-foreground transition-colors">Community</Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/market"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-border bg-surface/60 backdrop-blur hover:border-primary/50 transition"
          >
            Browse
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition shadow-glow"
          >
            Enter app <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ----------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] flex items-center pt-24 pb-20 noise-overlay">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="animated-mesh absolute inset-0 opacity-60 glow-pulse" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 75%)",
          }}
        />
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-[-5%] h-[360px] w-[360px] rounded-full bg-amber/10 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        {/* Copy */}
        <div className="reveal max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium">
            <span className="live-dot" />
            <span className="text-muted-foreground">Live across</span>
            <span className="font-semibold">Southeast Asia &amp; Worldwide</span>
          </div>

          <h1 className="mt-6 font-display font-bold leading-[1.02] text-[clamp(2.6rem,7vw,5rem)] tracking-tight">
            Your CS2 skins,
            <br />
            <span className="text-gradient">a safer hideout.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Buy, sell and trade CS2 skins with{" "}
            <span className="text-foreground font-medium">zero fees</span>, trade-protected payouts and the
            deepest liquidity in the region. Built for SEA traders, trusted worldwide.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <SteamLoginButton className="sheen-host inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold glow-border hover:brightness-110 transition">
              <Sparkles className="h-4 w-4" /> Connect Steam
            </SteamLoginButton>
            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface/70 backdrop-blur font-semibold hover:border-primary/60 transition"
            >
              Browse the market <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Trade-protected payouts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-success" /> Zero fees
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-success" /> Verified sellers
            </span>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {[
                { i: "JK", from: "#FF6B00", to: "#FF4500" },
                { i: "AN", from: "#22c55e", to: "#0ea5e9" },
                { i: "RT", from: "#a855f7", to: "#ec4899" },
                { i: "MP", from: "#f59e0b", to: "#ef4444" },
              ].map((a) => (
                <span
                  key={a.i}
                  className="avatar-coin h-9 w-9 text-[11px]"
                  style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                  aria-hidden
                >
                  {a.i}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber" />
                ))}
                <span className="ml-1 font-semibold text-foreground tabular-nums">4.9</span>
              </div>
              <div className="text-muted-foreground">
                Trusted by <span className="text-foreground font-medium">3,200+</span> SEA traders
              </div>
            </div>
          </div>
        </div>

        {/* Floating skin showcase */}
        <HeroShowcase />
      </div>

      <a
        href="#trending"
        aria-label="Scroll to market"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-4 w-4 cue-bob" />
      </a>
    </section>
  );
}

function HeroShowcase() {
  const picks = [
    SKINS.find((s) => s.id === "4"), // Karambit Fade
    SKINS.find((s) => s.id === "2"), // AWP Asiimov
    SKINS.find((s) => s.id === "11"), // Butterfly Tiger Tooth
  ].filter(Boolean) as Skin[];

  const layouts = [
    { className: "left-0 top-6 w-[230px] rotate-[-7deg] z-20", glow: "rgba(236,72,153,0.35)", delay: "0s" },
    { className: "right-0 top-0 w-[250px] rotate-[6deg] z-30", glow: "rgba(255,140,60,0.42)", delay: "0.6s" },
    { className: "left-12 bottom-0 w-[240px] rotate-[3deg] z-10", glow: "rgba(0,200,120,0.30)", delay: "1.1s" },
  ];

  return (
    <div className="relative hidden lg:block h-[520px]">
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl spin-slow" />
      {picks.map((s, i) => {
        const l = layouts[i];
        return (
          <div
            key={s.id}
            className={`absolute float-card glass-card rounded-2xl border border-border/70 overflow-hidden ${l.className}`}
            style={{
              animationDelay: l.delay,
              boxShadow: `0 24px 60px -22px rgba(0,0,0,0.75), 0 0 48px -12px ${l.glow}`,
            }}
          >
            <div className="relative aspect-[4/3] skin-thumb flex items-center justify-center">
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${l.glow}, transparent 70%)` }} />
              {s.image && (
                <img
                  src={s.image}
                  alt={`${s.weapon} | ${s.name}`}
                  loading="lazy"
                  className="relative max-h-[82%] max-w-[86%] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
                />
              )}
              <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/40 bg-primary/15 text-primary uppercase tracking-wider">
                {s.wear}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-surface/85 backdrop-blur">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{s.weapon}</div>
                <div className="text-xs font-semibold truncate">{s.name}</div>
              </div>
              {s.priceThb && (
                <div className="font-mono text-xs font-bold text-primary whitespace-nowrap">{formatThb(s.priceThb)}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Ticker */

function Ticker() {
  const items = [
    "AK-47 | REDLINE  ฿1,240",
    "AWP | ASIIMOV ST  ฿4,890",
    "KARAMBIT | FADE FN  ฿89,000",
    "M4A1-S | PRINTSTREAM  ฿11,200",
    "BUTTERFLY | TIGER TOOTH  ฿78,500",
    "GLOCK-18 | FADE FN  ฿12,400",
    "DESERT EAGLE | BLAZE  ฿8,900",
    "M9 BAYONET | MARBLE FADE  ฿—",
  ];
  const row = [...items, ...items];
  return (
    <div className="ticker-bar ticker-mesh ticker-shimmer relative overflow-hidden border-y border-border py-3">
      <div className="marquee-track gap-10 whitespace-nowrap">
        {row.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-10 font-mono text-xs text-foreground/80">
            <span className="text-primary">◆</span>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Stats */

interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
  rating?: boolean;
}

function Stats() {
  const stats: Stat[] = [
    { to: 12480, label: "Skins listed" },
    { to: 3210, label: "Active traders" },
    { to: 284, prefix: "฿", suffix: "M+", label: "Traded volume" },
    { to: 49, label: "Avg seller rating", rating: true },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="glass-card rounded-2xl p-6 text-center">
            <div className="font-mono text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
              {s.rating ? (
                <span className="inline-flex items-center gap-1">
                  4.9<Star className="h-5 w-5 fill-amber text-amber" />
                </span>
              ) : (
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
              )}
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Trending */

function Trending() {
  const picks = ["4", "2", "11", "16", "9", "5", "22", "6"]
    .map((id) => SKINS.find((s) => s.id === id))
    .filter(Boolean) as Skin[];

  return (
    <section id="trending" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 scroll-mt-20">
      <Reveal className="flex items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Live market</span>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight">Trending in the Hideout</h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Below-market listings and rare patterns, curated from verified SEA sellers.
          </p>
        </div>
        <Link to="/market" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {picks.map((s, i) => (
          <Reveal key={s.id} delay={(i % 4) * 70}>
            <SkinCard skin={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- How it works */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Sparkles,
      title: "Connect your Steam",
      body: "Sign in with Steam in one click. Your inventory loads instantly — no manual uploads, no friction.",
    },
    {
      n: "02",
      icon: Zap,
      title: "List or Quick-Buy",
      body: "Set your price to sell or trade, or hit Quick-Buy to sell straight to us at a guaranteed rate.",
    },
    {
      n: "03",
      icon: Wallet,
      title: "Get paid, protected",
      body: "Funds are released the moment Steam's Trade Protection clears. Safe for both sides, every time.",
    },
  ];
  return (
    <section id="how" className="relative scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">How it works</span>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight">Three steps to your first trade</h2>
        </Reveal>

        <div className="relative grid md:grid-cols-3 gap-6">
          {/* connecting line */}
          <div aria-hidden className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120} className="relative glass-card rounded-2xl p-7 hover:glow-border transition">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-mono text-4xl font-bold text-foreground/10">{s.n}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Features */

function Features() {
  const feats = [
    { icon: Wallet, title: "Zero fees", body: "Keep 100% of your sale. No listing fees, no withdrawal cuts — ever." },
    { icon: ShieldCheck, title: "Trade-protected payouts", body: "Escrow-style release after Steam Trade Protection clears. No scams." },
    { icon: Globe2, title: "SEA-first liquidity", body: "Deep buyer demand across Thailand, Vietnam, the Philippines and beyond." },
    { icon: Zap, title: "Instant Quick-Buy", body: "Skip the wait — sell straight to us at a guaranteed THB price." },
    { icon: BadgeCheck, title: "Verified sellers", body: "Reputation scores and verified Steam profiles on every listing." },
    { icon: Radio, title: "Live match data", body: "Track tournaments and time your trades around the meta." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 scroll-mt-20">
      <Reveal className="max-w-2xl mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Why CS2Hideout</span>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Everything a trader needs, <span className="text-gradient">nothing they don&apos;t.</span>
        </h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {feats.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 80}>
            <div className="lift group h-full rounded-2xl glass-card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface-elevated border border-border text-primary transition-[transform,border-color] duration-300 group-hover:scale-105 group-hover:border-primary/40">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Trust & Security */

function TrustSecurity() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Steam Trade Protection",
      body: "Every trade runs through Steam's official protection window. Items and funds are held until both sides clear.",
    },
    {
      icon: Lock,
      title: "Escrow-style payouts",
      body: "Your money is held securely and released automatically the moment a trade completes — never before.",
    },
    {
      icon: BadgeCheck,
      title: "Verified sellers only",
      body: "Reputation scores, trade history and verified Steam profiles are surfaced on every single listing.",
    },
    {
      icon: KeyRound,
      title: "Encrypted & private",
      body: "Bank-grade encryption on every session. We never store your Steam password or payment credentials.",
    },
  ];
  const methods = ["PromptPay", "TrueMoney", "Bank Transfer", "Visa", "Mastercard"];

  return (
    <section className="relative scroll-mt-20 py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-success/5 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow inline-flex items-center gap-2 justify-center">
            <ShieldCheck className="h-3.5 w-3.5" /> Safety first
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Every trade, <span className="text-gradient">fully protected.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            We built CS2Hideout for traders who&apos;ve been burned before. Four layers of protection sit
            behind every transaction — so you can trade with total peace of mind.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="lift h-full rounded-2xl glass-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-success/12 border border-success/25 text-success">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12">
          <div className="divider-glow" />
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
              Cash out with
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {methods.map((m) => (
                <span
                  key={m}
                  className="rounded-lg border border-border bg-surface/60 px-3.5 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Testimonials */

function Testimonials() {
  const quotes = [
    {
      body: "Sold my Karambit Fade in under an hour and the payout hit my bank before the trade hold even cleared. This is how it should work.",
      name: "Jirayu K.",
      role: "Bangkok, Thailand",
      coin: ["#FF6B00", "#FF4500"],
    },
    {
      body: "I've been scammed on Discord trades before. The escrow here is the real deal — I finally feel safe buying high-tier knives.",
      name: "Andi N.",
      role: "Jakarta, Indonesia",
      coin: ["#22c55e", "#0ea5e9"],
    },
    {
      body: "Zero fees actually means zero. The Quick-Buy quotes are fair and the THB pricing saves me the conversion headache every time.",
      name: "Reyes T.",
      role: "Manila, Philippines",
      coin: ["#a855f7", "#ec4899"],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <Reveal className="text-center max-w-2xl mx-auto mb-14">
        <span className="eyebrow inline-flex items-center gap-2 justify-center">
          <Users className="h-3.5 w-3.5" /> Loved by traders
        </span>
        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Trusted across Southeast Asia
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5">
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={i * 100}>
            <figure className="lift h-full rounded-2xl glass-card p-7 flex flex-col">
              <Quote className="h-7 w-7 text-primary/40" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90 flex-1">
                {q.body}
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-amber">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber" />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  className="avatar-coin h-10 w-10 text-xs"
                  style={{ background: `linear-gradient(135deg, ${q.coin[0]}, ${q.coin[1]})` }}
                  aria-hidden
                >
                  {q.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{q.name}</span>
                  <span className="block text-xs text-muted-foreground">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Quick-Buy band */

function QuickBuyBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
      <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-8 sm:p-12">
        <div className="animated-mesh absolute inset-0 opacity-30" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-amber text-xs font-semibold uppercase tracking-wider">
              <Zap className="h-4 w-4" /> Instant Quick-Buy
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-4xl font-bold tracking-tight">
              Need cash fast? Sell straight to us.
            </h3>
            <p className="mt-3 text-muted-foreground">
              Get a guaranteed THB quote on your inventory in seconds. Payment released the moment Trade
              Protection expires — no haggling, no waiting for a buyer.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-success" /> Guaranteed within 7 days</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4 text-success" /> No fees</span>
            </div>
          </div>
          <Link
            to="/quick-buy"
            className="sheen-host shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border hover:brightness-110 transition"
          >
            View buy prices <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------- Final CTA */

function FinalCta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px] glow-pulse" />
      </div>
      <Reveal className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Ready to enter <span className="text-gradient">the Hideout?</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of CS2 traders buying, selling and trading with zero fees and full protection.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <SteamLoginButton className="sheen-host inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border hover:brightness-110 transition">
            <Sparkles className="h-5 w-5" /> Connect Steam — it&apos;s free
          </SteamLoginButton>
          <Link
            to="/market"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-surface/70 backdrop-blur font-semibold text-lg hover:border-primary/60 transition"
          >
            Explore the market
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------------- Footer */

function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg">H</span>
              <span className="font-display font-bold text-lg tracking-tight">
                CS2<span className="text-primary">Hideout</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              The community-first marketplace for CS2 skin traders in Southeast Asia and beyond.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-6 text-sm">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70">Marketplace</span>
              <Link to="/market" className="text-muted-foreground hover:text-foreground transition">Browse skins</Link>
              <Link to="/quick-buy" className="text-muted-foreground hover:text-foreground transition">Quick-Buy</Link>
              <Link to="/community" className="text-muted-foreground hover:text-foreground transition">Community</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/70">Connect</span>
              <a className="text-muted-foreground hover:text-foreground transition cursor-pointer">Discord</a>
              <a className="text-muted-foreground hover:text-foreground transition cursor-pointer">X / Twitter</a>
              <a className="text-muted-foreground hover:text-foreground transition cursor-pointer">LINE</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 CS2Hideout. Not affiliated with Valve Corporation.</span>
          <div className="flex gap-5">
            <a className="hover:text-foreground transition cursor-pointer">Terms</a>
            <a className="hover:text-foreground transition cursor-pointer">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import { SKINS, POSTS, MATCHES } from "@/lib/mock-data";
import { Flame, ArrowRight, MessageCircle, Heart, Radio } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CS2Hideout — The Hideout Marketplace for CS2 Traders" },
      { name: "description", content: "Community-first CS2 skin trading & deal discovery for Southeast Asia. Zero fees. Buy, sell, trade." },
      { property: "og:title", content: "CS2Hideout — The Hideout Marketplace for CS2 Traders" },
      { property: "og:description", content: "Community-first CS2 skin trading & deal discovery for SEA. Zero fees." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppLayout>
      <Hero />
      <HotDeals />
      <CommunityPreview />
      <MatchesPreview />
      <Footer />
    </AppLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 noise-overlay px-6 sm:px-12 py-14 sm:py-20 mb-16">
      <div className="animated-mesh absolute inset-0 opacity-70" />
      {/* Floating skin cards (decorative) */}
      <div className="hidden md:block absolute -right-10 top-10 w-44 rounded-xl skin-thumb aspect-[4/3] glow-border float-card opacity-90 rotate-6" />
      <div className="hidden md:block absolute right-32 bottom-6 w-36 rounded-xl skin-thumb aspect-[4/3] border border-amber/40 float-card opacity-80 -rotate-3" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary mb-6">
          <Radio className="h-3 w-3 animate-pulse" />
          Live · Southeast Asia
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05]">
          The <span className="text-primary">Hideout Marketplace</span><br />
          for CS2 Traders
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-lg">
          ซื้อ ขาย แลกเปลี่ยน — ฟรีค่าธรรมเนียม
          <span className="block text-sm mt-1 opacity-70">Buy, Sell, Trade — Zero Fees. Ever.</span>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-border hover:brightness-110 transition"
          >
            Connect Steam
          </Link>
          <Link
            to="/market"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface/70 backdrop-blur font-semibold text-sm hover:border-primary/60 transition"
          >
            Browse Skins <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
          {[
            { v: "12,480", l: "skins listed" },
            { v: "3,210", l: "active traders" },
            { v: "284", l: "deals today" },
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

function HotDeals() {
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Flame className="h-6 w-6 text-amber" />
            Hot Deals Right Now
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Below-market listings, curated daily.</p>
        </div>
        <Link to="/market" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {SKINS.slice(0, 8).map((s) => <SkinCard key={s.id} skin={s} />)}
      </div>
    </section>
  );
}

function CommunityPreview() {
  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">From the Community</h2>
      <div className="grid md:grid-cols-3 gap-4">
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
                  <div className="text-[11px] text-muted-foreground">{p.timestamp}</div>
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
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold">Upcoming CS2 Matches</h2>
        <Link to="/matches" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MATCHES.map((m) => (
          <div key={m.id} className="glass-card rounded-2xl p-5 hover:glow-border transition">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
              <span>{m.tournament}</span>
              <span className="text-amber">Tier {m.tier}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <TeamBlock name={m.teamA} />
              <span className="font-mono text-xs text-muted-foreground">VS</span>
              <TeamBlock name={m.teamB} />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
              <span className="text-muted-foreground">{m.time}</span>
              {m.status === "live"
                ? <span className="text-destructive font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> LIVE</span>
                : <Link to="/matches" className="text-primary">View →</Link>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamBlock({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface border border-border flex items-center justify-center text-[10px] font-display font-bold">
        {name.slice(0, 3).toUpperCase()}
      </div>
      <div className="text-xs font-semibold">{name}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-20 pt-10 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="font-display font-bold text-lg">CS2Hideout</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Community-built. Zero fees. Just traders helping traders find great deals across SEA.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a className="hover:text-primary">About</a>
          <a className="hover:text-primary">Discord</a>
          <a className="hover:text-primary">Terms</a>
          <a className="hover:text-primary">Privacy</a>
        </div>
        <div className="flex gap-3 text-xs">
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">Discord</a>
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">X</a>
          <a className="px-2 py-1 rounded border border-border hover:border-primary/50">LINE</a>
        </div>
      </div>
      <div className="text-center text-[11px] text-muted-foreground mt-8">
        © 2026 CS2Hideout · Not affiliated with Valve. CS2 and skin names © Valve.
      </div>
    </footer>
  );
}

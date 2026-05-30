import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import type { Skin } from "@/lib/mock-data";
import { SKINS, WEAR_COLOR, WEAR_LABEL, formatThb } from "@/lib/mock-data";
import { ExternalLink, MessageCircle, Heart, Star, Shield } from "lucide-react";

export const Route = createFileRoute("/market/$id")({
  loader: ({ params }): { skin: Skin } => {
    const skin = SKINS.find((s) => s.id === params.id);
    if (!skin) throw notFound();
    return { skin };
  },
  notFoundComponent: () => (
    <AppLayout>
      <div className="glass-card rounded-2xl p-12 text-center">
        <h2 className="font-display text-2xl font-bold">Listing not found</h2>
        <p className="text-sm text-muted-foreground mt-2">It may have been sold or removed.</p>
        <Link to="/market" className="inline-block mt-6 text-primary hover:underline">← Back to market</Link>
      </div>
    </AppLayout>
  ),
  errorComponent: ({ error }) => (
    <AppLayout>
      <div className="glass-card rounded-2xl p-12 text-center">
        <h2 className="font-display text-2xl font-bold">Something broke</h2>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </AppLayout>
  ),
  component: SkinDetail,
});

function SkinDetail() {
  const { skin } = Route.useLoaderData();
  const lt = skin.listingType;
  const similar = SKINS.filter((s) => s.id !== skin.id && s.weapon === skin.weapon).slice(0, 4);

  return (
    <AppLayout>
      <Link to="/market" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-6">
        ← Back to market
      </Link>

      <div className="grid lg:grid-cols-[40%_1fr] gap-8">
        {/* Image */}
        <div className="relative skin-thumb rounded-3xl aspect-square noise-overlay glow-border overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="font-display text-sm tracking-[0.3em] uppercase text-muted-foreground">{skin.weapon}</div>
            <div className="font-display text-5xl font-bold mt-3">{skin.name}</div>
            <div className={`mt-6 px-3 py-1 rounded-md text-xs font-mono border ${WEAR_COLOR[skin.wear]}`}>
              {WEAR_LABEL[skin.wear]}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              {skin.weapon} | {skin.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              <span className={`px-2 py-0.5 rounded border text-xs font-mono ${WEAR_COLOR[skin.wear]}`}>
                {WEAR_LABEL[skin.wear]}
              </span>
              <span className="font-mono text-xs text-muted-foreground">Float {skin.float.toFixed(4)}</span>
              {skin.stattrak && <span className="text-xs px-2 py-0.5 rounded border border-amber/40 text-amber">StatTrak™</span>}
            </div>
          </div>

          {/* Listing panel */}
          <div className="glass-card rounded-2xl p-6">
            {(lt === "sell" || lt === "both") && (
              <div className="mb-5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Price</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <div className="font-mono text-4xl font-bold tabular-nums">{formatThb(skin.priceThb!)}</div>
                  <div className="text-sm text-muted-foreground font-mono">≈ ${skin.priceUsd}</div>
                </div>
                {skin.dealScore && (
                  <div className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-success/15 border border-success/40 text-success font-semibold">
                    {skin.dealScore}% below market average
                  </div>
                )}
              </div>
            )}

            {(lt === "trade" || lt === "both") && (
              <div className="mb-5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  {lt === "both" ? "Or trade for" : "Looking to trade for"}
                </div>
                <div className="font-display text-xl font-semibold mt-1">
                  {skin.desiredItem} <span className="text-sm text-muted-foreground font-sans">({skin.desiredWear && WEAR_LABEL[skin.desiredWear]})</span>
                </div>
                {skin.notes && <p className="text-sm text-muted-foreground mt-2">"{skin.notes}"</p>}
              </div>
            )}

            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border hover:brightness-110 transition"
            >
              Send Trade Offer on Steam <ExternalLink className="h-4 w-4" />
            </a>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button className="py-2.5 rounded-xl border border-border text-sm font-medium hover:border-primary/50 inline-flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" /> Message
              </button>
              <button className="py-2.5 rounded-xl border border-border text-sm font-medium hover:border-amber/50 inline-flex items-center justify-center gap-2">
                <Heart className="h-4 w-4" /> Watchlist
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-success" />
              CS2Hideout never touches your items. Trade happens directly on Steam.
            </div>
          </div>

          {/* Seller card */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/40 to-amber/30 border border-border" />
              <div className="flex-1">
                <div className="font-semibold">{skin.seller.username} {skin.seller.location}</div>
                <div className="text-[11px] text-muted-foreground">Member since 2024 · 142 trades</div>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <Star className="h-3 w-3 fill-amber text-amber" />
                  <span className="font-semibold text-amber">{skin.seller.rep}</span>
                  <span className="text-muted-foreground">· 98% positive</span>
                </div>
              </div>
              <Link to="/profile/$username" params={{ username: skin.seller.username }} className="text-xs text-primary hover:underline">
                View profile →
              </Link>
            </div>
          </div>

          {(lt === "sell" || lt === "both") && (
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm">30-day price history</div>
                <span className="text-[10px] text-muted-foreground font-mono">THB</span>
              </div>
              <MiniChart />
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Similar listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {similar.map((s) => <SkinCard key={s.id} skin={s} />)}
          </div>
        </section>
      )}
    </AppLayout>
  );
}

function MiniChart() {
  const points = [40, 55, 45, 60, 52, 68, 64, 72, 70, 78, 74, 82, 80, 88];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${100 - (p / max) * 90}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 200)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.82 0.16 200)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.82 0.16 200)" strokeWidth="1.2" />
    </svg>
  );
}

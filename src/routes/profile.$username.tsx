import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import { SKINS } from "@/lib/mock-data";
import { Star, Crown } from "lucide-react";

export const Route = createFileRoute("/profile/$username")({
  head: () => ({ meta: [{ title: "Profile — CS2Hideout" }] }),
  component: Profile,
});

function Profile() {
  const { username } = Route.useParams();

  return (
    <AppLayout>
      <div className="relative h-44 rounded-3xl bg-gradient-to-br from-primary/30 via-surface to-amber/20 noise-overlay overflow-hidden border border-border">
        <div className="animated-mesh absolute inset-0 opacity-40" />
      </div>

      <div className="px-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-5">
        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/60 to-amber/40 border-4 border-background" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{username}</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber/40 bg-amber/10 text-amber text-[10px] font-bold">
              <Crown className="h-3 w-3" /> PREMIUM
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">🇹🇭 Bangkok · Member since 2024</div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-border text-sm">Message</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Follow</button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: "Trades", v: "142" },
          { l: "Total volume", v: "฿1.2M" },
          { l: "Positive", v: "98%" },
          { l: "Reputation", v: "4.9", icon: true },
        ].map((s) => (
          <div key={s.l} className="glass-card rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="font-mono text-2xl font-bold mt-1 flex items-center gap-1">
              {s.v}{s.icon && <Star className="h-4 w-4 fill-amber text-amber" />}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Active listings</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {SKINS.slice(0, 4).map((s) => <SkinCard key={s.id} skin={s} />)}
      </div>
    </AppLayout>
  );
}

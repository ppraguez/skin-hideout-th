import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { POSTS } from "@/lib/mock-data";
import { Heart, MessageCircle, Star } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — CS2Hideout" }, { name: "description", content: "Traders, posts, and discussions across the SEA CS2 scene." }] }),
  component: Community,
});

const tabs = ["Feed", "Trade Posts", "Find Traders", "Discussions"] as const;

const TRADERS = [
  { u: "BangkokTrader", flag: "🇹🇭", trades: 142, rep: 4.9, tags: ["Rifles", "AK"] },
  { u: "SaigonSniper", flag: "🇻🇳", trades: 88, rep: 4.7, tags: ["AWP", "High-tier"] },
  { u: "ManilaMint", flag: "🇵🇭", trades: 64, rep: 5.0, tags: ["Knives"] },
  { u: "ChiangMaiCollector", flag: "🇹🇭", trades: 230, rep: 4.95, tags: ["Knives", "Gloves"] },
  { u: "KLKnifeKing", flag: "🇲🇾", trades: 174, rep: 4.92, tags: ["Knives"] },
  { u: "JakartaJoker", flag: "🇮🇩", trades: 41, rep: 4.5, tags: ["StatTrak", "Pistols"] },
];

function Community() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Feed");

  return (
    <AppLayout>
      <h1 className="font-display text-3xl sm:text-4xl font-bold">Community</h1>
      <p className="text-sm text-muted-foreground mt-1">Where SEA traders hang out, post deals, and talk skins.</p>

      <div className="mt-8 flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Find Traders" ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRADERS.map((t) => (
            <div key={t.u} className="glass-card rounded-2xl p-5 hover:glow-border transition">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 to-amber/30 border border-border" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.u} {t.flag}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber text-amber" /> {t.rep} · {t.trades} trades
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground">{tag}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="py-2 rounded-lg border border-border text-xs font-medium hover:border-primary/50">View</button>
                <button className="py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Message</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 max-w-2xl">
          <div className="glass-card rounded-2xl p-4 mb-6">
            <textarea
              placeholder="What's on your mind, trader?"
              rows={2}
              className="w-full bg-transparent text-sm focus:outline-none resize-none"
            />
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-border">
              <div className="flex gap-2">
                {["Discussion", "WTB", "WTS", "Trade"].map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Post</button>
            </div>
          </div>

          <div className="space-y-4">
            {[...POSTS, ...POSTS].map((p, i) => (
              <article key={i} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-amber/30 border border-border" />
                    <div>
                      <div className="text-sm font-semibold">{p.username} {p.location}</div>
                      <div className="text-[11px] text-muted-foreground">{p.timestamp}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                    {p.type}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{p.content}</p>
                <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-destructive"><Heart className="h-3.5 w-3.5" /> {p.likes}</button>
                  <button className="flex items-center gap-1 hover:text-primary"><MessageCircle className="h-3.5 w-3.5" /> {p.comments}</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

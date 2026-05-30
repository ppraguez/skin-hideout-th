import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import { SKINS, type ListingType } from "@/lib/mock-data";
import { Search, Plus, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Marketplace — CS2Hideout" },
      { name: "description", content: "Browse CS2 skin listings across SEA. Sell, trade, or both. Zero fees." },
    ],
  }),
  component: MarketPage,
});

const WEARS = ["FN", "MW", "FT", "WW", "BS"] as const;
const TYPES = ["Rifle", "Pistol", "Knife", "Gloves", "SMG", "Agent"];

function MarketPage() {
  const [type, setType] = useState<"all" | ListingType>("all");
  const [q, setQ] = useState("");

  const filtered = SKINS.filter((s) =>
    (type === "all" || s.listingType === type) &&
    (q === "" || `${s.weapon} ${s.name}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} active listings · Zero fees · Trades happen directly on Steam
          </p>
        </div>
        <Link
          to="/market/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold glow-border"
        >
          <Plus className="h-4 w-4" /> Post a listing
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-6 space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Search</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="AK-47, Karambit..."
                  className="w-full bg-input/40 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <FilterGroup label="Listing type">
              {[
                { v: "all", l: "All" },
                { v: "sell", l: "💰 Sell" },
                { v: "trade", l: "🔄 Trade" },
                { v: "both", l: "💰🔄 Both" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setType(o.v as typeof type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    type === o.v ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Weapon">
              {TYPES.map((t) => (
                <button key={t} className="px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/40">
                  {t}
                </button>
              ))}
            </FilterGroup>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Wear</div>
              <div className="space-y-1.5">
                {WEARS.map((w) => (
                  <label key={w} className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground text-muted-foreground">
                    <input type="checkbox" className="accent-primary" />
                    <span className="font-mono">{w}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Price range (฿)</div>
              <input type="range" min={0} max={100000} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>฿0</span><span>฿100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs">
                <span>StatTrak™ only</span>
                <input type="checkbox" className="accent-amber" />
              </label>
              <label className="flex items-center justify-between text-xs">
                <span>Souvenir only</span>
                <input type="checkbox" className="accent-amber" />
              </label>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
            <select className="bg-input/40 border border-border rounded-lg px-3 py-2 text-xs">
              <option>Newest</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
              <option>Deal score</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-3xl mb-3">👀</div>
              <div className="font-semibold">No listings match your filters</div>
              <div className="text-sm text-muted-foreground mt-1">Try widening your search — there's always a deal somewhere.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((s) => <SkinCard key={s.id} skin={s} />)}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

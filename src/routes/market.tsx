import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkinCard } from "@/components/SkinCard";
import { SKINS, type ListingType } from "@/lib/mock-data";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Marketplace — CS2Hideout" },
      { name: "description", content: "Browse CS2 skin listings across SEA. Sell, trade, or both. Zero fees." },
      { property: "og:title", content: "CS2 Skin Marketplace — CS2Hideout" },
      { property: "og:description", content: "Browse CS2 skin listings across SEA & worldwide. Sell, trade, or both. Zero fees." },
      { property: "og:url", content: "/market" },
    ],
    links: [{ rel: "canonical", href: "/market" }],
  }),
  component: MarketPage,
});


// Wear codes and weapon types always stay English
const WEARS = ["FN", "MW", "FT", "WW", "BS"] as const;
const TYPES = ["Rifle", "Pistol", "Knife", "Gloves", "SMG", "Agent"];

function MarketPage() {
  const [type, setType] = useState<"all" | ListingType>("all");
  const [q, setQ] = useState("");
  const { t } = useI18n();

  const filtered = SKINS.filter((s) =>
    (type === "all" || s.listingType === type) &&
    (q === "" || `${s.weapon} ${s.name}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{t("market.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("market.subtitle", { count: filtered.length })}
          </p>
        </div>
        <Link
          to="/market/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold glow-border"
        >
          <Plus className="h-4 w-4" /> {t("market.postBtn")}
        </Link>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-6 space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{t("market.searchLabel")}</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("market.searchPlaceholder")}
                  className="w-full bg-input/40 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <FilterGroup label={t("market.listingType")}>
              {[
                { v: "all", l: t("market.all") },
                { v: "sell", l: t("market.sell") },
                { v: "trade", l: t("market.trade") },
                { v: "both", l: t("market.both") },
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

            <FilterGroup label={t("market.weapon")}>
              {TYPES.map((tp) => (
                <button key={tp} className="px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/40">
                  {tp}
                </button>
              ))}
            </FilterGroup>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t("market.wear")}</div>
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
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t("market.priceRange")}</div>
              <input type="range" min={0} max={100000} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>฿0</span><span>฿100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs">
                <span>{t("market.stattrakOnly")}</span>
                <input type="checkbox" className="accent-amber" />
              </label>
              <label className="flex items-center justify-between text-xs">
                <span>{t("market.souvenirOnly")}</span>
                <input type="checkbox" className="accent-amber" />
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5" /> {t("market.filters")}
            </button>
            <select className="bg-input/40 border border-border rounded-lg px-3 py-2 text-xs">
              <option>{t("market.sortNewest")}</option>
              <option>{t("market.sortPriceUp")}</option>
              <option>{t("market.sortPriceDown")}</option>
              <option>{t("market.sortDeal")}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-3xl mb-3">👀</div>
              <div className="font-semibold">{t("market.emptyTitle")}</div>
              <div className="text-sm text-muted-foreground mt-1">{t("market.emptySub")}</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 reveal-stagger">
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

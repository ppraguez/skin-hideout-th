import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, type FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  Zap,
  Search,
  Info,
  CheckCircle2,
  X,
  Shield,
  TrendingUp,
  Wallet,
  LogIn,
  PackageOpen,
} from "lucide-react";
import {
  getMyInventoryQuotes,
  submitQuickBuyOffer,
  type InventoryQuote,
} from "@/lib/quick-buy.functions";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SteamLoginButton } from "@/components/SteamLoginButton";

export const Route = createFileRoute("/quick-buy")({
  head: () => ({
    meta: [
      { title: "Quick Buy — Sell Your CS2 Skins to CS2Hideout" },
      {
        name: "description",
        content:
          "Sign in with Steam, pick items from your inventory, and we'll quote a guaranteed buy price. Payment released after Steam Trade Protection expires.",
      },
      { property: "og:title", content: "Quick Buy — CS2Hideout" },
      {
        property: "og:description",
        content:
          "Sell skins from your Steam inventory at a guaranteed price quoted by us.",
      },
      { property: "og:url", content: "/quick-buy" },
    ],
    links: [{ rel: "canonical", href: "/quick-buy" }],
  }),
  component: QuickBuyPage,
  errorComponent: ({ error }) => (
    <AppLayout>
      <div className="glass-card rounded-2xl p-12 text-center">
        <h2 className="font-display text-2xl font-bold">Something broke</h2>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </AppLayout>
  ),
});

function QuickBuyPage() {
  const { t, formatPrice } = useI18n();
  const { data: user } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [weaponFilter, setWeaponFilter] = useState<string>("all");
  const [active, setActive] = useState<InventoryQuote | null>(null);

  const inventoryQuery = useQuery({
    queryKey: ["quick-buy-inventory", user?.steamid ?? "anon"],
    queryFn: () => getMyInventoryQuotes(),
    enabled: !!user,
    staleTime: 60_000,
  });

  const items = inventoryQuery.data?.items ?? [];
  const totalQuote = useMemo(
    () => items.reduce((sum, i) => sum + i.buy_price_thb, 0),
    [items],
  );
  const weapons = useMemo(
    () => Array.from(new Set(items.map((i) => i.weapon))).sort(),
    [items],
  );

  const filtered = items.filter((i) => {
    if (weaponFilter !== "all" && i.weapon !== weaponFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !i.skin_name.toLowerCase().includes(q) &&
        !i.weapon.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-surface/60 px-6 sm:px-12 py-12 sm:py-16 mb-12">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 0% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, color-mix(in oklab, var(--amber) 20%, transparent), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="h-3.5 w-3.5" /> {t("quickBuy.heroTitle")}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
            ⚡ {t("quickBuy.heroTitle")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
            {t("quickBuy.heroSub")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <TrustBadge label={t("quickBuy.badgePay")} />
            <TrustBadge label={t("quickBuy.badgeFees")} />
            <TrustBadge label={t("quickBuy.badgeSafe")} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
          {t("quickBuy.howTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Step n={1} title={t("quickBuy.step1Title")} body={t("quickBuy.step1Body")} />
          <Step n={2} title={t("quickBuy.step2Title")} body={t("quickBuy.step2Body")} />
          <Step n={3} title={t("quickBuy.step3Title")} body={t("quickBuy.step3Body")} />
        </div>
        <div className="mt-4 flex gap-3 items-start rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{t("quickBuy.protectionInfo")}</p>
        </div>
      </section>

      {/* Inventory */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {t("quickBuy.inventoryTitle")}
            </h2>
            {user && items.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("quickBuy.inventorySub", {
                  count: items.length,
                  total: formatPrice(totalQuote),
                })}
              </p>
            )}
          </div>
          {user && items.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("quickBuy.searchPlaceholder")}
                  className="pl-9 pr-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[220px]"
                />
              </div>
              <select
                value={weaponFilter}
                onChange={(e) => setWeaponFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              >
                <option value="all">{t("quickBuy.allWeapons")}</option>
                {weapons.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!user ? (
          <SignInPrompt />
        ) : inventoryQuery.isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : inventoryQuery.isError ? (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {t("quickBuy.inventoryError")}
            <div className="text-xs mt-2 opacity-70">
              {(inventoryQuery.error as Error).message}
            </div>
          </div>
        ) : items.length === 0 ? (
          <EmptyInventory minValue={inventoryQuery.data?.minValueThb ?? 200} />
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
            {t("quickBuy.noMatches")}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 reveal-stagger">
            {filtered.map((i) => (
              <InventoryCard
                key={i.asset_id}
                item={i}
                onClick={() => setActive(i)}
                priceLabel={formatPrice(i.buy_price_thb)}
                marketLabel={formatPrice(i.market_price_thb)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
          {t("quickBuy.whyTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <WhyCard icon={<TrendingUp className="h-5 w-5" />} title={t("quickBuy.whyFairTitle")} body={t("quickBuy.whyFairBody")} />
          <WhyCard icon={<Shield className="h-5 w-5" />} title={t("quickBuy.whySafeTitle")} body={t("quickBuy.whySafeBody")} />
          <WhyCard icon={<Wallet className="h-5 w-5" />} title={t("quickBuy.whyPayTitle")} body={t("quickBuy.whyPayBody")} />
        </div>
      </section>

      {active && <SubmitPanel item={active} onClose={() => setActive(null)} />}
    </AppLayout>
  );
}

function SignInPrompt() {
  const { t } = useI18n();
  return (
    <div className="glass-card rounded-2xl p-10 text-center">
      <LogIn className="h-10 w-10 text-primary mx-auto mb-4" />
      <h3 className="font-display text-xl font-bold mb-2">
        {t("quickBuy.signInTitle")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        {t("quickBuy.signInBody")}
      </p>
      <div className="inline-flex flex-col items-center">
        <SteamLoginButton className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition cursor-pointer">
          <LogIn className="h-4 w-4" /> {t("quickBuy.signInCta")}
        </SteamLoginButton>
      </div>
    </div>
  );
}

function EmptyInventory({ minValue }: { minValue: number }) {
  const { t, formatPrice } = useI18n();
  return (
    <div className="glass-card rounded-2xl p-10 text-center">
      <PackageOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-display text-lg font-bold mb-1">
        {t("quickBuy.emptyTitle")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {t("quickBuy.emptyBody", { min: formatPrice(minValue) })}
      </p>
      <Link
        to="/market"
        className="inline-block mt-5 text-sm text-primary hover:underline"
      >
        {t("quickBuy.browseMarket")} →
      </Link>
    </div>
  );
}

function TrustBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated/80 border border-success/30 text-xs font-medium">
      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
      {label}
    </span>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="h-8 w-8 rounded-full bg-primary/15 border border-primary/40 text-primary font-display font-bold flex items-center justify-center">
          {n}
        </span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2 text-primary">{icon}</div>
      <h3 className="font-display text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function InventoryCard({
  item,
  onClick,
  priceLabel,
  marketLabel,
}: {
  item: InventoryQuote;
  onClick: () => void;
  priceLabel: string;
  marketLabel: string;
}) {
  const { t } = useI18n();
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:glow-border transition">
      <div className="skin-thumb relative aspect-[5/4] flex items-center justify-center">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.market_hash_name}
            loading="lazy"
            className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
          />
        ) : (
          <div className="text-center px-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.weapon}
            </div>
            <div className="font-display text-xl font-bold mt-1">
              {item.skin_name}
            </div>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded border border-primary/40 bg-background/70 text-primary uppercase tracking-wider">
          {item.wear}
        </span>
        {item.stattrak && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border border-amber/50 bg-background/70 text-amber">
            StatTrak™
          </span>
        )}
        {item.souvenir && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border border-amber/50 bg-background/70 text-amber">
            Souvenir
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {item.weapon}
          </div>
          <div className="font-display font-bold text-base truncate">
            {item.skin_name}
          </div>
        </div>
        {item.float_value !== null && (
          <div className="text-[11px] font-mono text-muted-foreground">
            Float: {item.float_value.toFixed(4)}
          </div>
        )}
        <div className="mt-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("quickBuy.ourBuyPrice")}
          </div>
          <div className="font-mono text-2xl font-bold text-primary tabular-nums">
            {priceLabel}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t("quickBuy.marketPct", { pct: item.market_percentage })} · {marketLabel}
          </div>
        </div>
        <button
          onClick={onClick}
          className="mt-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition"
        >
          {t("quickBuy.sellThis")}
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitPanel({
  item,
  onClose,
}: {
  item: InventoryQuote;
  onClose: () => void;
}) {
  const { t, formatPrice } = useI18n();
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      submitQuickBuyOffer({
        data: {
          asset_id: item.asset_id,
          market_hash_name: item.market_hash_name,
          wear: item.wear,
          float_value: item.float_value,
          stattrak: item.stattrak,
          quoted_price_thb: item.buy_price_thb,
          contact_method: contact,
          notes: notes || undefined,
        },
      }),
    onSuccess: () => setDone(true),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label={t("quickBuy.cancel")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-primary mb-2">
          <Zap className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {t("quickBuy.heroTitle")}
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold">
          {t("quickBuy.confirmTitle")}
        </h2>

        {/* Item summary */}
        <div className="mt-4 flex gap-3 p-3 rounded-xl border border-border bg-surface-elevated/50">
          {item.image_url && (
            <img
              src={item.image_url}
              alt=""
              className="h-16 w-16 object-contain shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.weapon} · {item.wear}
            </div>
            <div className="font-display font-bold truncate">
              {item.skin_name}
            </div>
            <div className="font-mono text-lg font-bold text-primary tabular-nums">
              {formatPrice(item.buy_price_thb)}
            </div>
          </div>
        </div>

        {done ? (
          <div className="mt-6 rounded-2xl border border-success/40 bg-success/10 p-5 text-sm">
            <CheckCircle2 className="h-6 w-6 text-success mb-2" />
            {t("quickBuy.submitSuccess")}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              {t("quickBuy.cancel")}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label={t("quickBuy.submitContact")}>
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={inputCls}
                placeholder="Steam / Discord / LINE"
              />
            </Field>
            <Field label={t("quickBuy.submitNotes")}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputCls}
              />
            </Field>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground/80">
              {t("quickBuy.protectionInfo")}
            </div>
            {mutation.isError && (
              <p className="text-sm text-destructive">
                {(mutation.error as Error).message}
              </p>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50"
            >
              {mutation.isPending
                ? t("quickBuy.submitting")
                : t("quickBuy.submitCta")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import {
  getQuickBuyListings,
  submitQuickBuyOffer,
  type QuickBuyListing,
} from "@/lib/quick-buy.functions";
import { WEAR_LABEL, type Wear } from "@/lib/mock-data";

export const Route = createFileRoute("/quick-buy")({
  head: () => ({
    meta: [
      { title: "Quick Buy — Sell Your CS2 Skins to CS2Hideout" },
      {
        name: "description",
        content:
          "Sell your CS2 skins directly to us at a guaranteed price. Payment released after Steam Trade Protection expires.",
      },
      { property: "og:title", content: "Quick Buy — CS2Hideout" },
      {
        property: "og:description",
        content:
          "Sell your CS2 skins directly to us at a guaranteed price. Payment released after Steam Trade Protection expires.",
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
  const [query, setQuery] = useState("");
  const [weaponFilter, setWeaponFilter] = useState<string>("all");
  const [active, setActive] = useState<QuickBuyListing | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["quick-buy-listings"],
    queryFn: () => getQuickBuyListings(),
    staleTime: 60_000,
  });

  const listings = data?.listings ?? [];
  const weapons = useMemo(
    () => Array.from(new Set(listings.map((l) => l.weapon))).sort(),
    [listings]
  );

  const filtered = listings.filter((l) => {
    if (weaponFilter !== "all" && l.weapon !== weaponFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !l.skin_name.toLowerCase().includes(q) &&
        !l.weapon.toLowerCase().includes(q)
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
          <Step
            n={1}
            title={t("quickBuy.step1Title")}
            body={t("quickBuy.step1Body")}
          />
          <Step
            n={2}
            title={t("quickBuy.step2Title")}
            body={t("quickBuy.step2Body")}
          />
          <Step
            n={3}
            title={t("quickBuy.step3Title")}
            body={t("quickBuy.step3Body")}
          />
        </div>
        <div className="mt-4 flex gap-3 items-start rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">
            {t("quickBuy.protectionInfo")}
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            {t("quickBuy.buyingTitle")}
          </h2>
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
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
            {t("quickBuy.emptyList")}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 reveal-stagger">
            {filtered.map((l) => (
              <BuyCard
                key={l.id}
                listing={l}
                onClick={() => setActive(l)}
                priceLabel={formatPrice(l.buy_price_thb)}
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
          <WhyCard
            icon={<TrendingUp className="h-5 w-5" />}
            title={t("quickBuy.whyFairTitle")}
            body={t("quickBuy.whyFairBody")}
          />
          <WhyCard
            icon={<Shield className="h-5 w-5" />}
            title={t("quickBuy.whySafeTitle")}
            body={t("quickBuy.whySafeBody")}
          />
          <WhyCard
            icon={<Wallet className="h-5 w-5" />}
            title={t("quickBuy.whyPayTitle")}
            body={t("quickBuy.whyPayBody")}
          />
        </div>
      </section>

      {active && (
        <SubmitPanel listing={active} onClose={() => setActive(null)} />
      )}
    </AppLayout>
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

function BuyCard({
  listing,
  onClick,
  priceLabel,
}: {
  listing: QuickBuyListing;
  onClick: () => void;
  priceLabel: string;
}) {
  const { t } = useI18n();
  const wearLabel =
    WEAR_LABEL[listing.wear as Wear] ?? listing.wear;
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:glow-border transition">
      <div className="skin-thumb relative aspect-[5/4] flex items-center justify-center">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={`${listing.weapon} | ${listing.skin_name}`}
            loading="lazy"
            className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
          />
        ) : (
          <div className="text-center px-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {listing.weapon}
            </div>
            <div className="font-display text-xl font-bold mt-1">
              {listing.skin_name}
            </div>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded border border-primary/40 bg-background/70 text-primary uppercase tracking-wider">
          {wearLabel}
        </span>
        {listing.stattrak_accepted && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border border-amber/50 bg-background/70 text-amber">
            {t("quickBuy.stattrakOk")}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {listing.weapon}
          </div>
          <div className="font-display font-bold text-base truncate">
            {listing.skin_name}
          </div>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground">
          {t("quickBuy.floatRange")}: {listing.min_float.toFixed(2)} —{" "}
          {listing.max_float.toFixed(2)}
        </div>
        <div className="mt-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("quickBuy.ourBuyPrice")}
          </div>
          <div className="font-mono text-2xl font-bold text-primary tabular-nums">
            {priceLabel}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t("quickBuy.marketPct", { pct: listing.market_percentage })}
          </div>
        </div>
        <button
          onClick={onClick}
          className="mt-2 w-full py-2.5 rounded-lg border border-primary/60 text-primary text-sm font-semibold hover:bg-primary/10 transition"
        >
          {t("quickBuy.iHaveThis")}
        </button>
      </div>
    </div>
  );
}

function SubmitPanel({
  listing,
  onClose,
}: {
  listing: QuickBuyListing;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    skin_name: `${listing.weapon} | ${listing.skin_name}`,
    wear: listing.wear as Wear,
    float_value: "",
    stattrak: false,
    inspect_link: "",
    contact_method: "",
    notes: "",
  });
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      submitQuickBuyOffer({
        data: {
          listing_id: listing.id,
          skin_name: form.skin_name,
          wear: form.wear,
          float_value: form.float_value ? Number(form.float_value) : null,
          stattrak: form.stattrak,
          inspect_link: form.inspect_link || undefined,
          contact_method: form.contact_method,
          notes: form.notes || undefined,
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
        <h2 className="font-display text-2xl font-bold mb-1">
          {t("quickBuy.submitTitle")}
        </h2>

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
            <Field label={t("quickBuy.submitSkin")}>
              <input
                required
                value={form.skin_name}
                onChange={(e) =>
                  setForm({ ...form, skin_name: e.target.value })
                }
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("quickBuy.submitWear")}>
                <select
                  value={form.wear}
                  onChange={(e) =>
                    setForm({ ...form, wear: e.target.value as Wear })
                  }
                  className={inputCls}
                >
                  {(Object.keys(WEAR_LABEL) as Wear[]).map((w) => (
                    <option key={w} value={w}>
                      {WEAR_LABEL[w]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("quickBuy.submitFloat")}>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  value={form.float_value}
                  onChange={(e) =>
                    setForm({ ...form, float_value: e.target.value })
                  }
                  className={`${inputCls} font-mono`}
                  placeholder="0.1234"
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.stattrak}
                onChange={(e) =>
                  setForm({ ...form, stattrak: e.target.checked })
                }
                className="h-4 w-4 accent-[color:var(--primary)]"
              />
              {t("quickBuy.submitStattrak")}
            </label>
            <Field label={t("quickBuy.submitInspect")}>
              <input
                type="url"
                value={form.inspect_link}
                onChange={(e) =>
                  setForm({ ...form, inspect_link: e.target.value })
                }
                placeholder="steam://rungame/..."
                className={inputCls}
              />
            </Field>
            <Field label={t("quickBuy.submitContact")}>
              <input
                required
                value={form.contact_method}
                onChange={(e) =>
                  setForm({ ...form, contact_method: e.target.value })
                }
                className={inputCls}
              />
            </Field>
            <Field label={t("quickBuy.submitNotes")}>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={inputCls}
              />
            </Field>

            {mutation.isError && (
              <p className="text-xs text-destructive">
                {t("quickBuy.submitError")}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border hover:brightness-110 transition disabled:opacity-60"
            >
              {mutation.isPending ? "..." : t("quickBuy.submitBtn")}
            </button>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("quickBuy.submitDisclaimer")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}

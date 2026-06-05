import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Crown, Check, Lock, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — CS2Hideout" },
      { name: "description", content: "Join from day one. Founding Members lock in ฿150/month forever." },
      { property: "og:title", content: "CS2Hideout Premium — Join From Day One" },
      { property: "og:description", content: "Founding Members lock in ฿150/month forever. When full Premium launches at ฿299, your price never changes." },
      { property: "og:url", content: "/premium" },
    ],
    links: [{ rel: "canonical", href: "/premium" }],
  }),
  component: Premium,
});

function Premium() {
  const { t } = useI18n();

  const features = [
    { key: "featTransactionFee", free: "2%", founder: "0%", premium: "0%" },
    { key: "featPriceHistory", free: t("premium.days30"), founder: t("premium.days90"), premium: t("premium.days90") },
    { key: "featSniperAlerts", free: false, founder: true, premium: true },
    { key: "featRealtimePrices", free: false, founder: true, premium: true },
    { key: "featFounderBadge", free: false, founder: true, premium: false },
    { key: "featPremiumBadge", free: false, founder: false, premium: true },
  ];

  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="h-4 w-4 text-success mx-auto" />;
    if (value === false) return <X className="h-4 w-4 text-muted-foreground/50 mx-auto" />;
    return <span className="text-sm tabular-nums">{value}</span>;
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber/40 bg-amber/10 text-amber text-xs font-semibold mb-6">
            <Crown className="h-3.5 w-3.5" /> {t("premium.badge")}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            {t("premium.titleA")}<br />
            <span className="text-primary">{t("premium.titleB")}</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            {t("premium.subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
          {/* Founding Member */}
          <div className="relative glass-card rounded-3xl p-8 glow-border noise-overlay overflow-hidden md:scale-105 md:-my-2 z-10">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-amber text-amber-foreground text-[10px] font-bold px-3 py-1 rounded-b-md whitespace-nowrap">
              {t("premium.founderSave")}
            </div>
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {t("premium.founderBadge")}
              </div>
            </div>

            <div className="mt-10 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tabular-nums">฿{t("premium.founderPrice")}</span>
              <span className="text-muted-foreground text-sm">{t("premium.founderPerMonth")}</span>
            </div>
            <div className="text-xs text-amber mt-1 font-medium">
              {t("premium.founderSpots")}
            </div>

            <button className="w-full mt-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border hover:opacity-90 transition-opacity cursor-pointer">
              {t("premium.founderCta")}
            </button>

            <div className="mt-5 text-center text-[11px] text-amber">
              {t("premium.founderFooter")}
            </div>
          </div>

          {/* Premium — Coming Soon */}
          <div className="relative glass-card rounded-3xl p-8 border border-border/50 overflow-hidden">
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-muted-foreground/30 bg-muted/30 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                {t("premium.premiumBadge")}
              </div>
            </div>

            <div className="mt-10 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tabular-nums text-muted-foreground">฿{t("premium.premiumPrice")}</span>
              <span className="text-muted-foreground text-sm">{t("premium.premiumPerMonth")}</span>
            </div>

            <div className="w-full mt-8 py-3 rounded-xl bg-muted/50 text-muted-foreground font-semibold border border-border/30 flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock className="h-4 w-4" />
              {t("premium.premiumCta")}
            </div>

            <div className="mt-5 text-center text-[11px] text-muted-foreground">
              {t("premium.premiumFooter")}
            </div>

            {/* Coming Soon overlay */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center z-20">
              <Lock className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-lg font-semibold text-muted-foreground">{t("premium.comingSoon")}</span>
            </div>
          </div>
        </div>

        {/* Free tier */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("premium.freeLabel")}</span> — {t("premium.freeForever")} · {t("premium.freeNoCard")}
          </p>
        </div>

        {/* Comparison — Desktop Table */}
        <div className="mt-16 hidden md:block">
          <h2 className="font-display text-2xl font-bold text-center mb-8">{t("premium.compareTitle")}</h2>
          <div className="glass-card rounded-2xl overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("premium.feature")}</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">{t("premium.freeLabel")}</th>
                  <th className="text-center p-4 font-medium text-primary">{t("premium.foundingMember")}</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">{t("premium.premiumTier")}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.key} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-foreground">{t(`premium.${f.key}`)}</td>
                    <td className="p-4 text-center">{renderCell(f.free)}</td>
                    <td className="p-4 text-center">{renderCell(f.founder)}</td>
                    <td className="p-4 text-center">{renderCell(f.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison — Mobile Cards */}
        <div className="mt-12 md:hidden space-y-4">
          <h2 className="font-display text-xl font-bold text-center mb-6">{t("premium.compareTitle")}</h2>

          {/* Free */}
          <div className="glass-card rounded-2xl p-5 border border-border/50">
            <div className="text-sm font-semibold text-muted-foreground mb-3">{t("premium.freeLabel")}</div>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(`premium.${f.key}`)}</span>
                  <span className={typeof f.free === "boolean" ? (f.free ? "text-success" : "text-muted-foreground/50") : ""}>
                    {typeof f.free === "boolean" ? (f.free ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />) : f.free}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Founding Member */}
          <div className="glass-card rounded-2xl p-5 border border-primary/30 glow-border">
            <div className="text-sm font-semibold text-primary mb-3">{t("premium.foundingMember")}</div>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(`premium.${f.key}`)}</span>
                  <span className={typeof f.founder === "boolean" ? (f.founder ? "text-success" : "text-muted-foreground/50") : ""}>
                    {typeof f.founder === "boolean" ? (f.founder ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />) : f.founder}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="relative glass-card rounded-2xl p-5 border border-border/50 overflow-hidden opacity-70">
            <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              {t("premium.premiumTier")}
              <Lock className="h-3 w-3" />
            </div>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(`premium.${f.key}`)}</span>
                  <span className={typeof f.premium === "boolean" ? (f.premium ? "text-success" : "text-muted-foreground/50") : ""}>
                    {typeof f.premium === "boolean" ? (f.premium ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />) : f.premium}
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> {t("premium.comingSoon")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

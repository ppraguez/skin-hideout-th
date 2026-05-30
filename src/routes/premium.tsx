import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Crown, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — CS2Hideout" },
      { name: "description", content: "Unlock real-time alerts, early listings, advanced filters and more." },
      { property: "og:title", content: "CS2Hideout Premium — Smarter Trading" },
      { property: "og:description", content: "Real-time alerts, early listings, advanced filters. Founders pricing." },
      { property: "og:url", content: "/premium" },
    ],
    links: [{ rel: "canonical", href: "/premium" }],
  }),
  component: Premium,
});


function Premium() {
  const { t, tArray } = useI18n();
  const features = tArray("premium.features");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber/40 bg-amber/10 text-amber text-xs font-semibold mb-6">
          <Crown className="h-3.5 w-3.5" /> {t("premium.badge")}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">
          {t("premium.titleA")}<br />
          <span className="text-primary">{t("premium.titleB")}</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          {t("premium.subtitle")}
        </p>
      </div>

      <div className="mt-12 max-w-md mx-auto">
        <div className="relative glass-card rounded-3xl p-8 glow-border noise-overlay overflow-hidden">
          <div className="absolute -top-px right-6 bg-amber text-amber-foreground text-[10px] font-bold px-3 py-1 rounded-b-md">
            {t("premium.save")}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums">฿149</span>
            <span className="text-muted-foreground text-sm">{t("premium.perMonth")}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t("premium.yearly")}</div>

          <ul className="mt-7 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button className="w-full mt-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border">
            {t("premium.cta")}
          </button>

          <div className="mt-5 text-center text-[11px] text-amber">
            {t("premium.founders")}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

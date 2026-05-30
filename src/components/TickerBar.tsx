import { Crosshair, Swords, Target, Flame, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const SEPARATORS = [Crosshair, Swords, Target, Flame, Zap];

export function TickerBar() {
  const { t } = useI18n();

  const items = [
    t("home.liveSea"),
    "AK-47 | REDLINE ฿1,240",
    "AWP | ASIIMOV ST ฿4,890",
    "KARAMBIT | FADE FN ฿89,000",
    "M4A1-S | PRINTSTREAM ฿11,200",
    "BUTTERFLY | TIGER TOOTH ฿78,500",
    "GLOCK-18 | FADE FN ฿12,400",
    "TRADE-UP HOT: HYPER BEAST −22%",
    "M9 BAYONET | MARBLE FADE FIRE&ICE",
  ];

  // Duplicate for seamless marquee loop
  const loop = [...items, ...items];

  return (
    <div
      className="ticker-bar ticker-mesh ticker-shimmer relative overflow-hidden
                 rounded-full border border-white/5
                 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,0,0,0.6)]
                 mb-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/60 to-transparent z-10" />

      <div className="relative flex items-center py-2 pl-5 pr-4 sm:pl-6 overflow-hidden">
        <div className="flex items-center gap-2.5 shrink-0 z-20 pr-5 mr-5 border-r border-white/10">
          <span className="live-dot" />
          <span className="font-display text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
            Live
          </span>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="marquee-track whitespace-nowrap">
            {loop.map((text, i) => {
              const Sep = SEPARATORS[i % SEPARATORS.length];
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-4 px-6 font-mono text-[11px]
                             tracking-[0.18em] uppercase text-foreground/80"
                >
                  <Sep className="h-3 w-3 text-amber/60" />
                  <span>{text}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


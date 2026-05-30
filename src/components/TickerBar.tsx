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
      className="ticker-bar ticker-shimmer relative overflow-hidden rounded-xl border border-amber/40
                 bg-gradient-to-r from-amber/15 via-primary/10 to-amber/15
                 backdrop-blur-sm mb-6"
    >
      {/* Fade masks on the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />


      <div className="relative flex items-center gap-3 py-2.5 px-4 sm:px-20 overflow-hidden">
        {/* Live indicator (fixed, doesn't scroll) */}
        <div className="hidden md:flex items-center gap-2 shrink-0 z-20 pr-3 border-r border-amber/30">
          <span className="live-dot" />
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-amber uppercase">
            LIVE
          </span>
        </div>

        {/* Scrolling track */}
        <div className="overflow-hidden flex-1">
          <div className="marquee-track whitespace-nowrap">
            {loop.map((text, i) => {
              const Sep = SEPARATORS[i % SEPARATORS.length];
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-3 px-4 font-mono text-[11px] sm:text-xs
                             tracking-[0.15em] uppercase text-foreground/85"
                >
                  <Sep className="h-3 w-3 text-amber/80" />
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

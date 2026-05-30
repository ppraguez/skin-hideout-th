import { Link } from "@tanstack/react-router";
import type { Skin } from "@/lib/mock-data";
import { WEAR_COLOR, WEAR_LABEL } from "@/lib/mock-data";
import { Star, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function SkinCard({ skin }: { skin: Skin }) {
  const lt = skin.listingType;
  const { t, formatPrice } = useI18n();

  return (
    <Link
      to="/market/$id"
      params={{ id: skin.id }}
      className="group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:glow-border"
    >
      {/* Thumb */}
      <div className="relative skin-thumb aspect-[4/3] noise-overlay overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {skin.weapon}
          </div>
          <div className="font-display text-2xl font-bold mt-1 text-foreground/90">
            {skin.name}
          </div>
        </div>

        {/* badges row — wear codes always English */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border bg-background/70 backdrop-blur-sm ${WEAR_COLOR[skin.wear]}`}>
            {skin.wear}
          </span>
          {skin.stattrak && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold border border-amber/50 text-amber bg-background/70">
              StatTrak™
            </span>
          )}
        </div>

        {skin.dealScore && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-success/15 border border-success/40 text-success text-[10px] font-semibold">
            {t("skinCard.belowMarket", { pct: skin.dealScore })}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{skin.weapon} | {skin.name}</div>
            <div className="text-[11px] text-muted-foreground font-mono">
              {WEAR_LABEL[skin.wear]} · {skin.float.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Listing type chip + price/trade */}
        <div className="flex items-center justify-between gap-2">
          {lt === "sell" && (
            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-primary/15 text-primary border border-primary/30">
              {t("skinCard.sellBadge")}
            </span>
          )}
          {lt === "trade" && (
            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-amber/15 text-amber border border-amber/30">
              {t("skinCard.tradeBadge")}
            </span>
          )}
          {lt === "both" && (
            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-gradient-to-r from-primary/15 to-amber/15 text-foreground border border-border">
              {t("skinCard.bothBadge")}
            </span>
          )}

          {skin.priceThb ? (
            <div className="font-mono font-bold text-base text-foreground tabular-nums">
              {formatPrice(skin.priceThb)}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground truncate max-w-[55%] text-right">
              {t("skinCard.for")} {skin.desiredItem}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/30 to-amber/20 border border-border shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-medium truncate">{skin.seller.username}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-amber text-amber" />
                {skin.seller.rep} · {skin.seller.location}
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

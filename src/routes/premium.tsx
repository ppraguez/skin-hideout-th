import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Crown, Check } from "lucide-react";

export const Route = createFileRoute("/premium")({
  head: () => ({ meta: [{ title: "Premium — CS2Hideout" }, { name: "description", content: "Unlock real-time alerts, early listings, advanced filters and more." }] }),
  component: Premium,
});

const FEATURES = [
  "Real-time price alerts (SMS + LINE notify)",
  "Early access to new listings (15 min before public)",
  "Advanced deal filters (float range, pattern index)",
  "Price history charts (90 days vs 30 days free)",
  "Watchlist up to 100 items (vs 10 free)",
  "Priority in community search",
  "Exclusive Premium badge on profile",
  "Monthly market report (Thai language)",
];

function Premium() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber/40 bg-amber/10 text-amber text-xs font-semibold mb-6">
          <Crown className="h-3.5 w-3.5" /> Premium
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold">
          Trade smarter.<br />
          <span className="text-primary">Spot deals first.</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          The serious trader's edge. Built for SEA, priced fairly, and locked in for founding members.
        </p>
      </div>

      <div className="mt-12 max-w-md mx-auto">
        <div className="relative glass-card rounded-3xl p-8 glow-border noise-overlay overflow-hidden">
          <div className="absolute -top-px right-6 bg-amber text-amber-foreground text-[10px] font-bold px-3 py-1 rounded-b-md">
            SAVE 28%
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums">฿149</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">or ฿1,290/year</div>

          <ul className="mt-7 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button className="w-full mt-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border">
            Go Premium
          </button>

          <div className="mt-5 text-center text-[11px] text-amber">
            ★ First 500 members lock in this price forever
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

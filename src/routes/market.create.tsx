import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/market/create")({
  head: () => ({ meta: [{ title: "Post a Listing — CS2Hideout" }] }),
  component: CreateListing,
});

type Mode = "sell" | "trade" | "both";

function CreateListing() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode>("sell");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Link to="/market" className="text-sm text-muted-foreground hover:text-primary">← Back to market</Link>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3">Post a listing</h1>
        <p className="text-sm text-muted-foreground mt-2">Three quick steps. We never touch your items — buyers reach out via Steam directly.</p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mt-8 mb-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= n ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"
              }`}>{step > n ? <Check className="h-3.5 w-3.5" /> : n}</div>
              {n < 4 && <div className={`flex-1 h-px ${step > n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">What are you listing?</h2>
              <Field label="Skin name">
                <input className={inputCls} placeholder="AK-47 | Redline" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Wear">
                  <select className={inputCls}>
                    <option>Factory New</option><option>Minimal Wear</option><option>Field-Tested</option><option>Well-Worn</option><option>Battle-Scarred</option>
                  </select>
                </Field>
                <Field label="Float value">
                  <input className={`${inputCls} font-mono`} placeholder="0.2143" />
                </Field>
              </div>
              <div className="flex gap-6 pt-2">
                <Toggle label="StatTrak™" />
                <Toggle label="Souvenir" />
              </div>
              <Field label="Notes (optional)">
                <textarea rows={2} className={inputCls} placeholder="Open to offers, low float, etc." />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">What do you want for it?</h2>
              <div className="space-y-2">
                {[
                  { v: "sell" as const, l: "Sell for THB" },
                  { v: "trade" as const, l: "Trade for item" },
                  { v: "both" as const, l: "Sell OR Trade" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setMode(o.v)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      mode === o.v ? "border-primary/60 bg-primary/10" : "border-border hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 ${mode === o.v ? "border-primary bg-primary" : "border-border"}`} />
                      <span className="font-semibold text-sm">{o.l}</span>
                    </div>
                  </button>
                ))}
              </div>

              {(mode === "sell" || mode === "both") && (
                <Field label="Price (฿)">
                  <input className={`${inputCls} font-mono`} placeholder="1240" />
                </Field>
              )}
              {(mode === "trade" || mode === "both") && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Desired item">
                    <input className={inputCls} placeholder="AWP | Asiimov" />
                  </Field>
                  <Field label="Wear">
                    <select className={inputCls}>
                      <option>Any</option><option>Factory New</option><option>Field-Tested</option>
                    </select>
                  </Field>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Your Steam Trade URL</h2>
              <Field label="Trade URL">
                <input className={inputCls} placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..." />
              </Field>
              <div className="text-xs text-muted-foreground bg-surface-elevated rounded-lg p-3 border border-border">
                Find your trade URL in <span className="text-foreground">Steam → Inventory → Trade Offers → Who can send me trade offers</span>. We'll save it to your profile so you only enter it once.
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Review & post</h2>
              <div className="rounded-xl border border-border p-5 skin-thumb noise-overlay">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AK-47</div>
                <div className="font-display text-2xl font-bold">Redline</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">Field-Tested · 0.2143</div>
                <div className="mt-4 font-mono text-xl font-bold">฿ 1,240</div>
              </div>
              <p className="text-xs text-muted-foreground">By posting, you agree to keep trades respectful and on-Steam. Off-platform scams are reported and banned immediately.</p>
            </div>
          )}

          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-border">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-30"
            >Back</button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold glow-border"
              >Continue</button>
            ) : (
              <Link to="/market" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold glow-border">
                Post listing
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const inputCls = "w-full bg-input/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex items-center gap-2 text-sm"
    >
      <span className={`h-5 w-9 rounded-full transition relative ${on ? "bg-primary" : "bg-surface-elevated"}`}>
        <span className={`absolute top-0.5 ${on ? "left-4" : "left-0.5"} h-4 w-4 rounded-full bg-background transition-all`} />
      </span>
      {label}
    </button>
  );
}

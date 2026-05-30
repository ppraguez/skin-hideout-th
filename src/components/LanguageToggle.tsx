import { useI18n, type Locale } from "@/lib/i18n/I18nProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const opts: { v: Locale; flag: string; label: string }[] = [
    { v: "th", flag: "🇹🇭", label: "TH" },
    { v: "en", flag: "🇬🇧", label: "EN" },
  ];
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface/70 backdrop-blur p-0.5 text-[11px] font-semibold">
      {opts.map((o) => {
        const active = locale === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => setLocale(o.v)}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
              active
                ? "bg-primary text-primary-foreground glow-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{o.flag}</span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "./locales/en.json";
import th from "./locales/th.json";

export type Locale = "th" | "en";
const dict = { en, th } as const;

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tArray: (key: string) => string[];
  formatPrice: (n: number) => string;
  formatTime: (raw: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function lookup(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function fill(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    str
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cs2h_locale");
      if (saved === "th" || saved === "en") setLocaleState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("cs2h_locale", l);
    } catch {
      // ignore
    }
  };

  const t: Ctx["t"] = (key, vars) => {
    const val = lookup(dict[locale], key);
    if (typeof val === "string") return fill(val, vars);
    const fallback = lookup(dict.en, key);
    if (typeof fallback === "string") return fill(fallback, vars);
    return key;
  };

  const tArray: Ctx["tArray"] = (key) => {
    const val = lookup(dict[locale], key);
    if (Array.isArray(val)) return val as string[];
    const fb = lookup(dict.en, key);
    return Array.isArray(fb) ? (fb as string[]) : [];
  };

  const formatPrice = (n: number) => {
    const num = n.toLocaleString("en-US");
    return locale === "th" ? `ราคา ฿${num}` : `฿ ${num}`;
  };

  // Maps fixed mock-data strings to localized strings.
  const TIME_MAP: Record<string, string> = {
    "12m ago": t("time.12m"),
    "1h ago": t("time.1h"),
    "3h ago": t("time.3h"),
    "Today 22:00": t("time.today", { hhmm: "22:00" }),
    "Tomorrow 19:30": t("time.tomorrow", { hhmm: "19:30" }),
    "Tomorrow 23:00": t("time.tomorrow", { hhmm: "23:00" }),
    "Fri 21:00": t("time.fri", { hhmm: "21:00" }),
  };

  const formatTime = (raw: string) => TIME_MAP[raw] ?? raw;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tArray, formatPrice, formatTime }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

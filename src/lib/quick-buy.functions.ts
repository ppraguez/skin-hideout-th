import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSessionConfig, type SteamSession } from "./steam-auth.server";

// ---- Tuning ---------------------------------------------------------------
const BUY_PCT = 0.82; // we pay this % of the market reference price
const MIN_VALUE_THB = 200; // ignore dust below this
const PRICE_SOURCE = "buff163"; // reference market
const STEAM_IMG = "https://community.cloudflare.steamstatic.com/economy/image";
// ---------------------------------------------------------------------------

export type InventoryQuote = {
  asset_id: string;
  market_hash_name: string;
  weapon: string;
  skin_name: string;
  category: string;
  wear: string; // FN/MW/FT/WW/BS/—
  exterior: string; // human label
  float_value: number | null;
  stattrak: boolean;
  souvenir: boolean;
  image_url: string | null;
  market_price_thb: number;
  buy_price_thb: number;
  market_percentage: number;
};

const WEAR_FROM_EXTERIOR: Record<string, string> = {
  "Factory New": "FN",
  "Minimal Wear": "MW",
  "Field-Tested": "FT",
  "Well-Worn": "WW",
  "Battle-Scarred": "BS",
};

function parseName(market_hash_name: string) {
  // e.g. "StatTrak™ AK-47 | Redline (Field-Tested)"
  const stattrak = market_hash_name.startsWith("StatTrak™");
  const souvenir = market_hash_name.startsWith("Souvenir ");
  const cleaned = market_hash_name
    .replace(/^StatTrak™ /, "")
    .replace(/^Souvenir /, "")
    .replace(/^★ /, "");
  const wearMatch = cleaned.match(/\(([^)]+)\)\s*$/);
  const exterior = wearMatch?.[1] ?? "";
  const withoutWear = cleaned.replace(/\s*\([^)]+\)\s*$/, "");
  const [weapon, skin] = withoutWear.split(" | ");
  return {
    stattrak,
    souvenir,
    weapon: (weapon ?? "").trim(),
    skin_name: (skin ?? "").trim(),
    exterior,
  };
}

async function pricempire<T>(path: string): Promise<T> {
  const key = process.env.PRICEMPIRE_API_KEY;
  if (!key) throw new Error("PRICEMPIRE_API_KEY is not configured");
  const url = `https://api.pricempire.com/v4${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Pricempire ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

type PriceRow = {
  market_hash_name: string;
  prices: Array<{ provider_key: string; price: number | null }>;
};

type InventoryResp = {
  items: Array<{
    asset_id: string;
    float_value: number | null;
    item: {
      market_hash_name: string;
      weapon_name?: string;
      category?: string;
      exterior?: string;
      image?: string | null;
    };
  }>;
};

export const getMyInventoryQuotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    items: InventoryQuote[];
    signedIn: boolean;
    buyPct: number;
    minValueThb: number;
  }> => {
    const session = await useSession<SteamSession>(getSessionConfig());
    const steamid = session.data.steamid;
    if (!steamid) {
      return { items: [], signedIn: false, buyPct: BUY_PCT, minValueThb: MIN_VALUE_THB };
    }

    const [inv, prices] = await Promise.all([
      pricempire<InventoryResp>(
        `/paid/inventory?steam_id=${encodeURIComponent(steamid)}&app_id=730`,
      ),
      pricempire<PriceRow[]>(
        `/paid/items/prices?app_id=730&sources=${PRICE_SOURCE}&currency=THB&type=skin,knife,gloves`,
      ),
    ]);

    const priceMap = new Map<string, number>();
    for (const row of prices ?? []) {
      const p = row.prices?.find((x) => x.provider_key === PRICE_SOURCE)?.price;
      if (typeof p === "number" && p > 0) priceMap.set(row.market_hash_name, p);
    }

    const items: InventoryQuote[] = [];
    for (const entry of inv.items ?? []) {
      const market = priceMap.get(entry.item.market_hash_name);
      if (!market) continue;
      const buy = Math.round(market * BUY_PCT);
      if (buy < MIN_VALUE_THB) continue;

      const parsed = parseName(entry.item.market_hash_name);
      const exterior = entry.item.exterior ?? parsed.exterior;
      const wear = WEAR_FROM_EXTERIOR[exterior] ?? "—";

      items.push({
        asset_id: entry.asset_id,
        market_hash_name: entry.item.market_hash_name,
        weapon: entry.item.weapon_name ?? parsed.weapon,
        skin_name: parsed.skin_name || entry.item.market_hash_name,
        category: entry.item.category ?? "",
        wear,
        exterior,
        float_value: entry.float_value ?? null,
        stattrak: parsed.stattrak,
        souvenir: parsed.souvenir,
        image_url: entry.item.image ? `${STEAM_IMG}/${entry.item.image}/360fx360f` : null,
        market_price_thb: Math.round(market),
        buy_price_thb: buy,
        market_percentage: Math.round(BUY_PCT * 100),
      });
    }

    items.sort((a, b) => b.buy_price_thb - a.buy_price_thb);
    return { items, signedIn: true, buyPct: BUY_PCT, minValueThb: MIN_VALUE_THB };
  },
);

// ---- Submission -----------------------------------------------------------

const submissionSchema = z.object({
  asset_id: z.string().trim().min(1).max(64).optional().or(z.literal("")),
  market_hash_name: z.string().trim().min(1).max(200),
  wear: z.string().trim().min(1).max(8),
  float_value: z.number().min(0).max(1).nullable().optional(),
  stattrak: z.boolean().default(false),
  quoted_price_thb: z.number().int().min(0).max(10_000_000),
  contact_method: z.string().trim().min(2).max(200),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitQuickBuyOffer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const session = await useSession<SteamSession>(getSessionConfig());
    const steamid = session.data.steamid ?? null;

    const noteParts = [
      data.notes || "",
      `quoted: ฿${data.quoted_price_thb}`,
      data.asset_id ? `asset:${data.asset_id}` : "",
      steamid ? `steamid:${steamid}` : "",
    ].filter(Boolean);

    const { error } = await supabaseAdmin.from("quick_buy_submissions").insert({
      listing_id: null,
      skin_name: data.market_hash_name,
      wear: data.wear,
      float_value: data.float_value ?? null,
      stattrak: data.stattrak,
      inspect_link: null,
      contact_method: data.contact_method,
      notes: noteParts.join(" | "),
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

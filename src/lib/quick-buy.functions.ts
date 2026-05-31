import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type QuickBuyListing = {
  id: string;
  skin_name: string;
  weapon: string;
  wear: string;
  min_float: number;
  max_float: number;
  stattrak_accepted: boolean;
  buy_price_thb: number;
  market_percentage: number;
  image_url: string | null;
};

export const getQuickBuyListings = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ listings: QuickBuyListing[] }> => {
    const { data, error } = await supabaseAdmin
      .from("quick_buy_listings")
      .select(
        "id, skin_name, weapon, wear, min_float, max_float, stattrak_accepted, buy_price_thb, market_percentage, image_url"
      )
      .eq("status", "active")
      .order("buy_price_thb", { ascending: false });
    if (error) throw new Error(error.message);
    return { listings: (data ?? []) as QuickBuyListing[] };
  }
);

const submissionSchema = z.object({
  listing_id: z.string().uuid().nullable().optional(),
  skin_name: z.string().trim().min(1).max(200),
  wear: z.enum(["FN", "MW", "FT", "WW", "BS"]),
  float_value: z.number().min(0).max(1).nullable().optional(),
  stattrak: z.boolean().default(false),
  inspect_link: z
    .string()
    .trim()
    .max(500)
    .url()
    .optional()
    .or(z.literal("")),
  contact_method: z.string().trim().min(2).max(200),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitQuickBuyOffer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("quick_buy_submissions").insert({
      listing_id: data.listing_id ?? null,
      skin_name: data.skin_name,
      wear: data.wear,
      float_value: data.float_value ?? null,
      stattrak: data.stattrak,
      inspect_link: data.inspect_link || null,
      contact_method: data.contact_method,
      notes: data.notes || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

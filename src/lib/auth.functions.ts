import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { getSessionConfig, type SteamSession } from "./steam-auth.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CurrentUser = {
  steamid: string;
  username: string;
  avatar_url: string | null;
  profile_url: string | null;
} | null;

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<CurrentUser> => {
    const session = await useSession<SteamSession>(getSessionConfig());
    const steamid = session.data.steamid;
    if (!steamid) return null;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("steamid, username, avatar_url, profile_url")
      .eq("steamid", steamid)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  },
);

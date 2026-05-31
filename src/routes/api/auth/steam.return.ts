import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@tanstack/react-start/server";
import {
  fetchSteamProfile,
  getSessionConfig,
  verifySteamOpenId,
  type SteamSession,
} from "@/lib/steam-auth.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/auth/steam/return")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const origin = url.origin;

        try {
          const steamid = await verifySteamOpenId(url.searchParams);
          if (!steamid) {
            return Response.redirect(`${origin}/?auth_error=invalid`, 302);
          }

          const profile = await fetchSteamProfile(steamid);
          if (!profile) {
            return Response.redirect(`${origin}/?auth_error=profile`, 302);
          }

          const { error: upsertError } = await supabaseAdmin
            .from("profiles")
            .upsert(
              {
                steamid: profile.steamid,
                username: profile.personaname,
                avatar_url: profile.avatarfull,
                profile_url: profile.profileurl,
              },
              { onConflict: "steamid" },
            );
          if (upsertError) {
            console.error("Profile upsert failed:", upsertError);
            return Response.redirect(`${origin}/?auth_error=db`, 302);
          }

          const session = await useSession<SteamSession>(getSessionConfig());
          await session.update({ steamid: profile.steamid });

          return Response.redirect(`${origin}/`, 302);
        } catch (err) {
          console.error("Steam auth return failed:", err);
          return Response.redirect(`${origin}/?auth_error=server`, 302);
        }
      },
    },
  },
});

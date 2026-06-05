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

          // Render a tiny completion page: if opened in a popup, notify the
          // opener (so the iframe can refetch the session) and close. Otherwise
          // redirect home.
          const html = `<!doctype html><html><head><meta charset="utf-8"><title>Signed in</title></head><body style="background:#0b0b0b;color:#e5e5e5;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><div style="font-size:18px;font-weight:600">Signed in with Steam ✓</div><div style="opacity:.7;font-size:13px;margin-top:8px">You can close this tab.</div></div><script>
try {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: "cs2h:steam-signed-in" }, "*");
    window.close();
  } else {
    window.location.replace(${JSON.stringify(`${origin}/`)});
  }
} catch (e) {
  window.location.replace(${JSON.stringify(`${origin}/`)});
}
</script></body></html>`;
          return new Response(html, {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        } catch (err) {
          console.error("Steam auth return failed:", err);
          return Response.redirect(`${origin}/?auth_error=server`, 302);
        }
      },
    },
  },
});

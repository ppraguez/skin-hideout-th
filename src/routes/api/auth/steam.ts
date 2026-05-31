import { createFileRoute } from "@tanstack/react-router";
import { buildSteamLoginUrl } from "@/lib/steam-auth.server";

export const Route = createFileRoute("/api/auth/steam")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        return Response.redirect(buildSteamLoginUrl(origin), 302);
      },
    },
  },
});

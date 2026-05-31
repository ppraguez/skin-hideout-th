import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@tanstack/react-start/server";
import { getSessionConfig, type SteamSession } from "@/lib/steam-auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        const session = await useSession<SteamSession>(getSessionConfig());
        await session.clear();
        return Response.json({ success: true });
      },
    },
  },
});

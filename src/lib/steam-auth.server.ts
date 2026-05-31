// Server-only Steam OpenID 2.0 helpers and session config.
// Never import this from client code.

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const STEAMID_REGEX = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/;

export type SteamSession = {
  steamid: string;
};

export const SESSION_COOKIE_NAME = "cs2h_session";

export function getSessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters.");
  }
  return {
    password,
    name: SESSION_COOKIE_NAME,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

/** Build the URL we redirect the user to so they can log in on Steam. */
export function buildSteamLoginUrl(origin: string): string {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": `${origin}/api/auth/steam/return`,
    "openid.realm": origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

/**
 * Verify the OpenID response by replaying the params back to Steam with
 * `openid.mode=check_authentication`. Returns the SteamID64 if valid.
 */
export async function verifySteamOpenId(
  searchParams: URLSearchParams,
): Promise<string | null> {
  // Steam must have sent us a claimed_id we can parse
  const claimedId = searchParams.get("openid.claimed_id");
  if (!claimedId) return null;
  const match = STEAMID_REGEX.exec(claimedId);
  if (!match) return null;
  const steamid = match[1];

  // Rebuild the param set with mode=check_authentication
  const body = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("openid.")) body.set(key, value);
  }
  body.set("openid.mode", "check_authentication");

  const res = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) return null;
  const text = await res.text();
  const isValid = /is_valid\s*:\s*true/i.test(text);
  return isValid ? steamid : null;
}

export type SteamPlayerSummary = {
  steamid: string;
  personaname: string;
  avatarfull: string | null;
  profileurl: string | null;
};

export async function fetchSteamProfile(
  steamid: string,
): Promise<SteamPlayerSummary | null> {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) throw new Error("STEAM_API_KEY is not set.");
  const url = new URL(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamid);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const json = (await res.json()) as {
    response?: { players?: Array<Record<string, unknown>> };
  };
  const player = json.response?.players?.[0];
  if (!player) return null;
  return {
    steamid: String(player.steamid ?? steamid),
    personaname: String(player.personaname ?? "Steam User"),
    avatarfull: (player.avatarfull as string) ?? null,
    profileurl: (player.profileurl as string) ?? null,
  };
}

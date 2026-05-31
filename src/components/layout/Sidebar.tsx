import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Users, Gamepad2, Crown, LogOut, Flame } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCurrentUser, useLogout } from "@/hooks/use-current-user";

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const nav = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/market", label: t("nav.market"), icon: ShoppingBag },
    { to: "/community", label: t("nav.community"), icon: Users },
    { to: "/matches", label: t("nav.matches"), icon: Gamepad2 },
    { to: "/premium", label: t("nav.premium"), icon: Crown },
  ] as const;

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface/40 backdrop-blur-md sticky top-0 h-screen px-4 py-6">
      <Link to="/" className="flex items-center gap-2 mb-10 px-2">
        <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-amber flex items-center justify-center glow-border">
          <Flame className="h-5 w-5 text-background" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">CS2Hideout</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">{t("sidebar.tagline")}</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary glow-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        {isLoading ? (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-9 w-9 rounded-full bg-surface-elevated animate-pulse" />
            <div className="flex-1 h-3 rounded bg-surface-elevated animate-pulse" />
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-elevated/50">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-9 w-9 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-amber/30 border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.username}</div>
              <div className="text-[11px] text-muted-foreground truncate">Steam · Connected</div>
            </div>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              aria-label={t("sidebar.logout")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <a
            href="/api/auth/steam"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-amber/30 border border-border flex items-center justify-center">
              <Flame className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{t("sidebar.signIn")}</div>
              <div className="text-[11px] text-muted-foreground">{t("sidebar.connectSteam")}</div>
            </div>
          </a>
        )}
      </div>
    </aside>
  );
}

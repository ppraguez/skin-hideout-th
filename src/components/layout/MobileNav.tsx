import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Users, Gamepad2, User } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t("nav.home"), icon: Home },
    { to: "/market", label: t("nav.market"), icon: ShoppingBag },
    { to: "/community", label: t("nav.community"), icon: Users },
    { to: "/matches", label: t("nav.matches"), icon: Gamepad2 },
    { to: "/login", label: t("nav.profile"), icon: User },
  ] as const;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/90 backdrop-blur-lg">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

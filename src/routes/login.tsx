import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — CS2Hideout" }] }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <div className="max-w-md mx-auto pt-10 text-center">
        <div className="font-display text-3xl font-bold">{t("login.title")}</div>
        <p className="text-sm text-muted-foreground mt-2">
          {t("login.subtitle")}
        </p>

        <div className="glass-card rounded-2xl p-7 mt-8">
          <button className="w-full py-3 rounded-xl bg-[#171a21] hover:bg-[#1f242c] border border-border text-sm font-semibold inline-flex items-center justify-center gap-3 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 5.5 3.7 10.1 8.7 11.6l3.7-2.9-1-1.4 1.6.4c2.6 1 5.4-.9 5.4-3.7 0-2.3-1.9-4.2-4.2-4.2-1.2 0-2.3.5-3.1 1.4L7.4 11.1c.3-.1.6-.2 1-.2 1.5 0 2.8 1.2 2.8 2.8s-1.2 2.8-2.8 2.8c-1.4 0-2.5-1-2.7-2.3L1.2 12C2 6 6.5 1.5 12 1.5c5.8 0 10.5 4.7 10.5 10.5S17.8 22.5 12 22.5c-1 0-2-.1-2.9-.4l-.7.5C9.7 23 10.8 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0z"/>
            </svg>
            {t("login.connectSteam")}
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest">
            <div className="flex-1 h-px bg-border" /> {t("login.or")} <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            <input className="w-full bg-input/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60" placeholder={t("login.email")} />
            <input type="password" className="w-full bg-input/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60" placeholder={t("login.password")} />
            <button className="w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary/50">
              {t("login.signInEmail")}
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {t("login.newHere")} <Link to="/" className="text-primary hover:underline">{t("login.learnMore")}</Link>
        </p>
      </div>
    </AppLayout>
  );
}

import { useState, type ReactNode } from "react";

interface SteamLoginButtonProps {
  className?: string;
  children: ReactNode;
}

/**
 * Opens Steam login in the top-level window. Steam sends X-Frame-Options: DENY,
 * so it cannot render inside the Lovable preview iframe. If top-level navigation
 * is blocked (sandboxed iframe), we fall back to opening a new tab and show
 * an inline message with a manual link.
 */
export function SteamLoginButton({ className, children }: SteamLoginButtonProps) {
  const [blocked, setBlocked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = "/api/auth/steam";

    // Try top-level navigation first
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = url;
        return;
      }
      window.location.href = url;
      return;
    } catch {
      // Sandboxed iframe — top navigation blocked
    }

    // Fallback: open in new tab
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      setBlocked(true);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <a href="/api/auth/steam" target="_top" rel="noopener" onClick={handleClick} className={className}>
        {children}
      </a>
      {blocked && (
        <div className="text-xs rounded-lg border border-amber/40 bg-amber/10 text-amber-foreground p-3 max-w-sm">
          <p className="font-medium mb-1">Steam can't load inside this preview</p>
          <p className="text-muted-foreground mb-2">
            Steam blocks sign-in inside embedded windows. Open it in a new tab to continue.
          </p>
          <a
            href="/api/auth/steam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-semibold text-primary hover:underline"
          >
            Continue with Steam →
          </a>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQueryKey } from "@/hooks/use-current-user";

interface SteamLoginButtonProps {
  className?: string;
  children: ReactNode;
}

/**
 * Opens Steam login. Steam blocks loading inside an iframe (X-Frame-Options:
 * DENY), so we try top-level navigation first and fall back to a new tab.
 * When the return handler completes in the popup it posts a message back to
 * this window, and we invalidate the current-user query to flip the UI into
 * the signed-in state without a manual refresh.
 */
export function SteamLoginButton({ className, children }: SteamLoginButtonProps) {
  const [blocked, setBlocked] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const qc = useQueryClient();

  // Refresh session whenever the popup pings us OR the tab regains focus.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.type === "cs2h:steam-signed-in") {
        setWaiting(false);
        qc.invalidateQueries({ queryKey: currentUserQueryKey });
      }
    };
    const onFocus = () => {
      if (waiting) qc.invalidateQueries({ queryKey: currentUserQueryKey });
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("focus", onFocus);
    };
  }, [qc, waiting]);

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
    } else {
      setWaiting(true);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <a href="/api/auth/steam" target="_top" rel="noopener" onClick={handleClick} className={className}>
        {children}
      </a>
      {waiting && (
        <div className="text-xs text-muted-foreground">
          Waiting for Steam sign-in to complete…
        </div>
      )}
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
            onClick={() => setWaiting(true)}
          >
            Continue with Steam →
          </a>
        </div>
      )}
    </div>
  );
}

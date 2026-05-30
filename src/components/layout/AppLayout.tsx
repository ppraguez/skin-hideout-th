import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { LanguageToggle } from "@/components/LanguageToggle";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-end gap-2 px-4 sm:px-6 lg:px-10 py-3 bg-background/60 backdrop-blur-md border-b border-border/40">
          <LanguageToggle />
        </header>
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

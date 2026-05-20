import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Crown, LogOut, Menu, User, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

function PrincipalBadge({ principal }: { principal: string | null }) {
  if (!principal) return <Skeleton className="h-6 w-32" />;
  const short = `${principal.slice(0, 8)}…${principal.slice(-4)}`;
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5">
      <User className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-mono text-xs text-muted-foreground">{short}</span>
    </div>
  );
}

function SubscriptionBadge() {
  const { status, daysRemaining, isLoading, isPremium } = useSubscription();

  if (isLoading) return <Skeleton className="h-6 w-24" />;

  if (status === "trial") {
    return (
      <Link to="/subscription" data-ocid="layout.trial_badge">
        <Badge
          className={cn(
            "gap-1.5 border-orange-500/40 bg-orange-500/15 text-orange-400",
            "hover:bg-orange-500/25 transition-smooth cursor-pointer",
          )}
        >
          <Crown className="h-3 w-3" />
          Trial: {daysRemaining}d left
        </Badge>
      </Link>
    );
  }

  if (status === "active" && isPremium) {
    return (
      <Badge
        className="gap-1.5 border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
        data-ocid="layout.premium_badge"
      >
        <Crown className="h-3 w-3" />
        Premium
      </Badge>
    );
  }

  if (status === "expired") {
    return (
      <Link to="/subscription" data-ocid="layout.expired_badge">
        <Badge
          className={cn(
            "gap-1.5 border-destructive/40 bg-destructive/15 text-destructive",
            "hover:bg-destructive/25 transition-smooth cursor-pointer",
          )}
        >
          Upgrade Now
        </Badge>
      </Link>
    );
  }

  return null;
}

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 gap-0 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth cursor-pointer"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      aria-label="Toggle language"
      data-ocid="layout.lang_toggle"
    >
      <span
        className={cn(
          "transition-smooth",
          language === "en" ? "text-primary" : "text-muted-foreground",
        )}
      >
        EN
      </span>
      <span className="mx-1 text-muted-foreground/40">/</span>
      <span
        className={cn(
          "transition-smooth",
          language === "hi" ? "text-primary" : "text-muted-foreground",
        )}
      >
        हि
      </span>
    </Button>
  );
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { principal, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay backdrop — only rendered AND interactive when sidebar is open */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300",
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar — hidden on mobile (slides in), always visible on desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-full w-60 shrink-0 flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area — always full-width on mobile, flex-1 on desktop */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header
          className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6"
          data-ocid="layout.header"
        >
          <div className="flex items-center gap-3">
            {/* Hamburger button — mobile only */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 md:hidden cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              data-ocid="layout.menu_button"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {title && (
              <div className="flex items-center gap-3">
                <h1 className="font-display text-base font-semibold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <>
                    <Separator
                      orientation="vertical"
                      className="hidden h-4 opacity-50 sm:block"
                    />
                    <span className="hidden text-sm text-muted-foreground sm:inline">
                      {subtitle}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageToggle />
            <NotificationBell />
            <SubscriptionBadge />
            <div className="hidden md:block">
              <PrincipalBadge principal={principal} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-muted-foreground hover:text-destructive transition-smooth cursor-pointer"
              data-ocid="layout.logout_button"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Main content — scrolls independently within this flex child */}
        <main
          className="relative min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-6"
          data-ocid="layout.main"
        >
          {children}
        </main>
      </div>

      {/* Mobile sidebar close button — floating X when open */}
      {sidebarOpen && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="fixed left-[15rem] top-3 z-40 h-8 w-8 md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
          data-ocid="layout.close_menu_button"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

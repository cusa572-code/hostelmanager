import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { useReminders } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  Crown,
  LayoutDashboard,
  Receipt,
  StickyNote,
  Users,
  Wallet,
} from "lucide-react";

interface NavLink {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: string;
  activeBadgeCount?: number;
}

function getActiveReminderCount(reminders: Reminder[]): number {
  const now = Date.now();
  return reminders.filter((r) => {
    if (r.isDone) return false;
    const remindAtMs = Number(r.remindAt) / 1_000_000;
    return remindAtMs <= now + 60 * 60 * 1000; // overdue or due within 1h
  }).length;
}

function RemindersBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <Badge
      className="shrink-0 bg-destructive/20 border-destructive/30 text-destructive px-1.5 py-0 text-xs font-bold min-w-[1.25rem] justify-center"
      data-ocid="sidebar.reminders_badge"
    >
      {count > 9 ? "9+" : count}
    </Badge>
  );
}

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();
  const { data: reminders = [] } = useReminders();
  const activeReminderCount = getActiveReminderCount(reminders);
  const { t } = useLanguage();

  const navLinks: NavLink[] = [
    {
      label: t("dashboard"),
      to: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: t("rooms"),
      to: "/rooms",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: t("students"),
      to: "/students",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: t("payments"),
      to: "/payments",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: t("expenses"),
      to: "/expenses",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: t("udhar"),
      to: "/udhar",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      label: t("complaints"),
      to: "/complaints",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    {
      label: t("notes"),
      to: "/notes",
      icon: <StickyNote className="h-4 w-4" />,
    },
    {
      label: t("chart"),
      to: "/chart",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: t("reminders"),
      to: "/reminders",
      icon: <Bell className="h-4 w-4" />,
      activeBadgeCount: activeReminderCount,
    },
    {
      label: "Staff",
      to: "/staff",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: t("subscription"),
      to: "/subscription",
      icon: <Crown className="h-4 w-4" />,
      badge: "Premium",
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col border-r border-border bg-card",
        className,
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <BedDouble className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-tight text-foreground">
            HostelAdmin
          </p>
          <p className="text-xs text-muted-foreground">Management Portal</p>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" data-ocid="sidebar.nav">
        <p className="px-2 pb-2 text-xs-label text-muted-foreground">
          Navigation
        </p>
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to !== "/dashboard" &&
                location.pathname.startsWith(`${link.to}/`));
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  data-ocid={
                    `sidebar.nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link` as string
                  }
                  className={cn(
                    "group flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 transition-smooth",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {link.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{link.label}</span>
                  {link.activeBadgeCount !== undefined && (
                    <RemindersBadge count={link.activeBadgeCount} />
                  )}
                  {link.badge && !link.activeBadgeCount && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 border-orange-500/30 bg-orange-500/10 px-1.5 py-0 text-xs text-orange-400"
                    >
                      {link.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="opacity-50" />

      {/* Footer brand */}
      <div className="px-5 py-4">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}

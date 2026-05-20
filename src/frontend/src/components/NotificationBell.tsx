import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useClearAllNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { NotificationType } from "@/types";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  Clock,
  Home,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function timeAgo(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notifIcon(type: NotificationType) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case NotificationType.rentDue:
      return <Clock className={cn(cls, "text-amber-400")} />;
    case NotificationType.paymentOverdue:
      return <AlertTriangle className={cn(cls, "text-destructive")} />;
    case NotificationType.emptyRoom:
      return <Home className={cn(cls, "text-primary")} />;
    case NotificationType.complaintUpdate:
      return <MessageSquare className={cn(cls, "text-blue-400")} />;
    default:
      return <Bell className={cn(cls, "text-muted-foreground")} />;
  }
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: bigint) => void;
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.isRead) onRead(notification.id);
      }}
      data-ocid={`notifications.item.${notification.id}`}
      className={cn(
        "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-smooth hover:bg-secondary/60 cursor-pointer",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <div className="mt-0.5">{notifIcon(notification.notifType)}</div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs font-medium",
            notification.isRead ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0n } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const clearAll = useClearAllNotifications();

  const count = Number(unreadCount);

  // Close on outside click — attach to document, not a blocking overlay
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      // Delay to avoid the same click that opened it closing it immediately
      const timeout = setTimeout(() => {
        document.addEventListener("mousedown", handler);
      }, 10);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener("mousedown", handler);
      };
    }
    return undefined;
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        data-ocid="notifications.bell_button"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-bold text-destructive-foreground"
            aria-hidden="true"
            data-ocid="notifications.unread_badge"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>

      {/* Dropdown panel — plain div, no browser dialog semantics */}
      {open && (
        <section
          aria-label="Notifications panel"
          className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-border bg-card shadow-lg"
          data-ocid="notifications.panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Notifications
              </span>
              {count > 0 && (
                <Badge className="h-4 min-w-4 border-primary/30 bg-primary/10 px-1 text-[10px] text-primary">
                  {count}
                </Badge>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              data-ocid="notifications.close_button"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-1 border-b border-border/50 px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => markAllRead.mutate()}
                disabled={count === 0}
                data-ocid="notifications.mark_all_read_button"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                onClick={() => clearAll.mutate()}
                data-ocid="notifications.clear_all_button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </Button>
            </div>
          )}

          {/* List */}
          {notifications.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-10 text-center"
              data-ocid="notifications.empty_state"
            >
              <BellOff className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <ScrollArea className="max-h-72">
              <div className="p-2">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id.toString()}
                    notification={n}
                    onRead={(id) => markRead.mutate(id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </section>
      )}
    </div>
  );
}

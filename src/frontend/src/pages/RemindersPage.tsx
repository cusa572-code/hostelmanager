import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddReminder,
  useDeleteReminder,
  useMarkReminderDone,
  useReminders,
  useUpdateReminder,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/types";
import {
  AlertCircle,
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ReminderStatus = "upcoming" | "due-soon" | "overdue" | "done";

function getStatus(reminder: Reminder, now: number): ReminderStatus {
  if (reminder.isDone) return "done";
  const remindAtMs = Number(reminder.remindAt) / 1_000_000;
  const diffMs = remindAtMs - now;
  if (diffMs < 0) return "overdue";
  if (diffMs < 60 * 60 * 1000) return "due-soon"; // < 1 hour
  return "upcoming";
}

function formatRelativeTime(reminder: Reminder, now: number): string {
  const remindAtMs = Number(reminder.remindAt) / 1_000_000;
  const diffMs = remindAtMs - now;
  const absDiff = Math.abs(diffMs);
  const minutes = Math.floor(absDiff / 60_000);
  const hours = Math.floor(absDiff / 3_600_000);
  const days = Math.floor(absDiff / 86_400_000);

  if (reminder.isDone) return "Completed";
  if (diffMs < 0) {
    if (minutes < 60) return `${minutes}m overdue`;
    if (hours < 24) return `${hours}h overdue`;
    return `${days}d overdue`;
  }
  if (minutes < 60) return `In ${minutes}m`;
  if (hours < 24) return `In ${hours}h`;
  return `In ${days}d`;
}

function formatDateTime(remindAt: bigint): string {
  const ms = Number(remindAt) / 1_000_000;
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function toDateTimeLocal(remindAt: bigint): string {
  const ms = Number(remindAt) / 1_000_000;
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowPlusHour(): string {
  const d = new Date(Date.now() + 3_600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STATUS_CONFIG: Record<
  ReminderStatus,
  { label: string; className: string; dot: string }
> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
  },
  "due-soon": {
    label: "Due Soon",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dot: "bg-orange-400",
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
  done: {
    label: "Done",
    className: "bg-muted/60 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

// ─── Form Dialog ─────────────────────────────────────────────────────────────

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  editing?: Reminder | null;
}

function ReminderFormDialog({ open, onClose, editing }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState(nowPlusHour());
  const addReminder = useAddReminder();
  const updateReminder = useUpdateReminder();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitle(editing.title);
        setMessage(editing.message);
        setDateTime(toDateTimeLocal(editing.remindAt));
      } else {
        setTitle("");
        setMessage("");
        setDateTime(nowPlusHour());
      }
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [open, editing]);

  const isPending = addReminder.isPending || updateReminder.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const remindAtMs = new Date(dateTime).getTime();
    const remindAtNs = BigInt(remindAtMs) * 1_000_000n;

    if (editing) {
      updateReminder.mutate(
        {
          id: editing.id,
          title: title.trim(),
          message: message.trim(),
          remindAt: remindAtNs,
        },
        { onSuccess: onClose },
      );
    } else {
      addReminder.mutate(
        { title: title.trim(), message: message.trim(), remindAt: remindAtNs },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md bg-card border-border"
        data-ocid="reminders.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {editing ? "Edit Reminder" : "New Reminder"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="form-label" htmlFor="reminder-title">
              Title
            </Label>
            <Input
              id="reminder-title"
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Collect rent from Room 5"
              className="bg-background border-border focus-visible:ring-primary"
              maxLength={120}
              required
              data-ocid="reminders.title_input"
            />
          </div>

          <div>
            <Label className="form-label" htmlFor="reminder-message">
              Message / Notes
            </Label>
            <Textarea
              id="reminder-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any additional details…"
              className="bg-background border-border focus-visible:ring-primary resize-none"
              rows={3}
              maxLength={500}
              data-ocid="reminders.message_textarea"
            />
          </div>

          <div>
            <Label className="form-label" htmlFor="reminder-datetime">
              Date &amp; Time
            </Label>
            <Input
              id="reminder-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="bg-background border-border focus-visible:ring-primary"
              required
              data-ocid="reminders.datetime_input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              data-ocid="reminders.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-primary text-primary-foreground hover:opacity-90"
              data-ocid="reminders.submit_button"
            >
              {isPending
                ? "Saving…"
                : editing
                  ? "Save Changes"
                  : "Add Reminder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ───────────────────────────────────────────────────

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm bg-card border-border"
        data-ocid="reminders.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Delete Reminder
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          This reminder will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            data-ocid="reminders.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="reminders.delete_confirm_button"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────

interface AlertBannerProps {
  reminders: Reminder[];
  onDismiss: () => void;
}

function AlertBanner({ reminders, onDismiss }: AlertBannerProps) {
  if (reminders.length === 0) return null;
  const count = reminders.length;
  const first = reminders[0];

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-3 mb-5 animate-in slide-in-from-top-2 duration-300"
      role="alert"
      data-ocid="reminders.alert_banner"
    >
      <BellRing className="h-5 w-5 shrink-0 text-orange-400 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-orange-300">
          {count === 1
            ? "Reminder triggered!"
            : `${count} reminders triggered!`}
        </p>
        <p className="text-xs text-orange-400/80 truncate mt-0.5">
          {first.title}
          {count > 1 && ` and ${count - 1} more`}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-orange-400/60 hover:text-orange-400 transition-smooth"
        aria-label="Dismiss alert"
        data-ocid="reminders.alert_dismiss_button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Reminder Card ────────────────────────────────────────────────────────────

interface ReminderCardProps {
  reminder: Reminder;
  status: ReminderStatus;
  now: number;
  index: number;
  onEdit: (r: Reminder) => void;
  onDelete: (r: Reminder) => void;
}

function ReminderCard({
  reminder,
  status,
  now,
  index,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const cfg = STATUS_CONFIG[status];
  const markDone = useMarkReminderDone();
  const isMarkingDone = markDone.isPending;

  return (
    <div
      className={cn(
        "reminder-card group flex items-start gap-4",
        status === "done" && "opacity-60",
      )}
      data-ocid={`reminders.item.${index}`}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full ring-2 ring-background",
            cfg.dot,
          )}
        />
        <span className="mt-1 w-px flex-1 bg-border min-h-[1.5rem]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <p
              className={cn(
                "font-semibold text-sm text-foreground truncate",
                status === "done" && "line-through text-muted-foreground",
              )}
            >
              {reminder.title}
            </p>
            {reminder.message && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {reminder.message}
              </p>
            )}
          </div>

          <Badge
            className={cn(
              "shrink-0 border text-xs font-semibold px-2 py-0.5",
              cfg.className,
            )}
            data-ocid={`reminders.status_badge.${index}`}
          >
            {cfg.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(reminder.remindAt)}
            </span>
            <span
              className={cn(
                "font-medium",
                status === "overdue" && "text-destructive",
                status === "due-soon" && "text-orange-400",
                status === "upcoming" && "text-primary",
                status === "done" && "text-muted-foreground",
              )}
            >
              {formatRelativeTime(reminder, now)}
            </span>
          </div>

          {/* Actions */}
          <div className="action-buttons">
            {!reminder.isDone && (
              <button
                type="button"
                onClick={() => markDone.mutate(reminder.id)}
                disabled={isMarkingDone}
                className="btn-ghost h-7 w-7 p-0 text-primary hover:bg-primary/10"
                aria-label="Mark as done"
                data-ocid={`reminders.mark_done_button.${index}`}
                title="Mark as done"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            {reminder.isDone && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Done
              </span>
            )}
            <button
              type="button"
              onClick={() => onEdit(reminder)}
              className="btn-ghost h-7 w-7 p-0"
              aria-label="Edit reminder"
              data-ocid={`reminders.edit_button.${index}`}
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(reminder)}
              className="btn-ghost h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
              aria-label="Delete reminder"
              data-ocid={`reminders.delete_button.${index}`}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

const EMPTY_MESSAGES: Record<
  string,
  { icon: React.ReactNode; title: string; desc: string }
> = {
  all: {
    icon: <Bell className="h-12 w-12" />,
    title: "No reminders yet",
    desc: "Add your first reminder to stay on top of hostel tasks and deadlines.",
  },
  upcoming: {
    icon: <Clock className="h-12 w-12" />,
    title: "No upcoming reminders",
    desc: "All clear! Add a new reminder to schedule your next task.",
  },
  overdue: {
    icon: <AlertCircle className="h-12 w-12" />,
    title: "No overdue reminders",
    desc: "Great job — everything is on track.",
  },
  done: {
    icon: <CheckCircle2 className="h-12 w-12" />,
    title: "No completed reminders",
    desc: "Mark reminders as done when you've completed them.",
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterTab = "all" | "upcoming" | "overdue" | "done";

export default function RemindersPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reminder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );
  const [now, setNow] = useState(() => Date.now());

  const { data: reminders = [], isLoading } = useReminders();
  const deleteReminder = useDeleteReminder();

  // Poll every 60 seconds to refresh "now" for time checks
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Enrich reminders with status
  const enriched = useMemo(
    () => reminders.map((r) => ({ reminder: r, status: getStatus(r, now) })),
    [reminders, now],
  );

  // Alert: newly triggered reminders (overdue + due-soon) not yet dismissed
  const alertReminders = useMemo(
    () =>
      enriched
        .filter(
          ({ reminder, status }) =>
            (status === "overdue" || status === "due-soon") &&
            !reminder.isDone &&
            !dismissedAlerts.has(String(reminder.id)),
        )
        .map(({ reminder }) => reminder),
    [enriched, dismissedAlerts],
  );

  // Counts for tabs
  const counts = useMemo(() => {
    const upcoming = enriched.filter(
      ({ status }) => status === "upcoming" || status === "due-soon",
    ).length;
    const overdue = enriched.filter(
      ({ status }) => status === "overdue",
    ).length;
    const done = enriched.filter(({ status }) => status === "done").length;
    return { all: enriched.length, upcoming, overdue, done };
  }, [enriched]);

  // Filtered list
  const filtered = useMemo(() => {
    if (filter === "all") return enriched;
    if (filter === "upcoming")
      return enriched.filter(
        ({ status }) => status === "upcoming" || status === "due-soon",
      );
    if (filter === "overdue")
      return enriched.filter(({ status }) => status === "overdue");
    if (filter === "done")
      return enriched.filter(({ status }) => status === "done");
    return enriched;
  }, [enriched, filter]);

  // Sort: overdue first, then due-soon, then upcoming by time, done last
  const sorted = useMemo(() => {
    const order: Record<ReminderStatus, number> = {
      overdue: 0,
      "due-soon": 1,
      upcoming: 2,
      done: 3,
    };
    return [...filtered].sort((a, b) => {
      const oDiff = order[a.status] - order[b.status];
      if (oDiff !== 0) return oDiff;
      return Number(a.reminder.remindAt - b.reminder.remindAt);
    });
  }, [filtered]);

  function openAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(r: Reminder) {
    setEditTarget(r);
    setFormOpen(true);
  }

  function openDelete(r: Reminder) {
    setDeleteTarget(r);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteReminder.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  function dismissAlerts() {
    setDismissedAlerts(new Set(alertReminders.map((r) => String(r.id))));
  }

  const emptyMsg = EMPTY_MESSAGES[filter];

  return (
    <Layout title="Reminders" subtitle="Stay on schedule">
      <div className="mx-auto max-w-3xl space-y-5" data-ocid="reminders.page">
        {/* Alert banner */}
        <AlertBanner reminders={alertReminders} onDismiss={dismissAlerts} />

        {/* Header row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Reminders
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Schedule and track hostel tasks and payment deadlines
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
            data-ocid="reminders.add_button"
          >
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
          <TabsList
            className="bg-card border border-border h-auto p-1 gap-0.5"
            data-ocid="reminders.filter_tabs"
          >
            {(["all", "upcoming", "overdue", "done"] as FilterTab[]).map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground capitalize text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1.5"
                  data-ocid={`reminders.filter_tab.${tab}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {counts[tab] > 0 && (
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-1.5 py-0 text-xs font-bold",
                        tab === "overdue"
                          ? "bg-destructive/20 text-destructive"
                          : tab === "upcoming"
                            ? "bg-orange-500/15 text-orange-400"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {counts[tab]}
                    </span>
                  )}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>

        {/* List */}
        <div
          className="rounded-lg border border-border bg-card overflow-hidden"
          data-ocid="reminders.list"
        >
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4">
                  <Skeleton className="h-3 w-3 rounded-full mt-1 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-72" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="empty-state py-16"
              data-ocid="reminders.empty_state"
            >
              <span className="empty-state-icon">{emptyMsg.icon}</span>
              <p className="empty-state-title">{emptyMsg.title}</p>
              <p className="empty-state-description">{emptyMsg.desc}</p>
              {filter === "all" && (
                <Button
                  onClick={openAdd}
                  className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
                  data-ocid="reminders.empty_add_button"
                >
                  <Plus className="h-4 w-4" />
                  Add Reminder
                </Button>
              )}
            </div>
          ) : (
            <div
              className="divide-y divide-border/60 px-4 py-2"
              data-ocid="reminders.items_list"
            >
              {sorted.map(({ reminder, status }, idx) => (
                <div
                  key={String(reminder.id)}
                  className="py-3 first:pt-2 last:pb-2"
                >
                  <ReminderCard
                    reminder={reminder}
                    status={status}
                    now={now}
                    index={idx + 1}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form dialog */}
      <ReminderFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        editing={editTarget}
      />

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteReminder.isPending}
      />
    </Layout>
  );
}

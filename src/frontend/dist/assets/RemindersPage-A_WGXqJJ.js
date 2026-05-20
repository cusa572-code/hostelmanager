import { r as reactExports, j as jsxRuntimeExports, B as Button, a as cn, S as Skeleton } from "./index-BHGx-AOT.js";
import { m as useReminders, n as useDeleteReminder, L as Layout, X, o as CircleAlert, p as Clock, q as Bell, r as useMarkReminderDone, l as Badge, T as Trash2, s as useAddReminder, t as useUpdateReminder } from "./Layout-eWnk62al.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-tGAYEJgV.js";
import { T as Textarea } from "./textarea-BIpkTMUK.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { B as BellRing, P as Pencil } from "./pencil-C1W4KmrG.js";
import { C as CircleCheck } from "./circle-check-Bi5fukHs.js";
import { C as Check } from "./check-CR3PGC7v.js";
import "./index-zxbJdcQE.js";
import "./index-DgyCW3I_.js";
import "./index-CndKChVc.js";
function getStatus(reminder, now) {
  if (reminder.isDone) return "done";
  const remindAtMs = Number(reminder.remindAt) / 1e6;
  const diffMs = remindAtMs - now;
  if (diffMs < 0) return "overdue";
  if (diffMs < 60 * 60 * 1e3) return "due-soon";
  return "upcoming";
}
function formatRelativeTime(reminder, now) {
  const remindAtMs = Number(reminder.remindAt) / 1e6;
  const diffMs = remindAtMs - now;
  const absDiff = Math.abs(diffMs);
  const minutes = Math.floor(absDiff / 6e4);
  const hours = Math.floor(absDiff / 36e5);
  const days = Math.floor(absDiff / 864e5);
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
function formatDateTime(remindAt) {
  const ms = Number(remindAt) / 1e6;
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function toDateTimeLocal(remindAt) {
  const ms = Number(remindAt) / 1e6;
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function nowPlusHour() {
  const d = new Date(Date.now() + 36e5);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    className: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary"
  },
  "due-soon": {
    label: "Due Soon",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dot: "bg-orange-400"
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    dot: "bg-destructive"
  },
  done: {
    label: "Done",
    className: "bg-muted/60 text-muted-foreground border-border",
    dot: "bg-muted-foreground"
  }
};
function ReminderFormDialog({ open, onClose, editing }) {
  const [title, setTitle] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [dateTime, setDateTime] = reactExports.useState(nowPlusHour());
  const addReminder = useAddReminder();
  const updateReminder = useUpdateReminder();
  const titleRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
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
      setTimeout(() => {
        var _a;
        return (_a = titleRef.current) == null ? void 0 : _a.focus();
      }, 80);
    }
  }, [open, editing]);
  const isPending = addReminder.isPending || updateReminder.isPending;
  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const remindAtMs = new Date(dateTime).getTime();
    const remindAtNs = BigInt(remindAtMs) * 1000000n;
    if (editing) {
      updateReminder.mutate(
        {
          id: editing.id,
          title: title.trim(),
          message: message.trim(),
          remindAt: remindAtNs
        },
        { onSuccess: onClose }
      );
    } else {
      addReminder.mutate(
        { title: title.trim(), message: message.trim(), remindAt: remindAtNs },
        { onSuccess: onClose }
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md bg-card border-border",
      "data-ocid": "reminders.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: editing ? "Edit Reminder" : "New Reminder" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "form-label", htmlFor: "reminder-title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reminder-title",
                ref: titleRef,
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "e.g. Collect rent from Room 5",
                className: "bg-background border-border focus-visible:ring-primary",
                maxLength: 120,
                required: true,
                "data-ocid": "reminders.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "form-label", htmlFor: "reminder-message", children: "Message / Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "reminder-message",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                placeholder: "Add any additional details…",
                className: "bg-background border-border focus-visible:ring-primary resize-none",
                rows: 3,
                maxLength: 500,
                "data-ocid": "reminders.message_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "form-label", htmlFor: "reminder-datetime", children: "Date & Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reminder-datetime",
                type: "datetime-local",
                value: dateTime,
                onChange: (e) => setDateTime(e.target.value),
                className: "bg-background border-border focus-visible:ring-primary",
                required: true,
                "data-ocid": "reminders.datetime_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: onClose,
                disabled: isPending,
                "data-ocid": "reminders.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isPending || !title.trim(),
                className: "bg-primary text-primary-foreground hover:opacity-90",
                "data-ocid": "reminders.submit_button",
                children: isPending ? "Saving…" : editing ? "Save Changes" : "Add Reminder"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm bg-card border-border",
      "data-ocid": "reminders.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: "Delete Reminder" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "This reminder will be permanently deleted. This cannot be undone." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onClose,
              disabled: isDeleting,
              "data-ocid": "reminders.delete_cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: onConfirm,
              disabled: isDeleting,
              "data-ocid": "reminders.delete_confirm_button",
              children: isDeleting ? "Deleting…" : "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function AlertBanner({ reminders, onDismiss }) {
  if (reminders.length === 0) return null;
  const count = reminders.length;
  const first = reminders[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-3 mb-5 animate-in slide-in-from-top-2 duration-300",
      role: "alert",
      "data-ocid": "reminders.alert_banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-5 w-5 shrink-0 text-orange-400 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-orange-300", children: count === 1 ? "Reminder triggered!" : `${count} reminders triggered!` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-orange-400/80 truncate mt-0.5", children: [
            first.title,
            count > 1 && ` and ${count - 1} more`
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            className: "shrink-0 text-orange-400/60 hover:text-orange-400 transition-smooth",
            "aria-label": "Dismiss alert",
            "data-ocid": "reminders.alert_dismiss_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}
function ReminderCard({
  reminder,
  status,
  now,
  index,
  onEdit,
  onDelete
}) {
  const cfg = STATUS_CONFIG[status];
  const markDone = useMarkReminderDone();
  const isMarkingDone = markDone.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "reminder-card group flex items-start gap-4",
        status === "done" && "opacity-60"
      ),
      "data-ocid": `reminders.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center pt-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "h-2.5 w-2.5 rounded-full ring-2 ring-background",
                cfg.dot
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 w-px flex-1 bg-border min-h-[1.5rem]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: cn(
                    "font-semibold text-sm text-foreground truncate",
                    status === "done" && "line-through text-muted-foreground"
                  ),
                  children: reminder.title
                }
              ),
              reminder.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: reminder.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: cn(
                  "shrink-0 border text-xs font-semibold px-2 py-0.5",
                  cfg.className
                ),
                "data-ocid": `reminders.status_badge.${index}`,
                children: cfg.label
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                formatDateTime(reminder.remindAt)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-medium",
                    status === "overdue" && "text-destructive",
                    status === "due-soon" && "text-orange-400",
                    status === "upcoming" && "text-primary",
                    status === "done" && "text-muted-foreground"
                  ),
                  children: formatRelativeTime(reminder, now)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-buttons", children: [
              !reminder.isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => markDone.mutate(reminder.id),
                  disabled: isMarkingDone,
                  className: "btn-ghost h-7 w-7 p-0 text-primary hover:bg-primary/10",
                  "aria-label": "Mark as done",
                  "data-ocid": `reminders.mark_done_button.${index}`,
                  title: "Mark as done",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" })
                }
              ),
              reminder.isDone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-500" }),
                "Done"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onEdit(reminder),
                  className: "btn-ghost h-7 w-7 p-0",
                  "aria-label": "Edit reminder",
                  "data-ocid": `reminders.edit_button.${index}`,
                  title: "Edit",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onDelete(reminder),
                  className: "btn-ghost h-7 w-7 p-0 text-destructive hover:bg-destructive/10",
                  "aria-label": "Delete reminder",
                  "data-ocid": `reminders.delete_button.${index}`,
                  title: "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
const EMPTY_MESSAGES = {
  all: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-12 w-12" }),
    title: "No reminders yet",
    desc: "Add your first reminder to stay on top of hostel tasks and deadlines."
  },
  upcoming: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-12 w-12" }),
    title: "No upcoming reminders",
    desc: "All clear! Add a new reminder to schedule your next task."
  },
  overdue: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-12 w-12" }),
    title: "No overdue reminders",
    desc: "Great job — everything is on track."
  },
  done: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12" }),
    title: "No completed reminders",
    desc: "Mark reminders as done when you've completed them."
  }
};
function RemindersPage() {
  const [filter, setFilter] = reactExports.useState("all");
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [dismissedAlerts, setDismissedAlerts] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [now, setNow] = reactExports.useState(() => Date.now());
  const { data: reminders = [], isLoading } = useReminders();
  const deleteReminder = useDeleteReminder();
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 6e4);
    return () => clearInterval(id);
  }, []);
  const enriched = reactExports.useMemo(
    () => reminders.map((r) => ({ reminder: r, status: getStatus(r, now) })),
    [reminders, now]
  );
  const alertReminders = reactExports.useMemo(
    () => enriched.filter(
      ({ reminder, status }) => (status === "overdue" || status === "due-soon") && !reminder.isDone && !dismissedAlerts.has(String(reminder.id))
    ).map(({ reminder }) => reminder),
    [enriched, dismissedAlerts]
  );
  const counts = reactExports.useMemo(() => {
    const upcoming = enriched.filter(
      ({ status }) => status === "upcoming" || status === "due-soon"
    ).length;
    const overdue = enriched.filter(
      ({ status }) => status === "overdue"
    ).length;
    const done = enriched.filter(({ status }) => status === "done").length;
    return { all: enriched.length, upcoming, overdue, done };
  }, [enriched]);
  const filtered = reactExports.useMemo(() => {
    if (filter === "all") return enriched;
    if (filter === "upcoming")
      return enriched.filter(
        ({ status }) => status === "upcoming" || status === "due-soon"
      );
    if (filter === "overdue")
      return enriched.filter(({ status }) => status === "overdue");
    if (filter === "done")
      return enriched.filter(({ status }) => status === "done");
    return enriched;
  }, [enriched, filter]);
  const sorted = reactExports.useMemo(() => {
    const order = {
      overdue: 0,
      "due-soon": 1,
      upcoming: 2,
      done: 3
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
  function openEdit(r) {
    setEditTarget(r);
    setFormOpen(true);
  }
  function openDelete(r) {
    setDeleteTarget(r);
  }
  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteReminder.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null)
    });
  }
  function dismissAlerts() {
    setDismissedAlerts(new Set(alertReminders.map((r) => String(r.id))));
  }
  const emptyMsg = EMPTY_MESSAGES[filter];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Reminders", subtitle: "Stay on schedule", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-5", "data-ocid": "reminders.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBanner, { reminders: alertReminders, onDismiss: dismissAlerts }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Reminders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Schedule and track hostel tasks and payment deadlines" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openAdd,
            className: "gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-smooth",
            "data-ocid": "reminders.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Add Reminder"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: filter, onValueChange: (v) => setFilter(v), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsList,
        {
          className: "bg-card border border-border h-auto p-1 gap-0.5",
          "data-ocid": "reminders.filter_tabs",
          children: ["all", "upcoming", "overdue", "done"].map(
            (tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: tab,
                className: "data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground capitalize text-xs sm:text-sm px-3 py-1.5 flex items-center gap-1.5",
                "data-ocid": `reminders.filter_tab.${tab}`,
                children: [
                  tab.charAt(0).toUpperCase() + tab.slice(1),
                  counts[tab] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "ml-0.5 rounded-full px-1.5 py-0 text-xs font-bold",
                        tab === "overdue" ? "bg-destructive/20 text-destructive" : tab === "upcoming" ? "bg-orange-500/15 text-orange-400" : "bg-muted text-muted-foreground"
                      ),
                      children: counts[tab]
                    }
                  )
                ]
              },
              tab
            )
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-lg border border-border bg-card overflow-hidden",
          "data-ocid": "reminders.list",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0 divide-y divide-border", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3 rounded-full mt-1 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-72" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-md" })
          ] }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "empty-state py-16",
              "data-ocid": "reminders.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-state-icon", children: emptyMsg.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-title", children: emptyMsg.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: emptyMsg.desc }),
                filter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: openAdd,
                    className: "gap-2 bg-primary text-primary-foreground hover:opacity-90",
                    "data-ocid": "reminders.empty_add_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      "Add Reminder"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "divide-y divide-border/60 px-4 py-2",
              "data-ocid": "reminders.items_list",
              children: sorted.map(({ reminder, status }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "py-3 first:pt-2 last:pb-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ReminderCard,
                    {
                      reminder,
                      status,
                      now,
                      index: idx + 1,
                      onEdit: openEdit,
                      onDelete: openDelete
                    }
                  )
                },
                String(reminder.id)
              ))
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReminderFormDialog,
      {
        open: formOpen,
        onClose: () => {
          setFormOpen(false);
          setEditTarget(null);
        },
        editing: editTarget
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: !!deleteTarget,
        onClose: () => setDeleteTarget(null),
        onConfirm: handleDeleteConfirm,
        isDeleting: deleteReminder.isPending
      }
    )
  ] });
}
export {
  RemindersPage as default
};

import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddNote,
  useAddReminder,
  useDeleteNote,
  useDeleteReminder,
  useMarkReminderDone,
  useNotes,
  useReminders,
  useUpdateNote,
  useUpdateReminder,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { Note, Reminder } from "@/types";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemindAt(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(ts: bigint): string {
  const d = new Date(Number(ts) / 1_000_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(val: string): bigint {
  return BigInt(new Date(val).getTime()) * 1_000_000n;
}

function isOverdue(ts: bigint): boolean {
  return Number(ts) / 1_000_000 < Date.now();
}

function isDueSoon(ts: bigint): boolean {
  const diff = Number(ts) / 1_000_000 - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

// ─── Note Form Dialog ─────────────────────────────────────────────────────────

interface NoteFormDialogProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
}

function NoteFormDialog({ open, onClose, note }: NoteFormDialogProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const addNote = useAddNote();
  const updateNote = useUpdateNote();

  const isEdit = !!note;
  const isPending = addNote.isPending || updateNote.isPending;

  useEffect(() => {
    if (open) {
      setTitle(note?.title ?? "");
      setContent(note?.content ?? "");
    }
  }, [open, note]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (isEdit) {
      await updateNote.mutateAsync({
        id: note.id,
        title: title.trim(),
        content: content.trim(),
      });
    } else {
      await addNote.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg" data-ocid="note.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEdit ? "Edit Note" : "New Note"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="note-title" className="form-label">
              Title
            </Label>
            <Input
              id="note-title"
              placeholder="Note title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
              data-ocid="note.title_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-content" className="form-label">
              Content
            </Label>
            <Textarea
              id="note-content"
              placeholder="Write your note here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea min-h-[120px]"
              data-ocid="note.content_textarea"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="note.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="btn-primary"
              data-ocid="note.submit_button"
            >
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Note Dialog ────────────────────────────────────────────────────────

interface DeleteNoteDialogProps {
  noteId: bigint | null;
  onClose: () => void;
}

function DeleteNoteDialog({ noteId, onClose }: DeleteNoteDialogProps) {
  const deleteNote = useDeleteNote();
  async function handleConfirm() {
    if (noteId == null) return;
    await deleteNote.mutateAsync(noteId);
    onClose();
  }
  return (
    <AlertDialog open={noteId != null} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent data-ocid="note.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This note will be permanently deleted and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="note.delete_cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteNote.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="note.delete_confirm_button"
          >
            {deleteNote.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (id: bigint) => void;
}

function NoteCard({ note, index, onEdit, onDelete }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.22,
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="note-card group relative flex flex-col gap-2"
      data-ocid={`note.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1 flex-1 min-w-0">
          {note.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="shrink-0 p-1 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-smooth opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Note actions"
              data-ocid={`note.more_button.${index + 1}`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => onEdit(note)}
              className="gap-2 cursor-pointer"
              data-ocid={`note.edit_button.${index + 1}`}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              data-ocid={`note.delete_button.${index + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content preview */}
      {note.content && (
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {note.content}
        </p>
      )}

      {/* Footer */}
      <p className="timestamp mt-auto pt-1 border-t border-border/50">
        {formatDate(
          note.updatedAt > note.createdAt ? note.updatedAt : note.createdAt,
        )}
      </p>
    </motion.div>
  );
}

// ─── Reminder Form Dialog ─────────────────────────────────────────────────────

interface ReminderFormDialogProps {
  open: boolean;
  onClose: () => void;
  reminder?: Reminder | null;
}

function ReminderFormDialog({
  open,
  onClose,
  reminder,
}: ReminderFormDialogProps) {
  const defaultTime = useMemo(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  const [title, setTitle] = useState(reminder?.title ?? "");
  const [message, setMessage] = useState(reminder?.message ?? "");
  const [remindAt, setRemindAt] = useState(
    reminder ? toDatetimeLocal(reminder.remindAt) : defaultTime,
  );

  const addReminder = useAddReminder();
  const updateReminder = useUpdateReminder();
  const isPending = addReminder.isPending || updateReminder.isPending;
  const isEdit = !!reminder;

  useEffect(() => {
    if (open) {
      setTitle(reminder?.title ?? "");
      setMessage(reminder?.message ?? "");
      setRemindAt(reminder ? toDatetimeLocal(reminder.remindAt) : defaultTime);
    }
  }, [open, reminder, defaultTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !remindAt) return;
    const remindAtNs = fromDatetimeLocal(remindAt);
    if (isEdit) {
      await updateReminder.mutateAsync({
        id: reminder.id,
        title: title.trim(),
        message: message.trim(),
        remindAt: remindAtNs,
      });
    } else {
      await addReminder.mutateAsync({
        title: title.trim(),
        message: message.trim(),
        remindAt: remindAtNs,
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg" data-ocid="reminder.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            {isEdit ? "Edit Reminder" : "New Reminder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="rem-title" className="form-label">
              Title
            </Label>
            <Input
              id="rem-title"
              placeholder="Reminder title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
              data-ocid="reminder.title_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rem-message" className="form-label">
              Message (optional)
            </Label>
            <Textarea
              id="rem-message"
              placeholder="Additional details…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea min-h-[80px]"
              data-ocid="reminder.message_textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rem-time" className="form-label">
              Remind at
            </Label>
            <Input
              id="rem-time"
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              className="form-input"
              required
              data-ocid="reminder.time_input"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="reminder.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !remindAt}
              className="btn-primary"
              data-ocid="reminder.submit_button"
            >
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Set Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Reminder Dialog ────────────────────────────────────────────────────

interface DeleteReminderDialogProps {
  reminderId: bigint | null;
  onClose: () => void;
}

function DeleteReminderDialog({
  reminderId,
  onClose,
}: DeleteReminderDialogProps) {
  const deleteReminder = useDeleteReminder();
  async function handleConfirm() {
    if (reminderId == null) return;
    await deleteReminder.mutateAsync(reminderId);
    onClose();
  }
  return (
    <AlertDialog
      open={reminderId != null}
      onOpenChange={(v) => !v && onClose()}
    >
      <AlertDialogContent data-ocid="reminder.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Reminder?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This reminder will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="reminder.delete_cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteReminder.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="reminder.delete_confirm_button"
          >
            {deleteReminder.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Reminder Card ─────────────────────────────────────────────────────────────

interface ReminderCardProps {
  reminder: Reminder;
  index: number;
  onEdit: (r: Reminder) => void;
  onDelete: (id: bigint) => void;
  onMarkDone: (id: bigint) => void;
}

function ReminderCard({
  reminder,
  index,
  onEdit,
  onDelete,
  onMarkDone,
}: ReminderCardProps) {
  const overdue = !reminder.isDone && isOverdue(reminder.remindAt);
  const soon = !reminder.isDone && !overdue && isDueSoon(reminder.remindAt);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.22,
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "reminder-card group relative flex items-start gap-3",
        reminder.isDone && "opacity-60",
      )}
      data-ocid={`reminder.item.${index + 1}`}
    >
      {/* Status dot */}
      <button
        type="button"
        onClick={() => !reminder.isDone && onMarkDone(reminder.id)}
        className={cn(
          "mt-0.5 shrink-0 rounded-full transition-smooth focus-ring",
          reminder.isDone
            ? "text-primary cursor-default"
            : overdue
              ? "text-destructive hover:text-destructive/80 cursor-pointer"
              : soon
                ? "text-yellow-400 hover:text-yellow-300 cursor-pointer"
                : "text-muted-foreground hover:text-primary cursor-pointer",
        )}
        aria-label={reminder.isDone ? "Done" : "Mark as done"}
        data-ocid={`reminder.done_toggle.${index + 1}`}
      >
        {reminder.isDone ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Clock className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium text-sm text-foreground line-clamp-1",
              reminder.isDone && "line-through text-muted-foreground",
            )}
          >
            {reminder.title}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {overdue && !reminder.isDone && (
              <Badge className="badge-overdue shrink-0">Overdue</Badge>
            )}
            {soon && !reminder.isDone && (
              <Badge className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-yellow-500/20 text-yellow-400 shrink-0">
                Due Soon
              </Badge>
            )}
            {!overdue && !soon && !reminder.isDone && (
              <Badge className="badge-upcoming shrink-0">Upcoming</Badge>
            )}
            {reminder.isDone && (
              <Badge className="badge-completed shrink-0">Done</Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-smooth opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Reminder actions"
                  data-ocid={`reminder.more_button.${index + 1}`}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {!reminder.isDone && (
                  <DropdownMenuItem
                    onClick={() => onMarkDone(reminder.id)}
                    className="gap-2 cursor-pointer"
                    data-ocid={`reminder.mark_done.${index + 1}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Done
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onEdit(reminder)}
                  className="gap-2 cursor-pointer"
                  data-ocid={`reminder.edit_button.${index + 1}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(reminder.id)}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  data-ocid={`reminder.delete_button.${index + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {reminder.message && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {reminder.message}
          </p>
        )}
        <p className="timestamp mt-1 flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          {formatRemindAt(reminder.remindAt)}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { data: notes = [], isLoading: notesLoading } = useNotes();
  const { data: reminders = [], isLoading: remindersLoading } = useReminders();
  const markDone = useMarkReminderDone();

  const [noteSearch, setNoteSearch] = useState("");
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<bigint | null>(null);

  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingReminderId, setDeletingReminderId] = useState<bigint | null>(
    null,
  );

  const filteredNotes = useMemo(() => {
    const q = noteSearch.toLowerCase().trim();
    if (!q) return [...notes].sort((a, b) => Number(b.updatedAt - a.updatedAt));
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
      .sort((a, b) => Number(b.updatedAt - a.updatedAt));
  }, [notes, noteSearch]);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return Number(a.remindAt - b.remindAt);
    });
  }, [reminders]);

  const pendingCount = reminders.filter((r) => !r.isDone).length;
  const overdueCount = reminders.filter(
    (r) => !r.isDone && isOverdue(r.remindAt),
  ).length;

  return (
    <Layout>
      <div
        className="flex h-full min-h-0 flex-col gap-0"
        data-ocid="notes.page"
      >
        {/* Page header */}
        <div className="border-b border-border bg-card px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
                Notes & Reminders
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Keep track of important tasks and time-sensitive alerts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setEditingReminder(null);
                  setReminderFormOpen(true);
                }}
                data-ocid="reminder.add_button"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Add Reminder</span>
              </Button>
              <Button
                size="sm"
                className="gap-2 btn-primary"
                onClick={() => {
                  setEditingNote(null);
                  setNoteFormOpen(true);
                }}
                data-ocid="note.add_button"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Note</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
          {/* ── Notes column ── */}
          <section
            className="flex flex-col flex-1 min-w-0 overflow-y-auto border-r border-border"
            data-ocid="notes.section"
          >
            {/* Notes header + search */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-3 shrink-0">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-sm font-bold text-foreground">
                    Notes
                  </h2>
                  {notes.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {notes.length}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search notes…"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="pl-9 h-8 text-sm form-input"
                  data-ocid="notes.search_input"
                />
                {noteSearch && (
                  <button
                    type="button"
                    onClick={() => setNoteSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notes list */}
            <div className="flex-1 p-5">
              {notesLoading ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  data-ocid="notes.loading_state"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="note-card space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/3 mt-2" />
                    </div>
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state"
                  data-ocid="notes.empty_state"
                >
                  <div className="empty-state-icon">
                    <StickyNote className="h-12 w-12 mx-auto opacity-30" />
                  </div>
                  <p className="empty-state-title">
                    {noteSearch ? "No notes found" : "No notes yet"}
                  </p>
                  <p className="empty-state-description">
                    {noteSearch
                      ? "Try a different search term"
                      : "Add your first note to keep track of important hostel information"}
                  </p>
                  {!noteSearch && (
                    <Button
                      size="sm"
                      className="btn-primary gap-2"
                      onClick={() => {
                        setEditingNote(null);
                        setNoteFormOpen(true);
                      }}
                      data-ocid="notes.empty_add_button"
                    >
                      <Plus className="h-4 w-4" />
                      Add Note
                    </Button>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredNotes.map((note, i) => (
                      <NoteCard
                        key={String(note.id)}
                        note={note}
                        index={i}
                        onEdit={(n) => {
                          setEditingNote(n);
                          setNoteFormOpen(true);
                        }}
                        onDelete={(id) => setDeletingNoteId(id)}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </section>

          {/* ── Reminders column ── */}
          <section
            className="flex flex-col w-full lg:w-[380px] xl:w-[420px] shrink-0 overflow-y-auto"
            data-ocid="reminders.section"
          >
            {/* Reminders header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-sm font-bold text-foreground">
                    Reminders
                  </h2>
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {pendingCount} pending
                    </Badge>
                  )}
                </div>
                {overdueCount > 0 && (
                  <Badge className="badge-overdue gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {overdueCount} overdue
                  </Badge>
                )}
              </div>
            </div>

            {/* Reminders list */}
            <div className="flex-1 p-5">
              {remindersLoading ? (
                <div className="space-y-3" data-ocid="reminders.loading_state">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="reminder-card flex items-start gap-3"
                    >
                      <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedReminders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state"
                  data-ocid="reminders.empty_state"
                >
                  <div className="empty-state-icon">
                    <Bell className="h-12 w-12 mx-auto opacity-30" />
                  </div>
                  <p className="empty-state-title">No reminders</p>
                  <p className="empty-state-description">
                    Set reminders for rent due dates, maintenance tasks, and
                    more
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setEditingReminder(null);
                      setReminderFormOpen(true);
                    }}
                    data-ocid="reminders.empty_add_button"
                  >
                    <Plus className="h-4 w-4" />
                    Set Reminder
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {sortedReminders.map((r, i) => (
                      <ReminderCard
                        key={String(r.id)}
                        reminder={r}
                        index={i}
                        onEdit={(rem) => {
                          setEditingReminder(rem);
                          setReminderFormOpen(true);
                        }}
                        onDelete={(id) => setDeletingReminderId(id)}
                        onMarkDone={(id) => markDone.mutate(id)}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Dialogs */}
      <NoteFormDialog
        open={noteFormOpen}
        onClose={() => {
          setNoteFormOpen(false);
          setEditingNote(null);
        }}
        note={editingNote}
      />
      <DeleteNoteDialog
        noteId={deletingNoteId}
        onClose={() => setDeletingNoteId(null)}
      />
      <ReminderFormDialog
        open={reminderFormOpen}
        onClose={() => {
          setReminderFormOpen(false);
          setEditingReminder(null);
        }}
        reminder={editingReminder}
      />
      <DeleteReminderDialog
        reminderId={deletingReminderId}
        onClose={() => setDeletingReminderId(null)}
      />
    </Layout>
  );
}

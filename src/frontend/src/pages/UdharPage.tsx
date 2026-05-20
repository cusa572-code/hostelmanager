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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useCreateUdharEntry,
  useDeleteUdharEntry,
  useMarkUdharPaid,
  useStudentUdhar,
  useStudents,
  useUdharEntries,
} from "@/hooks/useQueries";
import { UdharCategory } from "@/types";
import type { StudentSummary, UdharEntry, UdharInput } from "@/types";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Milk,
  Plus,
  ShoppingBasket,
  Tag,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: bigint): string {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function fmtDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type CatFilter = "all" | UdharCategory;

const CAT_META: Record<
  UdharCategory,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  [UdharCategory.milk]: {
    label: "Milk",
    icon: <Milk className="h-3.5 w-3.5" />,
    cls: "border-blue-400/30 bg-blue-400/10 text-blue-400",
  },
  [UdharCategory.grocery]: {
    label: "Grocery",
    icon: <ShoppingBasket className="h-3.5 w-3.5" />,
    cls: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  [UdharCategory.other]: {
    label: "Other",
    icon: <Tag className="h-3.5 w-3.5" />,
    cls: "border-border bg-muted/50 text-muted-foreground",
  },
};

function CategoryBadge({ cat }: { cat: UdharCategory }) {
  const { label, icon, cls } = CAT_META[cat] ?? CAT_META[UdharCategory.other];
  return (
    <Badge className={`gap-1 text-xs ${cls}`}>
      {icon}
      {label}
    </Badge>
  );
}

// ─── Add Udhar Dialog ─────────────────────────────────────────────────────────

interface AddDialogProps {
  open: boolean;
  onClose: () => void;
  prefilledStudentId?: string;
}

function AddUdharDialog({ open, onClose, prefilledStudentId }: AddDialogProps) {
  const { data: students = [] } = useStudents();
  const create = useCreateUdharEntry();
  const today = new Date().toISOString().split("T")[0];

  const [sid, setSid] = useState(prefilledStudentId ?? "");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<UdharCategory>(UdharCategory.other);
  const [date, setDate] = useState(today);

  function reset() {
    setSid(prefilledStudentId ?? "");
    setDescription("");
    setAmount("");
    setCategory(UdharCategory.other);
    setDate(today);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: UdharInput = {
      studentId: BigInt(sid),
      description,
      amount: BigInt(amount),
      category,
      date: BigInt(new Date(date).getTime()) * 1_000_000n,
    };
    create.mutate(input, { onSuccess: handleClose });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent data-ocid="udhar.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Add Udhar Entry
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {!prefilledStudentId && (
            <div className="space-y-1.5">
              <Label>Student *</Label>
              <Select value={sid} onValueChange={setSid} required>
                <SelectTrigger data-ocid="udhar.student_select">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id.toString()} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ud-desc">Description *</Label>
            <Input
              id="ud-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Daily milk, grocery items…"
              required
              data-ocid="udhar.description_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ud-amount">Amount (₹) *</Label>
              <Input
                id="ud-amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                data-ocid="udhar.amount_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as UdharCategory)}
              >
                <SelectTrigger data-ocid="udhar.category_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UdharCategory.milk}>🥛 Milk</SelectItem>
                  <SelectItem value={UdharCategory.grocery}>
                    🛒 Grocery
                  </SelectItem>
                  <SelectItem value={UdharCategory.other}>📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ud-date">Date</Label>
            <Input
              id="ud-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-ocid="udhar.date_input"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              data-ocid="udhar.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || !sid || !amount || !description}
              data-ocid="udhar.submit_button"
            >
              {create.isPending ? "Saving…" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteConfirmProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
  isPending,
}: DeleteConfirmProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent data-ocid="udhar.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Udhar Entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This entry will be permanently removed. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            data-ocid="udhar.delete_cancel_button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="udhar.delete_confirm_button"
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Single Udhar Entry Row ───────────────────────────────────────────────────

function UdharEntryRow({
  entry,
  index,
  onDeleteRequest,
}: {
  entry: UdharEntry;
  index: number;
  onDeleteRequest: (id: bigint) => void;
}) {
  const markPaid = useMarkUdharPaid();

  return (
    <div
      className={`udhar-entry group ${entry.isPaid ? "opacity-60" : ""}`}
      data-ocid={`udhar.item.${index + 1}`}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge cat={entry.category} />
          {entry.isPaid && (
            <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary text-xs">
              <CheckCircle2 className="h-3 w-3" /> Paid
            </Badge>
          )}
        </div>
        <p
          className={`text-sm font-medium ${entry.isPaid ? "line-through text-muted-foreground" : "text-foreground"}`}
        >
          {entry.description}
        </p>
        <p className="text-xs text-muted-foreground">{fmtDate(entry.date)}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-sm font-bold tabular-nums ${entry.isPaid ? "line-through text-muted-foreground" : "text-foreground"}`}
        >
          {fmt(entry.amount)}
        </span>

        {!entry.isPaid && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => markPaid.mutate(entry.id)}
            disabled={markPaid.isPending}
            data-ocid={`udhar.mark_paid_button.${index + 1}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mark Paid
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
          onClick={() => onDeleteRequest(entry.id)}
          aria-label="Delete entry"
          data-ocid={`udhar.delete_button.${index + 1}`}
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Student Ledger View ──────────────────────────────────────────────────────

function StudentLedger({
  student,
  onBack,
  onAddEntry,
}: {
  student: StudentSummary;
  onBack: () => void;
  onAddEntry: () => void;
}) {
  const { data: summary, isLoading } = useStudentUdhar(student.id);
  const deleteEntry = useDeleteUdharEntry();

  const [catFilter, setCatFilter] = useState<CatFilter>("all");
  const [paidFilter, setPaidFilter] = useState<"unpaid" | "paid" | "all">(
    "all",
  );
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const entries = summary?.entries ?? [];

  const filtered = entries.filter((e) => {
    const matchCat = catFilter === "all" || e.category === catFilter;
    const matchPaid =
      paidFilter === "all" ||
      (paidFilter === "paid" && e.isPaid) ||
      (paidFilter === "unpaid" && !e.isPaid);
    return matchCat && matchPaid;
  });

  const outstanding = summary?.totalOutstanding ?? 0n;
  const totalPaid = entries
    .filter((e) => e.isPaid)
    .reduce((s, e) => s + e.amount, 0n);
  const totalUnpaid = entries
    .filter((e) => !e.isPaid)
    .reduce((s, e) => s + e.amount, 0n);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={onBack}
          data-ocid="udhar.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-foreground truncate">
            {student.name}
          </h2>
          {student.roomNumber && (
            <p className="text-xs text-muted-foreground">
              Room {student.roomNumber}
            </p>
          )}
        </div>
        <Button
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={onAddEntry}
          data-ocid="udhar.ledger_add_button"
        >
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`rounded-lg border px-4 py-3 ${outstanding > 0n ? "border-red-500/20 bg-red-500/5" : "border-primary/20 bg-primary/5"}`}
        >
          <p
            className={`text-xs font-medium ${outstanding > 0n ? "text-red-400/80" : "text-primary/80"}`}
          >
            Outstanding
          </p>
          <p
            className={`mt-0.5 text-xl font-bold tabular-nums ${outstanding > 0n ? "text-red-400" : "text-primary"}`}
          >
            {fmt(outstanding)}
          </p>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-medium text-primary/80">Paid</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-primary">
            {fmt(totalPaid)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Total</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
            {fmt(totalPaid + totalUnpaid)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div
          className="flex gap-1 rounded-lg bg-muted/40 p-1"
          data-ocid="udhar.category_filter"
        >
          {(
            [
              "all",
              UdharCategory.milk,
              UdharCategory.grocery,
              UdharCategory.other,
            ] as CatFilter[]
          ).map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-smooth ${
                catFilter === cat
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`udhar.cat_tab.${cat}`}
            >
              {cat === "all"
                ? "All"
                : (CAT_META[cat as UdharCategory]?.label ?? cat)}
            </button>
          ))}
        </div>

        {/* Paid/Unpaid toggle */}
        <div
          className="flex gap-1 rounded-lg bg-muted/40 p-1"
          data-ocid="udhar.paid_filter"
        >
          {(["all", "unpaid", "paid"] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setPaidFilter(f)}
              className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-smooth ${
                paidFilter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`udhar.paid_tab.${f}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Entry list */}
      {isLoading ? (
        <div className="space-y-2" data-ocid="udhar.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center"
          data-ocid="udhar.ledger_empty_state"
        >
          <CreditCard className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">
            {entries.length === 0
              ? "No entries yet"
              : "No entries match the filter"}
          </p>
          {entries.length === 0 && (
            <Button
              size="sm"
              className="gap-2"
              onClick={onAddEntry}
              data-ocid="udhar.ledger_empty_add_button"
            >
              <Plus className="h-4 w-4" /> Add First Entry
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, i) => (
            <UdharEntryRow
              key={entry.id.toString()}
              entry={entry}
              index={i}
              onDeleteRequest={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget !== null) {
            deleteEntry.mutate(deleteTarget, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        isPending={deleteEntry.isPending}
      />
    </div>
  );
}

// ─── All-Students Summary Card ────────────────────────────────────────────────

function StudentUdharCard({
  student,
  entries,
  onClick,
}: {
  student: StudentSummary;
  entries: UdharEntry[];
  onClick: () => void;
}) {
  const outstanding = entries
    .filter((e) => !e.isPaid)
    .reduce((s, e) => s + e.amount, 0n);
  const entryCount = entries.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:bg-card/80 focus-ring"
      data-ocid={`udhar.student_card.${student.id.toString()}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {student.name}
          </p>
          {student.roomNumber ? (
            <p className="text-xs text-muted-foreground">
              Room {student.roomNumber}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {entryCount} entr{entryCount === 1 ? "y" : "ies"}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p
            className={`text-base font-bold tabular-nums ${outstanding > 0n ? "text-red-400" : "text-primary"}`}
          >
            {fmt(outstanding)}
          </p>
          <p className="text-xs text-muted-foreground">
            {outstanding > 0n ? "outstanding" : "all clear"}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UdharPage() {
  const { data: entries = [], isLoading } = useUdharEntries();
  const { data: students = [] } = useStudents();
  const { t } = useLanguage();

  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Aggregate per-student
  const studentsWithUdhar = students
    .map((s) => ({
      student: s,
      entries: entries.filter((e) => e.studentId === s.id),
    }))
    .filter(({ entries: es }) => es.length > 0);

  const totalOutstanding = entries
    .filter((e) => !e.isPaid)
    .reduce((s, e) => s + e.amount, 0n);
  const studentsWithDebt = studentsWithUdhar.filter(({ entries: es }) =>
    es.some((e) => !e.isPaid),
  ).length;

  return (
    <Layout title={t("udhar")} subtitle="Track daily credit given to students">
      <div className="space-y-6">
        {/* If a student is selected, show their ledger */}
        {selectedStudent ? (
          <StudentLedger
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onAddEntry={() => setDialogOpen(true)}
          />
        ) : (
          <>
            {/* Page header with stats + add button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3 flex-wrap">
                <div
                  className={`rounded-lg border px-4 py-3 ${totalOutstanding > 0n ? "border-red-500/20 bg-red-500/5" : "border-primary/20 bg-primary/5"}`}
                >
                  <p
                    className={`text-xs font-medium ${totalOutstanding > 0n ? "text-red-400/80" : "text-primary/80"}`}
                  >
                    {t("outstanding")}
                  </p>
                  <p
                    className={`mt-0.5 text-2xl font-bold tabular-nums ${totalOutstanding > 0n ? "text-red-400" : "text-primary"}`}
                  >
                    {fmt(totalOutstanding)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Students with Udhar
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold text-foreground">
                      {studentsWithDebt}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className="gap-2 shrink-0"
                onClick={() => setDialogOpen(true)}
                data-ocid="udhar.add_button"
              >
                <Plus className="h-4 w-4" /> {t("addUdhar")}
              </Button>
            </div>

            {/* Student cards grid or empty state */}
            {isLoading ? (
              <div
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                data-ocid="udhar.loading_state"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : studentsWithUdhar.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-20 text-center"
                data-ocid="udhar.empty_state"
              >
                <Wallet className="h-12 w-12 text-muted-foreground/30" />
                <div>
                  <p className="font-semibold text-foreground">
                    No udhar entries yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start tracking credit given to students — milk, grocery, and
                    more.
                  </p>
                </div>
                <Button
                  className="mt-2 gap-2"
                  onClick={() => setDialogOpen(true)}
                  data-ocid="udhar.empty_add_button"
                >
                  <Plus className="h-4 w-4" /> {t("addUdhar")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {studentsWithUdhar.map(({ student, entries: es }) => (
                  <StudentUdharCard
                    key={student.id.toString()}
                    student={student}
                    entries={es}
                    onClick={() => setSelectedStudent(student)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add entry dialog */}
      <AddUdharDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        prefilledStudentId={selectedStudent?.id.toString()}
      />
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useCreatePayment,
  useDeletePayment,
  useHostelSettings,
  usePayments,
  useSeatConfig,
  useStudent,
  useStudents,
  useUpdateHostelSettings,
  useUpdatePayment,
} from "@/hooks/useQueries";
import { PaymentStatus, SeatType } from "@/types";
import type {
  HostelSettings,
  Payment,
  PaymentId,
  PaymentInput,
  StudentSummary,
} from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit2,
  IndianRupee,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: bigint): string {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function fmtNum(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function calcOverdueDays(year: number, month: number): number {
  const dueDate = new Date(year, month - 1, 1); // 1st of month
  const now = new Date();
  if (now <= dueDate) return 0;
  return Math.max(
    0,
    Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function calcLateFee(overdueDays: number, lateFeePerMonth: number): number {
  return Math.floor(overdueDays / 30) * lateFeePerMonth;
}

function suggestStatus(paid: number, due: number): PaymentStatus {
  if (paid <= 0) return PaymentStatus.pending;
  if (paid >= due) return PaymentStatus.paid;
  return PaymentStatus.partial;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useLanguage();
  if (status === PaymentStatus.paid)
    return (
      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <CheckCircle2 className="h-3 w-3" /> {t("paid")}
      </span>
    );
  if (status === PaymentStatus.partial)
    return (
      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
        <Clock className="h-3 w-3" /> {t("partial")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-destructive/15 text-destructive border border-destructive/25">
      <AlertCircle className="h-3 w-3" /> {t("pending")}
    </span>
  );
}

// ─── Hostel Settings Modal ────────────────────────────────────────────────────

function SettingsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { data: settings } = useHostelSettings();
  const update = useUpdateHostelSettings();
  const [lateFee, setLateFee] = useState("100");

  useEffect(() => {
    if (settings) setLateFee(String(Number(settings.lateFeePerMonth)));
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const s: HostelSettings = {
      lateFeePerMonth: BigInt(Math.round(Number(lateFee) || 0)),
    };
    update.mutate(s, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="settings.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> Hostel Settings
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="st-latefee">Late Fee Per Month (₹)</Label>
            <Input
              id="st-latefee"
              type="number"
              min="0"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              placeholder="e.g. 100"
              data-ocid="settings.late_fee_input"
            />
            <p className="text-xs text-muted-foreground">
              Applied per 30-day overdue period per payment
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="settings.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={update.isPending}
              data-ocid="settings.save_button"
            >
              {update.isPending ? "Saving…" : "Save Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Payment Form (Add / Edit) ────────────────────────────────────────────────

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  students: StudentSummary[];
  editPayment?: Payment | null;
}

function getDefaultMonth(): string {
  return String(new Date().getMonth() + 1);
}
function getDefaultYear(): string {
  return String(new Date().getFullYear());
}

function PaymentFormModal({
  open,
  onClose,
  students,
  editPayment,
}: PaymentFormProps) {
  const create = useCreatePayment();
  const update = useUpdatePayment();
  const isEdit = !!editPayment;

  // Load owner-configured seat prices to auto-fill rent due
  const { data: seatConfig } = useSeatConfig();

  const [sid, setSid] = useState(editPayment?.studentId.toString() ?? "");
  const [month, setMonth] = useState(
    editPayment ? String(Number(editPayment.month)) : getDefaultMonth(),
  );
  const [year, setYear] = useState(
    editPayment ? String(Number(editPayment.year)) : getDefaultYear(),
  );
  const [rentDue, setRentDue] = useState(
    editPayment ? String(Number(editPayment.rentDue)) : "",
  );
  const [paidAmount, setPaidAmount] = useState(
    editPayment ? String(Number(editPayment.paidAmount)) : "0",
  );
  const [status, setStatus] = useState<PaymentStatus>(
    editPayment?.status ?? PaymentStatus.pending,
  );
  const [note, setNote] = useState(editPayment?.note ?? "");

  // Fetch full student to get seatType when a student is selected
  const studentIdBigInt = sid ? BigInt(sid) : 0n;
  const { data: selectedStudent } = useStudent(studentIdBigInt);

  // Reset form when editPayment changes or dialog opens
  useEffect(() => {
    if (editPayment) {
      setSid(editPayment.studentId.toString());
      setMonth(String(Number(editPayment.month)));
      setYear(String(Number(editPayment.year)));
      setRentDue(String(Number(editPayment.rentDue)));
      setPaidAmount(String(Number(editPayment.paidAmount)));
      setStatus(editPayment.status);
      setNote(editPayment.note ?? "");
    } else {
      setSid("");
      setMonth(getDefaultMonth());
      setYear(getDefaultYear());
      setRentDue("");
      setPaidAmount("0");
      setStatus(PaymentStatus.pending);
      setNote("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPayment]);

  // Auto-fill rent based on selected student's seatType using owner-configured prices
  const handleStudentChange = (val: string) => {
    setSid(val);
    // rentDue will be updated via useEffect once selectedStudent loads
  };

  // When selectedStudent data loads (after student selection), auto-fill rent
  // from owner-configured seatConfig prices — leave blank if not configured
  useEffect(() => {
    if (!sid || isEdit) return;
    if (selectedStudent) {
      const configuredPrice =
        selectedStudent.seatType === SeatType.typeB
          ? seatConfig?.pricePerSeatB
          : seatConfig?.pricePerSeatA;
      const priceNum = configuredPrice ? Number(configuredPrice) : 0;
      setRentDue(priceNum > 0 ? String(priceNum) : "");
    }
  }, [selectedStudent, sid, isEdit, seatConfig]);

  // Auto-suggest status when paidAmount changes
  const handlePaidAmountChange = (val: string) => {
    setPaidAmount(val);
    const paid = Number(val) || 0;
    const due = Number(rentDue) || 0;
    if (due > 0) setStatus(suggestStatus(paid, due));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: PaymentInput = {
      studentId: BigInt(sid),
      month: BigInt(month),
      year: BigInt(year),
      rentDue: BigInt(Math.round(Number(rentDue) || 0)),
      paidAmount: BigInt(Math.round(Number(paidAmount) || 0)),
      status,
      note: note.trim() || undefined,
    };
    if (isEdit && editPayment) {
      update.mutate({ id: editPayment.id, input }, { onSuccess: onClose });
    } else {
      create.mutate(input, { onSuccess: onClose });
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="payments.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            {isEdit ? "Edit Payment" : "Record Payment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Student */}
          <div className="space-y-1.5">
            <Label>Student *</Label>
            <Select
              value={sid}
              onValueChange={handleStudentChange}
              required
              disabled={isEdit}
            >
              <SelectTrigger data-ocid="payments.student_select">
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

          {/* Month / Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Month</Label>
              <Select value={month} onValueChange={setMonth} disabled={isEdit}>
                <SelectTrigger data-ocid="payments.month_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="py-year">Year</Label>
              <Input
                id="py-year"
                type="number"
                min="2020"
                max="2099"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isEdit}
                data-ocid="payments.year_input"
              />
            </div>
          </div>

          {/* Rent Due / Paid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="py-rentdue">
                Rent Due (₹)
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {sid && !selectedStudent
                    ? "loading…"
                    : selectedStudent?.seatType
                      ? `Type ${selectedStudent.seatType === SeatType.typeB ? "B" : "A"}`
                      : "enter manually"}
                </span>
              </Label>
              <Input
                id="py-rentdue"
                type="number"
                min="0"
                value={rentDue}
                onChange={(e) => setRentDue(e.target.value)}
                placeholder="₹ Enter amount"
                data-ocid="payments.rent_due_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="py-paid">Paid Amount (₹)</Label>
              <Input
                id="py-paid"
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => handlePaidAmountChange(e.target.value)}
                data-ocid="payments.paid_amount_input"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>
              Status
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                auto-suggested
              </span>
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as PaymentStatus)}
            >
              <SelectTrigger data-ocid="payments.status_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentStatus.paid}>✅ Paid</SelectItem>
                <SelectItem value={PaymentStatus.partial}>
                  ⏳ Partial
                </SelectItem>
                <SelectItem value={PaymentStatus.pending}>
                  ❌ Pending
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="py-note">Note (optional)</Label>
            <Input
              id="py-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Paid via UPI, partial payment"
              data-ocid="payments.note_input"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="payments.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !sid}
              data-ocid="payments.submit_button"
            >
              {isPending
                ? "Saving…"
                : isEdit
                  ? "Update Payment"
                  : "Save Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirmModal({
  open,
  onClose,
  paymentId,
}: {
  open: boolean;
  onClose: () => void;
  paymentId: PaymentId | null;
}) {
  const del = useDeletePayment();

  const handleDelete = () => {
    if (!paymentId) return;
    del.mutate(paymentId, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="payments.delete_dialog">
        <DialogHeader>
          <DialogTitle>Delete Payment?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently delete this payment record. This action cannot
          be undone.
        </p>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="payments.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={del.isPending}
            data-ocid="payments.delete_confirm_button"
          >
            {del.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Payment Row (desktop table) ──────────────────────────────────────────────

function PaymentRow({
  payment,
  index,
  studentName,
  roomNumber,
  lateFeePerMonth,
  onEdit,
  onDelete,
}: {
  payment: Payment;
  index: number;
  studentName: string;
  roomNumber: string;
  lateFeePerMonth: number;
  onEdit: (p: Payment) => void;
  onDelete: (id: PaymentId) => void;
}) {
  const yr = Number(payment.year);
  const mo = Number(payment.month);
  const overdueDays =
    payment.status !== PaymentStatus.paid ? calcOverdueDays(yr, mo) : 0;
  const lateFee = calcLateFee(overdueDays, lateFeePerMonth);
  const balance = Number(payment.rentDue) - Number(payment.paidAmount);

  return (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/10 group"
      data-ocid={`payments.item.${index + 1}`}
    >
      {/* Student */}
      <td className="py-3 pl-4 pr-2">
        <p className="font-medium text-foreground text-sm">{studentName}</p>
        {roomNumber && (
          <p className="text-xs text-muted-foreground">Room {roomNumber}</p>
        )}
      </td>
      {/* Month/Year */}
      <td className="px-2 py-3 text-sm text-muted-foreground">
        {MONTHS_SHORT[mo - 1]} {yr}
      </td>
      {/* Rent Due */}
      <td className="px-2 py-3 text-right text-sm font-mono text-foreground">
        {fmt(payment.rentDue)}
      </td>
      {/* Paid */}
      <td className="px-2 py-3 text-right text-sm font-mono">
        <span
          className={
            payment.status === PaymentStatus.paid
              ? "text-emerald-400"
              : "text-foreground"
          }
        >
          {fmt(payment.paidAmount)}
        </span>
        {balance > 0 && (
          <p className="text-xs text-destructive/80">−{fmtNum(balance)} due</p>
        )}
      </td>
      {/* Status */}
      <td className="px-2 py-3">
        <StatusBadge status={payment.status} />
      </td>
      {/* Overdue Days */}
      <td className="px-2 py-3 text-center text-sm">
        {overdueDays > 0 ? (
          <span className="text-destructive font-medium">{overdueDays}d</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>
      {/* Late Fee */}
      <td className="px-2 py-3 text-right text-sm font-mono">
        {lateFee > 0 ? (
          <span className="text-destructive">{fmtNum(lateFee)}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>
      {/* Actions */}
      <td className="py-3 pl-2 pr-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(payment)}
            data-ocid={`payments.edit_button.${index + 1}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground/50 hover:text-destructive"
            onClick={() => onDelete(payment.id)}
            data-ocid={`payments.delete_button.${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Payment Card (mobile) ────────────────────────────────────────────────────

function PaymentCard({
  payment,
  index,
  studentName,
  roomNumber,
  lateFeePerMonth,
  onEdit,
  onDelete,
}: {
  payment: Payment;
  index: number;
  studentName: string;
  roomNumber: string;
  lateFeePerMonth: number;
  onEdit: (p: Payment) => void;
  onDelete: (id: PaymentId) => void;
}) {
  const yr = Number(payment.year);
  const mo = Number(payment.month);
  const overdueDays =
    payment.status !== PaymentStatus.paid ? calcOverdueDays(yr, mo) : 0;
  const lateFee = calcLateFee(overdueDays, lateFeePerMonth);
  const balance = Number(payment.rentDue) - Number(payment.paidAmount);

  return (
    <div
      className="rounded-lg border border-border bg-card p-4 space-y-3"
      data-ocid={`payments.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{studentName}</p>
          <p className="text-xs text-muted-foreground">
            {roomNumber ? `Room ${roomNumber} · ` : ""}
            {MONTHS_SHORT[mo - 1]} {yr}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(payment)}
            data-ocid={`payments.edit_button.${index + 1}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground/50 hover:text-destructive"
            onClick={() => onDelete(payment.id)}
            data-ocid={`payments.delete_button.${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Rent Due</p>
          <p className="font-mono font-medium text-foreground">
            {fmt(payment.rentDue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Paid</p>
          <p
            className={`font-mono font-medium ${payment.status === PaymentStatus.paid ? "text-emerald-400" : "text-foreground"}`}
          >
            {fmt(payment.paidAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Status</p>
          <StatusBadge status={payment.status} />
        </div>
      </div>

      {(overdueDays > 0 || balance > 0 || payment.note) && (
        <div className="border-t border-border pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {balance > 0 && (
            <span className="text-destructive/80">
              Balance: {fmtNum(balance)}
            </span>
          )}
          {overdueDays > 0 && (
            <span className="text-destructive">
              Overdue: {overdueDays} days
            </span>
          )}
          {lateFee > 0 && (
            <span className="text-destructive/80">
              Late fee: {fmtNum(lateFee)}
            </span>
          )}
          {payment.note && (
            <span className="text-muted-foreground italic">{payment.note}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KPICards({
  payments,
  lateFeePerMonth,
}: {
  payments: Payment[];
  lateFeePerMonth: number;
}) {
  const totalCollected = payments
    .filter((p) => p.status === PaymentStatus.paid)
    .reduce((s, p) => s + Number(p.paidAmount), 0);

  const totalPending = payments
    .filter((p) => p.status !== PaymentStatus.paid)
    .reduce((s, p) => s + (Number(p.rentDue) - Number(p.paidAmount)), 0);

  const overdueStudents = payments.filter((p) => {
    if (p.status === PaymentStatus.paid) return false;
    return calcOverdueDays(Number(p.year), Number(p.month)) > 0;
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
        data-ocid="payments.collected_card"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-emerald-400/80">
            Total Collected
          </span>
        </div>
        <p className="text-2xl font-bold text-emerald-400 font-display">
          {fmtNum(totalCollected)}
        </p>
        <p className="text-xs text-emerald-400/60 mt-1">
          {payments.filter((p) => p.status === PaymentStatus.paid).length} paid
          records
        </p>
      </div>

      <div
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
        data-ocid="payments.pending_card"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <IndianRupee className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-sm font-medium text-amber-400/80">
            Pending Amount
          </span>
        </div>
        <p className="text-2xl font-bold text-amber-400 font-display">
          {fmtNum(totalPending)}
        </p>
        <p className="text-xs text-amber-400/60 mt-1">
          {payments.filter((p) => p.status !== PaymentStatus.paid).length}{" "}
          unpaid records
        </p>
      </div>

      <div
        className="rounded-xl border border-destructive/20 bg-destructive/5 p-5"
        data-ocid="payments.overdue_card"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-destructive/15 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-sm font-medium text-destructive/80">
            Overdue Students
          </span>
        </div>
        <p className="text-2xl font-bold text-destructive font-display">
          {overdueStudents}
        </p>
        <p className="text-xs text-destructive/60 mt-1">
          Late fee: {fmtNum(lateFeePerMonth)}/mo per record
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const { data: allPayments = [], isLoading } = usePayments();
  const { data: students = [] } = useStudents();
  const { data: settings } = useHostelSettings();
  const { t } = useLanguage();

  const lateFeePerMonth = settings ? Number(settings.lateFeePerMonth) : 100;

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(String(now.getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(now.getFullYear()));
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "partial" | "pending"
  >("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [deleteId, setDeleteId] = useState<PaymentId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const studentMap = new Map(students.map((s) => [s.id.toString(), s]));

  const getStudentName = (id: bigint) =>
    studentMap.get(id.toString())?.name ?? `Student #${id}`;
  const getRoomNumber = (id: bigint) =>
    studentMap.get(id.toString())?.roomNumber ?? "";

  // Filter by month/year
  const monthFiltered = allPayments.filter((p) => {
    const matchMonth = !filterMonth || Number(p.month) === Number(filterMonth);
    const matchYear = !filterYear || Number(p.year) === Number(filterYear);
    return matchMonth && matchYear;
  });

  // Filter by status
  const filtered = monthFiltered.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "paid") return p.status === PaymentStatus.paid;
    if (statusFilter === "partial") return p.status === PaymentStatus.partial;
    if (statusFilter === "pending") return p.status === PaymentStatus.pending;
    return true;
  });

  // Sort: newest month/year first, then by student name
  const sorted = [...filtered].sort((a, b) => {
    const yrDiff = Number(b.year) - Number(a.year);
    if (yrDiff !== 0) return yrDiff;
    const moDiff = Number(b.month) - Number(a.month);
    if (moDiff !== 0) return moDiff;
    return getStudentName(a.studentId).localeCompare(
      getStudentName(b.studentId),
    );
  });

  const openEdit = (p: Payment) => {
    setEditPayment(p);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditPayment(null);
  };

  const years = Array.from({ length: 6 }, (_, i) =>
    String(now.getFullYear() - 2 + i),
  );

  return (
    <Layout
      title={t("payments")}
      subtitle="Track rent collection and payment history"
    >
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground font-display">
            {t("payments")}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setSettingsOpen(true)}
              data-ocid="payments.settings_button"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setEditPayment(null);
                setFormOpen(true);
              }}
              className="gap-2"
              data-ocid="payments.add_button"
            >
              <Plus className="h-4 w-4" />
              <span>{t("addPayment")}</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards payments={monthFiltered} lateFeePerMonth={lateFeePerMonth} />

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Month/Year selector */}
          <div className="flex items-center gap-2">
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger
                className="w-36 h-8 text-sm"
                data-ocid="payments.month_filter"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger
                className="w-24 h-8 text-sm"
                data-ocid="payments.year_filter"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            data-ocid="payments.filter.tab"
          >
            <TabsList className="h-8 gap-0.5">
              <TabsTrigger
                value="all"
                className="h-7 px-3 text-xs"
                data-ocid="payments.filter_all"
              >
                All ({monthFiltered.length})
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="h-7 px-3 text-xs"
                data-ocid="payments.filter_paid"
              >
                Paid
              </TabsTrigger>
              <TabsTrigger
                value="partial"
                className="h-7 px-3 text-xs"
                data-ocid="payments.filter_partial"
              >
                Partial
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="h-7 px-3 text-xs"
                data-ocid="payments.filter_pending"
              >
                Pending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center"
            data-ocid="payments.empty_state"
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-1">
              <CreditCard className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-foreground">No payment records</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {statusFilter !== "all"
                ? `No ${statusFilter} payments for ${MONTHS_SHORT[Number(filterMonth) - 1]} ${filterYear}`
                : `No payments recorded for ${MONTHS_SHORT[Number(filterMonth) - 1]} ${filterYear}`}
            </p>
            <Button
              onClick={() => {
                setEditPayment(null);
                setFormOpen(true);
              }}
              className="mt-2 gap-2"
              data-ocid="payments.empty_add_button"
            >
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 pl-4 pr-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Rent Due
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Overdue
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Late Fee
                    </th>
                    <th className="py-3 pl-2 pr-4" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => (
                    <PaymentRow
                      key={p.id.toString()}
                      payment={p}
                      index={i}
                      studentName={getStudentName(p.studentId)}
                      roomNumber={getRoomNumber(p.studentId)}
                      lateFeePerMonth={lateFeePerMonth}
                      onEdit={openEdit}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {sorted.map((p, i) => (
                <PaymentCard
                  key={p.id.toString()}
                  payment={p}
                  index={i}
                  studentName={getStudentName(p.studentId)}
                  roomNumber={getRoomNumber(p.studentId)}
                  lateFeePerMonth={lateFeePerMonth}
                  onEdit={openEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>

            {/* Footer summary */}
            {sorted.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2 text-sm text-muted-foreground">
                <span>
                  {sorted.length} record{sorted.length !== 1 ? "s" : ""}
                </span>
                <span>
                  Showing {MONTHS_SHORT[Number(filterMonth) - 1]} {filterYear}
                  {statusFilter !== "all" ? ` · ${statusFilter}` : ""}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <PaymentFormModal
        open={formOpen}
        onClose={closeForm}
        students={students}
        editPayment={editPayment}
      />
      <DeleteConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        paymentId={deleteId}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Layout>
  );
}

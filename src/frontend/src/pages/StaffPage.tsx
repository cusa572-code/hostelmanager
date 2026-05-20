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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useMonthSelector } from "@/hooks/useMonthSelector";
import {
  useAddStaff,
  useAttendanceByMonth,
  useMarkAttendance,
  useRemoveStaff,
  useStaff,
  useStaffSalaryReport,
} from "@/hooks/useQueries";
import type { Staff, StaffId } from "@/types";
import { AttendanceStatus } from "@/types";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayString() {
  return new Date().toISOString().split("T")[0];
}

// ─── Staff Card ───────────────────────────────────────────────────────────────

function StaffCard({
  member,
  index,
  todayStatus,
  presentDays,
  totalDays,
  earnedSalary,
  onTogglePresent,
  onDelete,
}: {
  member: Staff;
  index: number;
  todayStatus: AttendanceStatus | null;
  presentDays: number;
  totalDays: number;
  earnedSalary: bigint;
  onTogglePresent: (
    id: StaffId,
    currentStatus: AttendanceStatus | null,
  ) => void;
  onDelete: (id: StaffId) => void;
}) {
  const isPresent = todayStatus === AttendanceStatus.present;
  const attendancePct =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 space-y-4 hover:shadow-md transition-smooth"
      data-ocid={`staff.item.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground truncate">
              {member.name}
            </p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <Badge
          className={
            isPresent
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs shrink-0"
              : "border-destructive/30 bg-destructive/10 text-destructive text-xs shrink-0"
          }
        >
          {isPresent ? "Present" : "Absent"}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            Joined {new Date(Number(member.joinDate) / 1_000_000).getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <IndianRupee className="h-3.5 w-3.5 shrink-0" />
          <span>
            ₹{Number(member.monthlySalary).toLocaleString("en-IN")}/mo
          </span>
        </div>
      </div>

      {/* Attendance bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span>
            Attendance: {presentDays}/{totalDays} days
          </span>
          <span>{attendancePct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${attendancePct}%` }}
          />
        </div>
      </div>

      {/* Earned salary */}
      <div className="rounded-lg bg-muted/20 border border-border px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Salary earned this month
        </span>
        <span className="text-sm font-bold font-display text-foreground">
          ₹{Number(earnedSalary).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={isPresent}
            onCheckedChange={() => onTogglePresent(member.id, todayStatus)}
            data-ocid={`staff.attendance_toggle.${index + 1}`}
            aria-label={`Mark ${member.name} ${isPresent ? "absent" : "present"}`}
          />
          <span className="text-xs text-muted-foreground">
            Mark {isPresent ? "Absent" : "Present"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={() => onDelete(member.id)}
          data-ocid={`staff.delete_button.${index + 1}`}
          aria-label={`Remove ${member.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Add Staff Dialog ─────────────────────────────────────────────────────────

function AddStaffDialog({
  open,
  onClose,
  isSaving,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  isSaving: boolean;
  onAdd: (name: string, role: string, salary: bigint) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const salaryNum = Number.parseInt(salary, 10);
    if (!name.trim() || !role.trim() || Number.isNaN(salaryNum)) return;
    onAdd(name.trim(), role.trim(), BigInt(salaryNum));
    setName("");
    setRole("");
    setSalary("");
  }

  function handleClose() {
    setName("");
    setRole("");
    setSalary("");
    onClose();
  }

  const parsedSalary = Number.parseInt(salary, 10);
  const isValid =
    name.trim() && role.trim() && salary && !Number.isNaN(parsedSalary);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border sm:max-w-sm"
        data-ocid="staff.add_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Add Staff Member
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-sm font-semibold">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="staff-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
              autoFocus
              data-ocid="staff.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-role" className="text-sm font-semibold">
              Role <span className="text-destructive">*</span>
            </Label>
            <Input
              id="staff-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Warden, Cook, Guard"
              required
              data-ocid="staff.role_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staff-salary" className="text-sm font-semibold">
              Monthly Salary (₹) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="staff-salary"
              type="number"
              min={0}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 10000"
              required
              data-ocid="staff.salary_input"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              data-ocid="staff.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSaving}
              className="gap-1.5"
              data-ocid="staff.add_submit_button"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? "Adding…" : "Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } =
    useMonthSelector();

  const { data: staff = [], isLoading } = useStaff();
  const { data: attendance = [] } = useAttendanceByMonth(year, month);
  const { data: salaryReport } = useStaffSalaryReport(year, month);
  const addStaff = useAddStaff();
  const removeStaff = useRemoveStaff();
  const markAttendance = useMarkAttendance();
  const [addOpen, setAddOpen] = useState(false);

  const today = todayString();

  // Map attendance by staffId for today
  const todayAttendanceMap = new Map<string, AttendanceStatus>();
  for (const a of attendance) {
    if (a.date === today) {
      todayAttendanceMap.set(a.staffId.toString(), a.status);
    }
  }

  // Map salary entries by staffId
  const salaryEntryMap = new Map(
    (salaryReport?.entries ?? []).map((e) => [e.staffId.toString(), e]),
  );

  const totalSalary = staff.reduce(
    (sum, m) => sum + Number(m.monthlySalary),
    0,
  );
  const totalEarned = Number(salaryReport?.totalEarned ?? 0n);
  const presentCount = [...todayAttendanceMap.values()].filter(
    (s) => s === AttendanceStatus.present,
  ).length;
  const absentCount = staff.length - presentCount;

  function handleTogglePresent(
    staffId: StaffId,
    currentStatus: AttendanceStatus | null,
  ) {
    const newStatus =
      currentStatus === AttendanceStatus.present
        ? AttendanceStatus.absent
        : AttendanceStatus.present;
    markAttendance.mutate({ staffId, date: today, status: newStatus });
  }

  function handleDelete(id: StaffId) {
    removeStaff.mutate(id);
  }

  function handleAdd(name: string, role: string, monthlySalary: bigint) {
    addStaff.mutate(
      {
        name,
        role,
        monthlySalary,
        joinDate: BigInt(Date.now()) * 1_000_000n,
      },
      { onSuccess: () => setAddOpen(false) },
    );
  }

  return (
    <Layout title="Staff" subtitle="Attendance tracking and salary management">
      <div className="space-y-6" data-ocid="staff.page">
        {/* Month Selector */}
        <div
          className="flex items-center gap-3"
          data-ocid="staff.month_selector"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 shrink-0"
            aria-label="Previous month"
            data-ocid="staff.prev_month_button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center font-display text-base font-semibold text-foreground">
            {monthLabel} {yearLabel}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 shrink-0"
            aria-label="Next month"
            data-ocid="staff.next_month_button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Staff Management
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${staff.length} staff member${staff.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="gap-2 shrink-0"
            data-ocid="staff.add_button"
          >
            <Plus className="h-4 w-4" /> Add Staff
          </Button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            className="kpi-card flex items-center gap-3"
            data-ocid="staff.kpi_total"
          >
            <div className="p-2 rounded-lg border text-muted-foreground bg-muted/30 border-border">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-metric-label">Total Staff</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-0.5" />
              ) : (
                <p className="text-2xl font-bold font-display text-foreground">
                  {staff.length}
                </p>
              )}
            </div>
          </div>
          <div
            className="kpi-card flex items-center gap-3"
            data-ocid="staff.kpi_present"
          >
            <div className="p-2 rounded-lg border text-primary bg-primary/10 border-primary/20">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-metric-label">Present Today</p>
              <p className="text-2xl font-bold font-display text-foreground">
                {presentCount}
              </p>
            </div>
          </div>
          <div
            className="kpi-card flex items-center gap-3"
            data-ocid="staff.kpi_absent"
          >
            <div className="p-2 rounded-lg border text-destructive bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-metric-label">Absent Today</p>
              <p className="text-2xl font-bold font-display text-foreground">
                {absentCount}
              </p>
            </div>
          </div>
          <div
            className="kpi-card flex items-center gap-3"
            data-ocid="staff.kpi_salary"
          >
            <div className="p-2 rounded-lg border text-amber-400 bg-amber-500/10 border-amber-500/20">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-metric-label">Monthly Salaries</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20 mt-0.5" />
              ) : (
                <p className="text-2xl font-bold font-display text-foreground">
                  ₹{totalSalary.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Salary summary banner */}
        <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Estimated salary payout — {monthLabel} {yearLabel}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on attendance records (
              {Number(salaryReport?.workingDays ?? 0)} working days)
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-display text-primary">
              ₹{totalEarned.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              of ₹{totalSalary.toLocaleString("en-IN")} total
            </p>
          </div>
        </div>

        {/* Staff Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
              >
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div
            className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-20 text-center"
            data-ocid="staff.empty_state"
          >
            <div className="rounded-full bg-muted/40 p-5">
              <Users className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">
                No staff added yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Add your hostel staff to track attendance and manage salaries.
              </p>
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              className="gap-2 mt-1"
              data-ocid="staff.empty_add_button"
            >
              <Plus className="h-4 w-4" /> Add First Staff Member
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-ocid="staff.list"
          >
            {staff.map((member, i) => {
              const entry = salaryEntryMap.get(member.id.toString());
              const todayStatus =
                todayAttendanceMap.get(member.id.toString()) ?? null;
              return (
                <StaffCard
                  key={member.id.toString()}
                  member={member}
                  index={i}
                  todayStatus={todayStatus}
                  presentDays={Number(entry?.presentDays ?? 0n)}
                  totalDays={Number(
                    entry?.totalWorkingDays ?? salaryReport?.workingDays ?? 26n,
                  )}
                  earnedSalary={entry?.earnedSalary ?? 0n}
                  onTogglePresent={handleTogglePresent}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>

      <AddStaffDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        isSaving={addStaff.isPending}
        onAdd={handleAdd}
      />
    </Layout>
  );
}

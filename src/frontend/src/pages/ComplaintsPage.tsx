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
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useComplaints,
  useCreateComplaint,
  useDeleteComplaint,
  useStudents,
  useUpdateComplaintStatus,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { ComplaintStatus } from "@/types";
import type { Complaint, ComplaintInput, StudentSummary } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  MessageSquareWarning,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterTab = "all" | "pending" | "inProgress" | "resolved";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sortComplaints(complaints: Complaint[]): Complaint[] {
  const order: Record<string, number> = {
    [ComplaintStatus.pending]: 0,
    [ComplaintStatus.inProgress]: 1,
    [ComplaintStatus.resolved]: 2,
  };
  return [...complaints].sort((a, b) => {
    const od = order[a.status] - order[b.status];
    if (od !== 0) return od;
    return Number(b.createdAt - a.createdAt);
  });
}

// ─── Status helpers ───────────────────────────────────────────────────────────

interface StatusMeta {
  label: string;
  badgeClass: string;
  borderClass: string;
  iconColor: string;
}

function getStatusMeta(
  status: ComplaintStatus,
  t: (key: "resolved" | "inProgress" | "pending_complaint") => string,
): StatusMeta {
  if (status === ComplaintStatus.resolved)
    return {
      label: t("resolved"),
      badgeClass: "badge-complaint-resolved",
      borderClass: "border-l-emerald-500",
      iconColor: "text-emerald-400",
    };
  if (status === ComplaintStatus.inProgress)
    return {
      label: t("inProgress"),
      badgeClass: "badge-complaint-progress",
      borderClass: "border-l-primary",
      iconColor: "text-primary",
    };
  return {
    label: t("pending_complaint"),
    badgeClass: "badge-complaint-pending",
    borderClass: "border-l-amber-500",
    iconColor: "text-amber-400",
  };
}

// ─── Report Issue Dialog ──────────────────────────────────────────────────────

interface ReportIssueDialogProps {
  open: boolean;
  onClose: () => void;
  students: StudentSummary[];
}

function ReportIssueDialog({
  open,
  onClose,
  students,
}: ReportIssueDialogProps) {
  const create = useCreateComplaint();
  const [sid, setSid] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [description, setDescription] = useState("");

  const handleStudentChange = (val: string) => {
    setSid(val);
    if (val) {
      const s = students.find((s) => s.id.toString() === val);
      if (s?.roomNumber) setRoomNumber(s.roomNumber);
    }
  };

  const handleClose = () => {
    setSid("");
    setRoomNumber("");
    setDescription("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) return;
    const input: ComplaintInput = {
      description: description.trim(),
      roomNumber: roomNumber.trim(),
      studentId: sid ? BigInt(sid) : undefined,
    };
    create.mutate(input, { onSuccess: handleClose });
  };

  const descOk = description.trim().length >= 10;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg" data-ocid="complaints.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            Report Issue
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="form-label">Student (optional)</Label>
            <Select value={sid} onValueChange={handleStudentChange}>
              <SelectTrigger data-ocid="complaints.student_select">
                <SelectValue placeholder="Select student (optional)" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.name}
                    {s.roomNumber ? ` — Room ${s.roomNumber}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-room" className="form-label">
              Room Number *
            </Label>
            <Input
              id="cp-room"
              placeholder="e.g. 101"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
              data-ocid="complaints.room_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-desc" className="form-label">
              Description *{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (min 10 chars)
              </span>
            </Label>
            <Textarea
              id="cp-desc"
              placeholder="Describe the issue in detail…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea min-h-[100px]"
              required
              data-ocid="complaints.description_input"
            />
            {description.length > 0 && !descOk && (
              <p
                className="text-xs text-destructive"
                data-ocid="complaints.desc_field_error"
              >
                Description must be at least 10 characters
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-ocid="complaints.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || !roomNumber.trim() || !descOk}
              data-ocid="complaints.submit_button"
            >
              {create.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Filing…
                </>
              ) : (
                "File Complaint"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteComplaintDialogProps {
  complaintId: bigint | null;
  onClose: () => void;
}

function DeleteComplaintDialog({
  complaintId,
  onClose,
}: DeleteComplaintDialogProps) {
  const deleteComplaint = useDeleteComplaint();

  const handleConfirm = () => {
    if (complaintId == null) return;
    deleteComplaint.mutate(complaintId, { onSuccess: onClose });
  };

  return (
    <AlertDialog
      open={complaintId != null}
      onOpenChange={(v) => !v && onClose()}
    >
      <AlertDialogContent data-ocid="complaints.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Complaint?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This complaint will be permanently deleted and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="complaints.delete_cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteComplaint.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="complaints.delete_confirm_button"
          >
            {deleteComplaint.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Complaint Card ───────────────────────────────────────────────────────────

interface ComplaintCardProps {
  complaint: Complaint;
  studentName: string | undefined;
  studentId: bigint | undefined;
  index: number;
  onDelete: (id: bigint) => void;
}

function ComplaintCard({
  complaint,
  studentName,
  studentId,
  index,
  onDelete,
}: ComplaintCardProps) {
  const updateStatus = useUpdateComplaintStatus();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  const meta = getStatusMeta(complaint.status, t);
  const isResolved = complaint.status === ComplaintStatus.resolved;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.2,
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "group relative rounded-lg border-l-4 bg-card border border-border p-4 space-y-3 transition-smooth",
        meta.borderClass,
        isResolved && "opacity-60",
      )}
      data-ocid={`complaints.item.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-foreground text-sm">
              Room #{complaint.roomNumber}
            </span>
            <span className={meta.badgeClass}>{meta.label}</span>
          </div>
          {studentName && (
            <button
              type="button"
              onClick={() =>
                studentId &&
                navigate({
                  to: "/students/$studentId",
                  params: { studentId: studentId.toString() },
                })
              }
              className="mt-0.5 text-xs text-primary hover:underline text-left"
              data-ocid={`complaints.student_link.${index + 1}`}
            >
              {studentName}
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
          onClick={() => onDelete(complaint.id)}
          aria-label="Delete complaint"
          data-ocid={`complaints.delete_button.${index + 1}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Description — expand/collapse */}
      <div>
        <p
          className={cn(
            "text-sm text-muted-foreground leading-relaxed",
            !expanded && "line-clamp-2",
          )}
        >
          {complaint.description}
        </p>
        {complaint.description.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
            data-ocid={`complaints.expand_button.${index + 1}`}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer: date + status dropdown */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {formatDate(complaint.createdAt)}
        </span>
        <Select
          value={complaint.status}
          onValueChange={(v) =>
            updateStatus.mutate({
              id: complaint.id,
              status: v as ComplaintStatus,
            })
          }
        >
          <SelectTrigger
            className="h-7 w-36 text-xs"
            data-ocid={`complaints.status_select.${index + 1}`}
          >
            {updateStatus.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ComplaintStatus.pending}>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-amber-400" />{" "}
                {t("pending_complaint")}
              </span>
            </SelectItem>
            <SelectItem value={ComplaintStatus.inProgress}>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 text-primary" />{" "}
                {t("inProgress")}
              </span>
            </SelectItem>
            <SelectItem value={ComplaintStatus.resolved}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />{" "}
                {t("resolved")}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}

// ─── Stat KPI Card ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  count: number;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

function StatCard({ label, count, colorClass, bgClass, icon }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${bgClass}`}
    >
      <div className={`shrink-0 ${colorClass}`}>{icon}</div>
      <div>
        <p className={`text-xs font-medium ${colorClass} opacity-80`}>
          {label}
        </p>
        <p className={`text-2xl font-bold font-display ${colorClass}`}>
          {count}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComplaintsPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { data: students = [] } = useStudents();
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const studentMap = useMemo(() => {
    const m = new Map<string, StudentSummary>();
    for (const s of students) m.set(s.id.toString(), s);
    return m;
  }, [students]);

  const studentName = (id: bigint | undefined) =>
    id !== undefined ? studentMap.get(id.toString())?.name : undefined;

  const studentId = (id: bigint | undefined) => id;

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === ComplaintStatus.pending,
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === ComplaintStatus.inProgress,
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === ComplaintStatus.resolved,
  ).length;

  const filtered = useMemo(() => {
    let list = sortComplaints(complaints);

    // Status filter
    if (filterTab !== "all") {
      const statusMap: Record<Exclude<FilterTab, "all">, ComplaintStatus> = {
        pending: ComplaintStatus.pending,
        inProgress: ComplaintStatus.inProgress,
        resolved: ComplaintStatus.resolved,
      };
      list = list.filter((c) => c.status === statusMap[filterTab]);
    }

    // Search
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((c) => {
        const name =
          studentMap.get(c.studentId?.toString() ?? "")?.name?.toLowerCase() ??
          "";
        return (
          c.roomNumber.toLowerCase().includes(q) ||
          name.includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [complaints, filterTab, search, studentMap]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "pending", label: t("pending_complaint"), count: pendingCount },
    { key: "inProgress", label: t("inProgress"), count: inProgressCount },
    { key: "resolved", label: t("resolved"), count: resolvedCount },
  ];

  return (
    <Layout>
      <div
        className="flex flex-col gap-0 h-full min-h-0"
        data-ocid="complaints.page"
      >
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
                {t("complaints")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track and resolve hostel issues
              </p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2"
              data-ocid="complaints.report_button"
            >
              <Plus className="h-4 w-4" /> {t("addComplaint")}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-6 pt-5 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label={t("total")}
              count={totalCount}
              colorClass="text-foreground"
              bgClass="border-border bg-card"
              icon={<MessageSquareWarning className="h-5 w-5" />}
            />
            <StatCard
              label={t("pending_complaint")}
              count={pendingCount}
              colorClass="text-amber-400"
              bgClass="border-amber-500/20 bg-amber-500/5"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              label={t("inProgress")}
              count={inProgressCount}
              colorClass="text-primary"
              bgClass="border-primary/20 bg-primary/5"
              icon={<AlertCircle className="h-5 w-5" />}
            />
            <StatCard
              label={t("resolved")}
              count={resolvedCount}
              colorClass="text-emerald-400"
              bgClass="border-emerald-500/20 bg-emerald-500/5"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Filter Tabs + Search */}
        <div className="px-6 pt-4 pb-3 shrink-0 space-y-3">
          {/* Tabs */}
          <div
            className="flex items-center gap-1 overflow-x-auto"
            data-ocid="complaints.filter_tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-smooth whitespace-nowrap",
                  filterTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
                data-ocid={`complaints.filter.${tab.key}`}
              >
                {tab.label}
                <Badge
                  className={cn(
                    "px-1.5 py-0 text-xs",
                    filterTab === tab.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by room number, student name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 form-input"
              data-ocid="complaints.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading ? (
            <div
              className="grid gap-4 sm:grid-cols-2"
              data-ocid="complaints.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
              data-ocid="complaints.empty_state"
            >
              <div className="empty-state-icon">
                <MessageSquareWarning className="h-12 w-12 mx-auto opacity-30" />
              </div>
              <p className="empty-state-title">
                {search || filterTab !== "all"
                  ? "No complaints found"
                  : "No complaints yet"}
              </p>
              <p className="empty-state-description">
                {search
                  ? "Try a different search term or clear the filter"
                  : filterTab !== "all"
                    ? "No complaints with this status"
                    : "Issues reported by students or staff will appear here"}
              </p>
              {!search && filterTab === "all" && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="gap-2"
                  data-ocid="complaints.empty_report_button"
                >
                  <Plus className="h-4 w-4" /> Report Issue
                </Button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((c, i) => (
                  <ComplaintCard
                    key={c.id.toString()}
                    complaint={c}
                    studentName={studentName(c.studentId)}
                    studentId={studentId(c.studentId)}
                    index={i}
                    onDelete={(id) => setDeletingId(id)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <ReportIssueDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        students={students}
      />
      <DeleteComplaintDialog
        complaintId={deletingId}
        onClose={() => setDeletingId(null)}
      />
    </Layout>
  );
}

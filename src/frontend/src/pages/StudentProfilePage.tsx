import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteStudent,
  useStudent,
  useStudentPayments,
  useStudentUdhar,
  useUpdateStudent,
  useUpdateStudentDocument,
  useUpdateStudentPhoto,
  useVacateStudent,
} from "@/hooks/useQueries";
import { useRooms } from "@/hooks/useQueries";
import { PaymentStatus, SeatType, StudentStatus } from "@/types";
import type { Student } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Calendar,
  CreditCard,
  Edit2,
  FileText,
  IndianRupee,
  MapPin,
  Phone,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const MONTHS = [
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

function formatDate(ts: bigint | undefined): string {
  if (!ts) return "—";
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(n: bigint): string {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === PaymentStatus.paid)
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
        Paid
      </Badge>
    );
  if (status === PaymentStatus.partial)
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs">
        Partial
      </Badge>
    );
  return (
    <Badge className="border-destructive/30 bg-destructive/10 text-destructive text-xs">
      Pending
    </Badge>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="student_profile.delete_dialog">
        <DialogHeader>
          <DialogTitle>Delete Student?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently delete the student record and all associated
          data. This action cannot be undone.
        </p>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="student_profile.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="student_profile.delete_confirm_button"
          >
            {isDeleting ? "Deleting…" : "Delete Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Vacate Dialog ─────────────────────────────────────────────────────────────
function VacateDialog({
  open,
  onClose,
  onConfirm,
  isVacating,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  isVacating: boolean;
}) {
  const [leaveDate, setLeaveDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="student_profile.vacate_dialog">
        <DialogHeader>
          <DialogTitle>Mark as Vacated</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Label htmlFor="vacate-date">Leave Date</Label>
          <Input
            id="vacate-date"
            type="date"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            data-ocid="student_profile.vacate_date_input"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="student_profile.vacate_cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(leaveDate)}
            disabled={isVacating}
            data-ocid="student_profile.vacate_confirm_button"
          >
            {isVacating ? "Saving…" : "Confirm Vacate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────
function EditProfileForm({
  student,
  onCancel,
  onSaved,
}: {
  student: Student;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { data: rooms = [] } = useRooms();
  const updateStudent = useUpdateStudent();

  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone);
  const [address, setAddress] = useState(student.address);
  const [idProofText, setIdProofText] = useState(student.idProofText);
  const [roomId, setRoomId] = useState(student.roomId?.toString() ?? "");
  const [seatType, setSeatType] = useState(student.seatType ?? SeatType.typeA);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent.mutate(
      {
        id: student.id,
        input: {
          name,
          phone,
          address,
          idProofText,
          joinDate: student.joinDate,
          roomId: roomId ? BigInt(roomId) : undefined,
          seatType,
        },
      },
      { onSuccess: onSaved },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ep-name">Full Name *</Label>
          <Input
            id="ep-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-ocid="student_profile.edit_name_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ep-phone">Phone *</Label>
          <Input
            id="ep-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            data-ocid="student_profile.edit_phone_input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ep-address">Address</Label>
        <Input
          id="ep-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          data-ocid="student_profile.edit_address_input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ep-idproof">ID Proof</Label>
        <Input
          id="ep-idproof"
          value={idProofText}
          onChange={(e) => setIdProofText(e.target.value)}
          placeholder="e.g. Aadhar: 1234-5678-9012"
          data-ocid="student_profile.edit_idproof_input"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Room Assignment</Label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="student_profile.edit_room_select"
          >
            <option value="">No room assigned</option>
            {rooms.map((r) => (
              <option key={r.id.toString()} value={r.id.toString()}>
                Room #{r.roomNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Seat Type</Label>
          <select
            value={seatType}
            onChange={(e) => setSeatType(e.target.value as SeatType)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="student_profile.edit_seat_type_select"
          >
            <option value={SeatType.typeA}>Type A (₹8,500)</option>
            <option value={SeatType.typeB}>Type B (₹8,900)</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          data-ocid="student_profile.edit_cancel_button"
        >
          <X className="h-3.5 w-3.5 mr-1" /> Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={updateStudent.isPending}
          data-ocid="student_profile.edit_save_button"
        >
          <Save className="h-3.5 w-3.5 mr-1" />
          {updateStudent.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ─── Photo Upload Section ─────────────────────────────────────────────────────
function PhotoUpload({
  studentId,
  photoKey,
}: { studentId: bigint; photoKey?: string }) {
  const updatePhoto = useUpdateStudentPhoto();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    // Store the file name as key (object-storage integration point)
    updatePhoto.mutate({
      id: studentId,
      photoKey: `photo_${studentId}_${file.name}`,
    });
  };

  const displaySrc =
    previewUrl ?? (photoKey ? `/assets/uploaded/${photoKey}` : null);

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Profile Photo</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => inputRef.current?.click()}
          disabled={updatePhoto.isPending}
          data-ocid="student_profile.upload_photo_button"
        >
          <Upload className="h-3.5 w-3.5" />
          {updatePhoto.isPending
            ? "Uploading…"
            : photoKey
              ? "Change Photo"
              : "Upload Photo"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {photoKey && !previewUrl && (
          <p className="mt-1 text-xs text-emerald-400">Photo on file ✓</p>
        )}
      </div>
    </div>
  );
}

// ─── Document Upload Section ──────────────────────────────────────────────────
function DocumentUpload({
  studentId,
  documentKey,
}: { studentId: bigint; documentKey?: string }) {
  const updateDoc = useUpdateStudentDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploaded(true);
    updateDoc.mutate({
      id: studentId,
      documentKey: `doc_${studentId}_${file.name}`,
    });
  };

  const hasDoc = documentKey || uploaded;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">ID Document</p>
          <p className="text-xs text-muted-foreground">
            {hasDoc ? "Document uploaded" : "Aadhar / ID proof"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasDoc && (
          <span className="text-xs text-emerald-400 font-medium">
            ✓ On file
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => inputRef.current?.click()}
          disabled={updateDoc.isPending}
          data-ocid="student_profile.upload_document_button"
        >
          <Upload className="h-3.5 w-3.5" />
          {updateDoc.isPending ? "Uploading…" : hasDoc ? "Replace" : "Upload"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

// ─── Details Tab ──────────────────────────────────────────────────────────────
function DetailsTab({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-5">
      {/* Photo + Document uploads */}
      <PhotoUpload studentId={student.id} photoKey={student.photoKey} />
      <DocumentUpload
        studentId={student.id}
        documentKey={student.documentKey}
      />

      <Separator className="opacity-50" />

      {/* Profile fields or edit form */}
      {editing ? (
        <EditProfileForm
          student={student}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={student.phone}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Join Date"
              value={formatDate(student.joinDate)}
            />
            {student.leaveDate && (
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Leave Date"
                value={formatDate(student.leaveDate)}
              />
            )}
            {student.roomId !== undefined && (
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="Room"
                value={`Room #${student.roomId.toString()}`}
              />
            )}
            {student.seatType && (
              <InfoRow
                icon={<IndianRupee className="h-4 w-4" />}
                label="Seat Type"
                value={
                  student.seatType === SeatType.typeA
                    ? "Type A (₹8,500)"
                    : "Type B (₹8,900)"
                }
              />
            )}
            {student.address && (
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={student.address}
                />
              </div>
            )}
            {student.idProofText && (
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<FileText className="h-4 w-4" />}
                  label="ID Proof"
                  value={student.idProofText}
                />
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setEditing(true)}
            data-ocid="student_profile.edit_button"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Profile
          </Button>
        </>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Payments Tab ─────────────────────────────────────────────────────────────
function PaymentsTab({ studentId }: { studentId: bigint }) {
  const { data: payments = [], isLoading } = useStudentPayments(studentId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-12 text-center"
        data-ocid="student_profile.payments_empty_state"
      >
        <CreditCard className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No payment history yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
        <span>Month / Year</span>
        <span className="text-right">Rent Due</span>
        <span className="text-right">Paid</span>
        <span>Status</span>
      </div>
      {payments.map((p, i) => {
        const monthIdx = Math.max(0, Math.min(11, Number(p.month) - 1));
        const monthLabel = `${MONTHS[monthIdx]} ${Number(p.year)}`;
        const lateFeeAmount =
          p.lateFee > 0n
            ? ` + ₹${Number(p.lateFee).toLocaleString("en-IN")} late fee`
            : "";
        return (
          <div
            key={p.id.toString()}
            className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 border-t border-border/50 px-4 py-3"
            data-ocid={`student_profile.payment.${i + 1}`}
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {monthLabel}
              </p>
              {lateFeeAmount && (
                <p className="text-xs text-destructive">{lateFeeAmount}</p>
              )}
            </div>
            <p className="text-right text-sm text-foreground">
              {formatAmount(p.rentDue)}
            </p>
            <p className="text-right text-sm font-semibold text-foreground">
              {formatAmount(p.paidAmount)}
            </p>
            <PaymentStatusBadge status={p.status} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const { studentId } = useParams({ from: "/students/$studentId" });
  const id = BigInt(studentId);
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(id);
  const { data: udharSummary } = useStudentUdhar(id);
  const vacate = useVacateStudent();
  const deleteStudent = useDeleteStudent();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [vacateOpen, setVacateOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout title="Student Profile">
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout title="Student Profile">
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <User className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Student not found</p>
          <Link to="/students">
            <Button variant="ghost" data-ocid="student_profile.back_button">
              Back to Students
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isActive = student.status === StudentStatus.active;

  const handleDelete = () => {
    deleteStudent.mutate(id, {
      onSuccess: () => navigate({ to: "/students" }),
    });
  };

  const handleVacate = (dateStr: string) => {
    const ts = BigInt(new Date(dateStr).getTime()) * 1_000_000n;
    vacate.mutate(
      { id, leaveDate: ts },
      { onSuccess: () => setVacateOpen(false) },
    );
  };

  return (
    <Layout title="Student Profile" subtitle={student.name}>
      <div className="max-w-3xl space-y-5">
        {/* Back link */}
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="student_profile.back_link"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Students
        </Link>

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="overflow-hidden">
            {/* Color band */}
            <div
              className={`h-1.5 w-full ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{student.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        className={
                          isActive
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs"
                            : "border-muted-foreground/30 bg-muted text-muted-foreground text-xs"
                        }
                      >
                        {isActive ? "Active" : "Vacated"}
                      </Badge>
                      {student.seatType && (
                        <span className="text-xs text-muted-foreground">
                          {student.seatType === SeatType.typeA
                            ? "Type A"
                            : "Type B"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                      onClick={() => setVacateOpen(true)}
                      disabled={vacate.isPending}
                      data-ocid="student_profile.vacate_button"
                    >
                      Mark Vacated
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteOpen(true)}
                    data-ocid="student_profile.delete_button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Quick info */}
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {student.phone}
                </span>
                {student.roomId !== undefined && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    Room #{student.roomId.toString()}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Joined{" "}
                  {formatDate(student.joinDate)}
                </span>
              </div>

              {/* Udhar outstanding */}
              {udharSummary && udharSummary.totalOutstanding > 0n && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                  <p className="text-sm font-medium text-amber-400">
                    Udhar Outstanding
                  </p>
                  <p className="text-sm font-bold text-amber-400">
                    {formatAmount(udharSummary.totalOutstanding)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs: Details + Payments */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
        >
          <Card>
            <CardContent className="pt-5">
              <Tabs defaultValue="details">
                <TabsList className="mb-5 w-full sm:w-auto">
                  <TabsTrigger
                    value="details"
                    className="flex-1 sm:flex-none"
                    data-ocid="student_profile.tab.details"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="flex-1 sm:flex-none"
                    data-ocid="student_profile.tab.payments"
                  >
                    Payment History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <DetailsTab student={student} />
                </TabsContent>

                <TabsContent value="payments">
                  <PaymentsTab studentId={id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteStudent.isPending}
      />
      <VacateDialog
        open={vacateOpen}
        onClose={() => setVacateOpen(false)}
        onConfirm={handleVacate}
        isVacating={vacate.isPending}
      />
    </Layout>
  );
}

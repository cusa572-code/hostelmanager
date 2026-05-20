import { Variant_full_empty_partial } from "@/backend";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useCreateRoom,
  useDeleteRoom,
  useRoom,
  useRooms,
  useUpdateRoom,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { Room, RoomId, RoomInput, RoomSummary } from "@/types";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Edit2,
  Info,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusLabel(status: Variant_full_empty_partial) {
  if (status === Variant_full_empty_partial.empty) return "Empty";
  if (status === Variant_full_empty_partial.partial) return "Partially Full";
  return "Full";
}

function deriveStatus(
  occupied: number,
  total: number,
): Variant_full_empty_partial {
  if (occupied === 0) return Variant_full_empty_partial.empty;
  if (occupied >= total) return Variant_full_empty_partial.full;
  return Variant_full_empty_partial.partial;
}

function StatusBadge({ status }: { status: Variant_full_empty_partial }) {
  const { t } = useLanguage();
  if (status === Variant_full_empty_partial.empty)
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
        {t("empty")}
      </Badge>
    );
  if (status === Variant_full_empty_partial.partial)
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium">
        {t("partialRoom")}
      </Badge>
    );
  return (
    <Badge className="border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium">
      {t("full")}
    </Badge>
  );
}

function leftBorderClass(status: Variant_full_empty_partial) {
  if (status === Variant_full_empty_partial.empty) return "room-status-empty";
  if (status === Variant_full_empty_partial.partial)
    return "room-status-partial";
  return "room-status-full";
}

// ─── Room Card ───────────────────────────────────────────────────────────────

function RoomCard({
  room,
  index,
  onClick,
}: {
  room: RoomSummary;
  index: number;
  onClick: () => void;
}) {
  const seatCount = Number(room.seatCount);
  const occupiedSeats = Number(room.occupiedSeats);
  const occupiedPct =
    seatCount > 0 ? Math.round((occupiedSeats / seatCount) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "room-card group relative focus-ring w-full text-left",
        leftBorderClass(room.status),
      )}
      data-ocid={`rooms.item.${index + 1}`}
      aria-label={`Room ${room.roomNumber} — ${statusLabel(room.status)}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-bold text-foreground truncate leading-tight">
            #{room.roomNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {seatCount} seat{seatCount !== 1 ? "s" : ""}
          </p>
        </div>
        <StatusBadge status={room.status} />
      </div>

      {/* Seat occupancy visual */}
      <div className="flex items-center gap-2 mt-3">
        <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium text-foreground">
          {occupiedSeats} / {seatCount}
        </span>
        <span className="text-xs text-muted-foreground">occupied</span>
      </div>

      {/* Occupancy bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span>Occupancy</span>
          <span>{occupiedPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              room.status === Variant_full_empty_partial.full
                ? "bg-destructive"
                : room.status === Variant_full_empty_partial.partial
                  ? "bg-amber-500"
                  : "bg-primary",
            )}
            style={{ width: `${occupiedPct}%` }}
          />
        </div>
      </div>

      {/* Hover cue */}
      <div className="mt-3 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth flex items-center gap-1">
        <Building2 className="h-3 w-3" />
        <span>Click to manage</span>
      </div>
    </button>
  );
}

// ─── Room Detail Sheet ────────────────────────────────────────────────────────

function RoomDetailSheet({
  roomId,
  open,
  onClose,
}: {
  roomId: RoomId | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data: room, isLoading } = useRoom(roomId ?? 0n);
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const [isEditing, setIsEditing] = useState(false);
  const [editNumber, setEditNumber] = useState("");
  const [editSeatCount, setEditSeatCount] = useState("");
  const [editOccupied, setEditOccupied] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const hasOccupied = room ? Number(room.occupiedSeats) > 0 : false;

  function startEdit(r: Room) {
    setEditNumber(r.roomNumber);
    setEditSeatCount(String(Number(r.seatCount)));
    setEditOccupied(String(Number(r.occupiedSeats)));
    setIsEditing(true);
  }

  function handleSaveEdit() {
    if (!room) return;
    const seatCountNum = Number.parseInt(editSeatCount, 10);
    if (Number.isNaN(seatCountNum) || seatCountNum < 1) return;
    const occupiedNum = Math.min(
      Math.max(0, Number.parseInt(editOccupied, 10) || 0),
      seatCountNum,
    );
    updateRoom.mutate(
      {
        id: room.id,
        input: {
          roomNumber: editNumber.trim(),
          seatCount: BigInt(seatCountNum),
        },
        occupiedSeats: BigInt(occupiedNum),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleDelete() {
    if (!room) return;
    deleteRoom.mutate(room.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        onClose();
      },
    });
  }

  // Derive status from edit values when editing, otherwise from room data
  const displayOccupied = isEditing
    ? Math.min(
        Math.max(0, Number.parseInt(editOccupied, 10) || 0),
        Number.parseInt(editSeatCount, 10) || 0,
      )
    : room
      ? Number(room.occupiedSeats)
      : 0;

  const displayTotal = isEditing
    ? Number.parseInt(editSeatCount, 10) || 0
    : room
      ? Number(room.seatCount)
      : 0;

  const previewStatus = deriveStatus(displayOccupied, displayTotal);

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-card border-border overflow-y-auto"
          data-ocid="rooms.sheet"
        >
          <SheetHeader className="pb-4 border-b border-border">
            <div className="flex items-start justify-between pr-8">
              <div>
                {isLoading ? (
                  <Skeleton className="h-7 w-40 mb-1" />
                ) : (
                  <SheetTitle className="font-display text-xl font-bold text-foreground">
                    Room #{room?.roomNumber}
                  </SheetTitle>
                )}
                {isLoading ? (
                  <Skeleton className="h-4 w-28 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {room ? `${Number(room.seatCount)} seats` : ""}
                  </p>
                )}
              </div>
              {!isLoading && room && (
                <StatusBadge
                  status={
                    isEditing
                      ? previewStatus
                      : deriveStatus(
                          Number(room.occupiedSeats),
                          Number(room.seatCount),
                        )
                  }
                />
              )}
            </div>
          </SheetHeader>

          {isLoading ? (
            <div className="space-y-3 pt-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : room ? (
            <div className="pt-5 space-y-5">
              {/* Seat summary */}
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Seat Summary
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">
                      {isEditing
                        ? Number.parseInt(editSeatCount, 10) || 0
                        : Number(room.seatCount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total
                    </p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-2xl font-bold font-display",
                        displayOccupied > 0
                          ? "text-destructive"
                          : "text-foreground",
                      )}
                    >
                      {displayOccupied}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Occupied
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-primary">
                      {Math.max(0, displayTotal - displayOccupied)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Empty
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div
                  className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3"
                  data-ocid="rooms.edit_form"
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    Edit Room
                  </h3>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="edit-number"
                      className="text-xs font-medium"
                    >
                      Room Number
                    </Label>
                    <Input
                      id="edit-number"
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                      className="h-10 text-sm cursor-text"
                      autoComplete="off"
                      data-ocid="rooms.edit_number_input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-seatcount"
                        className="text-xs font-medium"
                      >
                        Total Seats
                      </Label>
                      <Input
                        id="edit-seatcount"
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        value={editSeatCount}
                        onChange={(e) => setEditSeatCount(e.target.value)}
                        className="h-10 text-sm cursor-text font-mono"
                        data-ocid="rooms.edit_seatcount_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-occupied"
                        className="text-xs font-medium"
                      >
                        Occupied Seats
                      </Label>
                      <Input
                        id="edit-occupied"
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        value={editOccupied}
                        onChange={(e) => {
                          const v = e.target.value;
                          const max = Number.parseInt(editSeatCount, 10) || 99;
                          const n = Math.min(
                            Math.max(0, Number.parseInt(v, 10) || 0),
                            max,
                          );
                          setEditOccupied(v === "" ? "" : String(n));
                        }}
                        className="h-10 text-sm cursor-text font-mono"
                        placeholder="0"
                        data-ocid="rooms.edit_occupied_input"
                      />
                    </div>
                  </div>

                  {/* Live status preview */}
                  <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                      Status preview:
                    </span>
                    <StatusBadge status={previewStatus} />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={
                        updateRoom.isPending ||
                        !editNumber.trim() ||
                        !editSeatCount ||
                        Number.parseInt(editSeatCount, 10) < 1
                      }
                      className="gap-1.5 cursor-pointer"
                      data-ocid="rooms.save_button"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {updateRoom.isPending ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="cursor-pointer"
                      data-ocid="rooms.cancel_button"
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 flex-1 border-border cursor-pointer"
                    onClick={() => startEdit(room)}
                    data-ocid="rooms.edit_button"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Room
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={hasOccupied}
                    title={
                      hasOccupied
                        ? "Cannot delete a room with students"
                        : "Delete this room"
                    }
                    className={cn(
                      "gap-1.5 flex-1 border-border cursor-pointer",
                      !hasOccupied &&
                        "hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5",
                    )}
                    onClick={() => setDeleteConfirmOpen(true)}
                    data-ocid="rooms.delete_button"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              )}

              {hasOccupied && (
                <p className="text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-2">
                  ⚠️ Room cannot be deleted while students are occupying seats.
                </p>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent data-ocid="rooms.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete room{" "}
              <strong>#{room?.roomNumber}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="rooms.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteRoom.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="rooms.delete_confirm_button"
            >
              {deleteRoom.isPending ? "Deleting…" : "Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Add Room Dialog ────────────────────────────────────────────────────────

function RoomFormDialog({
  open,
  onClose,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (input: RoomInput, occupiedSeats: bigint) => void;
  isSaving: boolean;
}) {
  const [roomNumber, setRoomNumber] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const [occupiedSeats, setOccupiedSeats] = useState("0");

  const seatCountNum = Number.parseInt(seatCount, 10);
  const occupiedNum = Math.min(
    Math.max(0, Number.parseInt(occupiedSeats, 10) || 0),
    Number.isNaN(seatCountNum) ? 0 : seatCountNum,
  );

  const previewStatus = Number.isNaN(seatCountNum)
    ? Variant_full_empty_partial.empty
    : deriveStatus(occupiedNum, seatCountNum);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!roomNumber.trim() || Number.isNaN(seatCountNum) || seatCountNum < 1)
      return;
    onSave(
      { roomNumber: roomNumber.trim(), seatCount: BigInt(seatCountNum) },
      BigInt(occupiedNum),
    );
  }

  function handleClose() {
    setRoomNumber("");
    setSeatCount("");
    setOccupiedSeats("0");
    onClose();
  }

  const isValid =
    roomNumber.trim().length > 0 &&
    !Number.isNaN(seatCountNum) &&
    seatCountNum >= 1;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border sm:max-w-sm"
        data-ocid="rooms.add_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Add New Room
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Room Number */}
          <div className="space-y-1.5">
            <Label htmlFor="new-room-number" className="text-sm font-semibold">
              Room Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="new-room-number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101"
              required
              autoFocus
              className="h-10 cursor-text"
              data-ocid="rooms.number_input"
            />
          </div>

          {/* Seats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="new-room-seatcount"
                className="text-sm font-semibold"
              >
                Total Seats <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-room-seatcount"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                placeholder="e.g. 4"
                required
                className="h-10 font-mono cursor-text"
                data-ocid="rooms.seatcount_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="new-room-occupied"
                className="text-sm font-semibold"
              >
                Occupied Seats
              </Label>
              <Input
                id="new-room-occupied"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={occupiedSeats}
                onChange={(e) => {
                  const v = e.target.value;
                  const max = Number.isNaN(seatCountNum) ? 99 : seatCountNum;
                  const n = Math.min(
                    Math.max(0, Number.parseInt(v, 10) || 0),
                    max,
                  );
                  setOccupiedSeats(v === "" ? "0" : String(n));
                }}
                className="h-10 font-mono cursor-text"
                data-ocid="rooms.occupied_input"
              />
            </div>
          </div>

          {/* Status preview */}
          {seatCount && (
            <div className="flex items-center gap-2 rounded-md bg-muted/30 px-3 py-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <StatusBadge status={previewStatus} />
              <span className="text-xs text-muted-foreground ml-auto">
                {occupiedNum}/{seatCountNum || 0} filled
              </span>
            </div>
          )}

          <p className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/20 rounded-md px-3 py-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            Enter how many seats are currently filled in this room.
          </p>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="cursor-pointer"
              data-ocid="rooms.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !isValid}
              className="gap-1.5 cursor-pointer"
              data-ocid="rooms.add_submit_button"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? "Adding…" : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function RoomKPICard({
  label,
  value,
  icon,
  accent,
  loading,
  ocid,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "emerald" | "amber" | "red" | "default";
  loading?: boolean;
  ocid: string;
}) {
  const accentClasses = {
    emerald: "text-primary bg-primary/10 border-primary/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-destructive bg-destructive/10 border-destructive/20",
    default: "text-muted-foreground bg-muted/30 border-border",
  };

  const iconClass = accentClasses[accent ?? "default"];

  return (
    <div className="kpi-card flex items-center gap-3" data-ocid={ocid}>
      <div className={cn("p-2 rounded-lg border", iconClass)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-metric-label truncate">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-16 mt-0.5" />
        ) : (
          <p className="text-2xl font-bold font-display text-foreground leading-tight">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton Cards ──────────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RoomsPage() {
  const { data: rooms = [], isLoading } = useRooms();
  const createRoom = useCreateRoom();
  const { t } = useLanguage();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const totalRooms = rooms.length;
  const emptyRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.empty,
  ).length;
  const partialRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.partial,
  ).length;
  const fullRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.full,
  ).length;

  function openRoom(id: RoomId) {
    setSelectedRoomId(id);
    setSheetOpen(true);
  }

  function handleAddRoom(input: RoomInput, _occupiedSeats: bigint) {
    createRoom.mutate(input, { onSuccess: () => setAddDialogOpen(false) });
  }

  return (
    <Layout
      title={t("rooms")}
      subtitle="Manage hostel rooms and seat allocation"
    >
      <div className="space-y-6" data-ocid="rooms.page">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("rooms")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? t("loading")
                : `${totalRooms} room${totalRooms !== 1 ? "s" : ""} configured`}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setAddDialogOpen(true)}
            className="gap-2 shrink-0 cursor-pointer"
            data-ocid="rooms.add_button"
          >
            <Plus className="h-4 w-4" /> {t("addRoom")}
          </Button>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <RoomKPICard
            label="Total Rooms"
            value={isLoading ? "—" : totalRooms}
            icon={<Building2 className="h-4 w-4" />}
            loading={isLoading}
            ocid="rooms.kpi_total"
          />
          <RoomKPICard
            label={t("empty")}
            value={isLoading ? "—" : emptyRooms}
            icon={<BedDouble className="h-4 w-4" />}
            accent="emerald"
            loading={isLoading}
            ocid="rooms.kpi_empty"
          />
          <RoomKPICard
            label="Partially Full"
            value={isLoading ? "—" : partialRooms}
            icon={<BedDouble className="h-4 w-4" />}
            accent="amber"
            loading={isLoading}
            ocid="rooms.kpi_partial"
          />
          <RoomKPICard
            label="Full"
            value={isLoading ? "—" : fullRooms}
            icon={<BedDouble className="h-4 w-4" />}
            accent="red"
            loading={isLoading}
            ocid="rooms.kpi_full"
          />
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <SkeletonCards />
        ) : rooms.length === 0 ? (
          <div
            className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-20 text-center"
            data-ocid="rooms.empty_state"
          >
            <div className="rounded-full bg-muted/40 p-5">
              <Building2 className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">
                No rooms yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Add your first room to start tracking seat allocation and
                occupancy.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setAddDialogOpen(true)}
              className="gap-2 mt-1 cursor-pointer"
              data-ocid="rooms.empty_add_button"
            >
              <Plus className="h-4 w-4" /> Add Your First Room
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            data-ocid="rooms.list"
          >
            {rooms.map((room, i) => (
              <RoomCard
                key={room.id.toString()}
                room={room}
                index={i}
                onClick={() => openRoom(room.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Room Dialog */}
      <RoomFormDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddRoom}
        isSaving={createRoom.isPending}
      />

      {/* Room Detail Sheet */}
      <RoomDetailSheet
        roomId={selectedRoomId}
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedRoomId(null);
        }}
      />
    </Layout>
  );
}

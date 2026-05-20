import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, r as reactExports, B as Button, b as BedDouble, S as Skeleton } from "./index-BHGx-AOT.js";
import { X, K as useRooms, M as useCreateRoom, N as useLanguage, V as Variant_full_empty_partial, L as Layout, B as Building2, U as Users, O as useRoom, Q as useUpdateRoom, W as useDeleteRoom, T as Trash2, l as Badge } from "./Layout-eWnk62al.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-0OsgAXp4.js";
import { f as Root, C as Content, g as Close, T as Title, i as Portal, O as Overlay, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { C as CircleCheck } from "./circle-check-Bi5fukHs.js";
import { P as Pen } from "./pen-COl7IO-I.js";
import "./index-zxbJdcQE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function statusLabel(status) {
  if (status === Variant_full_empty_partial.empty) return "Empty";
  if (status === Variant_full_empty_partial.partial) return "Partially Full";
  return "Full";
}
function deriveStatus(occupied, total) {
  if (occupied === 0) return Variant_full_empty_partial.empty;
  if (occupied >= total) return Variant_full_empty_partial.full;
  return Variant_full_empty_partial.partial;
}
function StatusBadge({ status }) {
  const { t } = useLanguage();
  if (status === Variant_full_empty_partial.empty)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium", children: t("empty") });
  if (status === Variant_full_empty_partial.partial)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium", children: t("partialRoom") });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium", children: t("full") });
}
function leftBorderClass(status) {
  if (status === Variant_full_empty_partial.empty) return "room-status-empty";
  if (status === Variant_full_empty_partial.partial)
    return "room-status-partial";
  return "room-status-full";
}
function RoomCard({
  room,
  index,
  onClick
}) {
  const seatCount = Number(room.seatCount);
  const occupiedSeats = Number(room.occupiedSeats);
  const occupiedPct = seatCount > 0 ? Math.round(occupiedSeats / seatCount * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "room-card group relative focus-ring w-full text-left",
        leftBorderClass(room.status)
      ),
      "data-ocid": `rooms.item.${index + 1}`,
      "aria-label": `Room ${room.roomNumber} — ${statusLabel(room.status)}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold text-foreground truncate leading-tight", children: [
              "#",
              room.roomNumber
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              seatCount,
              " seat",
              seatCount !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: room.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
            occupiedSeats,
            " / ",
            seatCount
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "occupied" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Occupancy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              occupiedPct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-full rounded-full transition-all duration-500",
                room.status === Variant_full_empty_partial.full ? "bg-destructive" : room.status === Variant_full_empty_partial.partial ? "bg-amber-500" : "bg-primary"
              ),
              style: { width: `${occupiedPct}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Click to manage" })
        ] })
      ]
    }
  );
}
function RoomDetailSheet({
  roomId,
  open,
  onClose
}) {
  const { data: room, isLoading } = useRoom(roomId ?? 0n);
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editNumber, setEditNumber] = reactExports.useState("");
  const [editSeatCount, setEditSeatCount] = reactExports.useState("");
  const [editOccupied, setEditOccupied] = reactExports.useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = reactExports.useState(false);
  const hasOccupied = room ? Number(room.occupiedSeats) > 0 : false;
  function startEdit(r) {
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
      seatCountNum
    );
    updateRoom.mutate(
      {
        id: room.id,
        input: {
          roomNumber: editNumber.trim(),
          seatCount: BigInt(seatCountNum)
        },
        occupiedSeats: BigInt(occupiedNum)
      },
      { onSuccess: () => setIsEditing(false) }
    );
  }
  function handleDelete() {
    if (!room) return;
    deleteRoom.mutate(room.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        onClose();
      }
    });
  }
  const displayOccupied = isEditing ? Math.min(
    Math.max(0, Number.parseInt(editOccupied, 10) || 0),
    Number.parseInt(editSeatCount, 10) || 0
  ) : room ? Number(room.occupiedSeats) : 0;
  const displayTotal = isEditing ? Number.parseInt(editSeatCount, 10) || 0 : room ? Number(room.seatCount) : 0;
  const previewStatus = deriveStatus(displayOccupied, displayTotal);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        side: "right",
        className: "w-full sm:max-w-md bg-card border-border overflow-y-auto",
        "data-ocid": "rooms.sheet",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between pr-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-40 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "font-display text-xl font-bold text-foreground", children: [
                "Room #",
                room == null ? void 0 : room.roomNumber
              ] }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: room ? `${Number(room.seatCount)} seats` : "" })
            ] }),
            !isLoading && room && /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusBadge,
              {
                status: isEditing ? previewStatus : deriveStatus(
                  Number(room.occupiedSeats),
                  Number(room.seatCount)
                )
              }
            )
          ] }) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-md" }, i)) }) : room ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3", children: "Seat Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: isEditing ? Number.parseInt(editSeatCount, 10) || 0 : Number(room.seatCount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: cn(
                        "text-2xl font-bold font-display",
                        displayOccupied > 0 ? "text-destructive" : "text-foreground"
                      ),
                      children: displayOccupied
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Occupied" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-primary", children: Math.max(0, displayTotal - displayOccupied) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Empty" })
                ] })
              ] })
            ] }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3",
                "data-ocid": "rooms.edit_form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Edit Room" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "edit-number",
                        className: "text-xs font-medium",
                        children: "Room Number"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "edit-number",
                        value: editNumber,
                        onChange: (e) => setEditNumber(e.target.value),
                        className: "h-10 text-sm cursor-text",
                        autoComplete: "off",
                        "data-ocid": "rooms.edit_number_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "edit-seatcount",
                          className: "text-xs font-medium",
                          children: "Total Seats"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "edit-seatcount",
                          type: "number",
                          min: 1,
                          step: 1,
                          inputMode: "numeric",
                          value: editSeatCount,
                          onChange: (e) => setEditSeatCount(e.target.value),
                          className: "h-10 text-sm cursor-text font-mono",
                          "data-ocid": "rooms.edit_seatcount_input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "edit-occupied",
                          className: "text-xs font-medium",
                          children: "Occupied Seats"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "edit-occupied",
                          type: "number",
                          min: 0,
                          step: 1,
                          inputMode: "numeric",
                          value: editOccupied,
                          onChange: (e) => {
                            const v = e.target.value;
                            const max = Number.parseInt(editSeatCount, 10) || 99;
                            const n = Math.min(
                              Math.max(0, Number.parseInt(v, 10) || 0),
                              max
                            );
                            setEditOccupied(v === "" ? "" : String(n));
                          },
                          className: "h-10 text-sm cursor-text font-mono",
                          placeholder: "0",
                          "data-ocid": "rooms.edit_occupied_input"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status preview:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: previewStatus })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        onClick: handleSaveEdit,
                        disabled: updateRoom.isPending || !editNumber.trim() || !editSeatCount || Number.parseInt(editSeatCount, 10) < 1,
                        className: "gap-1.5 cursor-pointer",
                        "data-ocid": "rooms.save_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                          updateRoom.isPending ? "Saving…" : "Save"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "ghost",
                        onClick: () => setIsEditing(false),
                        className: "cursor-pointer",
                        "data-ocid": "rooms.cancel_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 mr-1" }),
                          " Cancel"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "gap-1.5 flex-1 border-border cursor-pointer",
                  onClick: () => startEdit(room),
                  "data-ocid": "rooms.edit_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" }),
                    " Edit Room"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: hasOccupied,
                  title: hasOccupied ? "Cannot delete a room with students" : "Delete this room",
                  className: cn(
                    "gap-1.5 flex-1 border-border cursor-pointer",
                    !hasOccupied && "hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
                  ),
                  onClick: () => setDeleteConfirmOpen(true),
                  "data-ocid": "rooms.delete_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                    " Delete"
                  ]
                }
              )
            ] }),
            hasOccupied && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-2", children: "⚠️ Room cannot be deleted while students are occupying seats." })
          ] }) : null
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteConfirmOpen, onOpenChange: setDeleteConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "rooms.delete_dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Room?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will permanently delete room",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "#",
            room == null ? void 0 : room.roomNumber
          ] }),
          ". This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "rooms.delete_cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: deleteRoom.isPending,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            "data-ocid": "rooms.delete_confirm_button",
            children: deleteRoom.isPending ? "Deleting…" : "Delete Room"
          }
        )
      ] })
    ] }) })
  ] });
}
function RoomFormDialog({
  open,
  onClose,
  onSave,
  isSaving
}) {
  const [roomNumber, setRoomNumber] = reactExports.useState("");
  const [seatCount, setSeatCount] = reactExports.useState("");
  const [occupiedSeats, setOccupiedSeats] = reactExports.useState("0");
  const seatCountNum = Number.parseInt(seatCount, 10);
  const occupiedNum = Math.min(
    Math.max(0, Number.parseInt(occupiedSeats, 10) || 0),
    Number.isNaN(seatCountNum) ? 0 : seatCountNum
  );
  const previewStatus = Number.isNaN(seatCountNum) ? Variant_full_empty_partial.empty : deriveStatus(occupiedNum, seatCountNum);
  function handleSubmit(e) {
    e.preventDefault();
    if (!roomNumber.trim() || Number.isNaN(seatCountNum) || seatCountNum < 1)
      return;
    onSave(
      { roomNumber: roomNumber.trim(), seatCount: BigInt(seatCountNum) },
      BigInt(occupiedNum)
    );
  }
  function handleClose() {
    setRoomNumber("");
    setSeatCount("");
    setOccupiedSeats("0");
    onClose();
  }
  const isValid = roomNumber.trim().length > 0 && !Number.isNaN(seatCountNum) && seatCountNum >= 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border sm:max-w-sm",
      "data-ocid": "rooms.add_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg font-bold", children: "Add New Room" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "new-room-number", className: "text-sm font-semibold", children: [
              "Room Number ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "new-room-number",
                value: roomNumber,
                onChange: (e) => setRoomNumber(e.target.value),
                placeholder: "e.g. 101",
                required: true,
                autoFocus: true,
                className: "h-10 cursor-text",
                "data-ocid": "rooms.number_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "new-room-seatcount",
                  className: "text-sm font-semibold",
                  children: [
                    "Total Seats ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "new-room-seatcount",
                  type: "number",
                  min: 1,
                  step: 1,
                  inputMode: "numeric",
                  value: seatCount,
                  onChange: (e) => setSeatCount(e.target.value),
                  placeholder: "e.g. 4",
                  required: true,
                  className: "h-10 font-mono cursor-text",
                  "data-ocid": "rooms.seatcount_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "new-room-occupied",
                  className: "text-sm font-semibold",
                  children: "Occupied Seats"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "new-room-occupied",
                  type: "number",
                  min: 0,
                  step: 1,
                  inputMode: "numeric",
                  value: occupiedSeats,
                  onChange: (e) => {
                    const v = e.target.value;
                    const max = Number.isNaN(seatCountNum) ? 99 : seatCountNum;
                    const n = Math.min(
                      Math.max(0, Number.parseInt(v, 10) || 0),
                      max
                    );
                    setOccupiedSeats(v === "" ? "0" : String(n));
                  },
                  className: "h-10 font-mono cursor-text",
                  "data-ocid": "rooms.occupied_input"
                }
              )
            ] })
          ] }),
          seatCount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-muted/30 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: previewStatus }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
              occupiedNum,
              "/",
              seatCountNum || 0,
              " filled"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/20 rounded-md px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5 mt-0.5 shrink-0" }),
            "Enter how many seats are currently filled in this room."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: handleClose,
                className: "cursor-pointer",
                "data-ocid": "rooms.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: isSaving || !isValid,
                className: "gap-1.5 cursor-pointer",
                "data-ocid": "rooms.add_submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  isSaving ? "Adding…" : "Add Room"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function RoomKPICard({
  label,
  value,
  icon,
  accent,
  loading,
  ocid
}) {
  const accentClasses = {
    emerald: "text-primary bg-primary/10 border-primary/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-destructive bg-destructive/10 border-destructive/20",
    default: "text-muted-foreground bg-muted/30 border-border"
  };
  const iconClass = accentClasses[accent ?? "default"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card flex items-center gap-3", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-2 rounded-lg border", iconClass), children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label truncate", children: label }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground leading-tight", children: value })
    ] })
  ] });
}
function SkeletonCards() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-border bg-card p-4 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1.5 w-full rounded-full" })
      ]
    },
    i
  )) });
}
function RoomsPage() {
  const { data: rooms = [], isLoading } = useRooms();
  const createRoom = useCreateRoom();
  const { t } = useLanguage();
  const [addDialogOpen, setAddDialogOpen] = reactExports.useState(false);
  const [selectedRoomId, setSelectedRoomId] = reactExports.useState(null);
  const [sheetOpen, setSheetOpen] = reactExports.useState(false);
  const totalRooms = rooms.length;
  const emptyRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.empty
  ).length;
  const partialRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.partial
  ).length;
  const fullRooms = rooms.filter(
    (r) => r.status === Variant_full_empty_partial.full
  ).length;
  function openRoom(id) {
    setSelectedRoomId(id);
    setSheetOpen(true);
  }
  function handleAddRoom(input, _occupiedSeats) {
    createRoom.mutate(input, { onSuccess: () => setAddDialogOpen(false) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Layout,
    {
      title: t("rooms"),
      subtitle: "Manage hostel rooms and seat allocation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "rooms.page", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: t("rooms") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? t("loading") : `${totalRooms} room${totalRooms !== 1 ? "s" : ""} configured` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => setAddDialogOpen(true),
                className: "gap-2 shrink-0 cursor-pointer",
                "data-ocid": "rooms.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " ",
                  t("addRoom")
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoomKPICard,
              {
                label: "Total Rooms",
                value: isLoading ? "—" : totalRooms,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
                loading: isLoading,
                ocid: "rooms.kpi_total"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoomKPICard,
              {
                label: t("empty"),
                value: isLoading ? "—" : emptyRooms,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-4 w-4" }),
                accent: "emerald",
                loading: isLoading,
                ocid: "rooms.kpi_empty"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoomKPICard,
              {
                label: "Partially Full",
                value: isLoading ? "—" : partialRooms,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-4 w-4" }),
                accent: "amber",
                loading: isLoading,
                ocid: "rooms.kpi_partial"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoomKPICard,
              {
                label: "Full",
                value: isLoading ? "—" : fullRooms,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-4 w-4" }),
                accent: "red",
                loading: isLoading,
                ocid: "rooms.kpi_full"
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCards, {}) : rooms.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-20 text-center",
              "data-ocid": "rooms.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted/40 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 text-muted-foreground/50" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No rooms yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Add your first room to start tracking seat allocation and occupancy." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    onClick: () => setAddDialogOpen(true),
                    className: "gap-2 mt-1 cursor-pointer",
                    "data-ocid": "rooms.empty_add_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      " Add Your First Room"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              "data-ocid": "rooms.list",
              children: rooms.map((room, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                RoomCard,
                {
                  room,
                  index: i,
                  onClick: () => openRoom(room.id)
                },
                room.id.toString()
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RoomFormDialog,
          {
            open: addDialogOpen,
            onClose: () => setAddDialogOpen(false),
            onSave: handleAddRoom,
            isSaving: createRoom.isPending
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RoomDetailSheet,
          {
            roomId: selectedRoomId,
            open: sheetOpen,
            onClose: () => {
              setSheetOpen(false);
              setSelectedRoomId(null);
            }
          }
        )
      ]
    }
  );
}
export {
  RoomsPage as default
};

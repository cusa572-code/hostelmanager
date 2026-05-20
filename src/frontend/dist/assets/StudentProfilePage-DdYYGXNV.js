import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, e as useParams, f as useNavigate, r as reactExports, S as Skeleton, L as Link, B as Button, m as motion } from "./index-BHGx-AOT.js";
import { _ as useStudent, $ as useStudentUdhar, a0 as useVacateStudent, a1 as useDeleteStudent, L as Layout, a2 as User, Z as StudentStatus, l as Badge, a3 as SeatType, T as Trash2, B as Building2, a4 as Separator, a5 as useStudentPayments, a6 as CreditCard, a7 as useUpdateStudentPhoto, a8 as useUpdateStudentDocument, K as useRooms, a9 as useUpdateStudent, X, aa as PaymentStatus } from "./Layout-eWnk62al.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-tGAYEJgV.js";
import { A as ArrowLeft } from "./arrow-left-CbCNO325.js";
import { C as Calendar } from "./calendar-DKQPtQ2q.js";
import { I as IndianRupee } from "./indian-rupee-BTCKBSaK.js";
import { P as Pen } from "./pen-COl7IO-I.js";
import "./index-zxbJdcQE.js";
import "./index-DgyCW3I_.js";
import "./index-CndKChVc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
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
  "Dec"
];
function formatDate(ts) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatAmount(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function PaymentStatusBadge({ status }) {
  if (status === PaymentStatus.paid)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs", children: "Paid" });
  if (status === PaymentStatus.partial)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs", children: "Partial" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-destructive/30 bg-destructive/10 text-destructive text-xs", children: "Pending" });
}
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "student_profile.delete_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Student?" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete the student record and all associated data. This action cannot be undone." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClose,
          "data-ocid": "student_profile.delete_cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          onClick: onConfirm,
          disabled: isDeleting,
          "data-ocid": "student_profile.delete_confirm_button",
          children: isDeleting ? "Deleting…" : "Delete Student"
        }
      )
    ] })
  ] }) });
}
function VacateDialog({
  open,
  onClose,
  onConfirm,
  isVacating
}) {
  const [leaveDate, setLeaveDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "student_profile.vacate_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Mark as Vacated" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "vacate-date", children: "Leave Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "vacate-date",
          type: "date",
          value: leaveDate,
          onChange: (e) => setLeaveDate(e.target.value),
          "data-ocid": "student_profile.vacate_date_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClose,
          "data-ocid": "student_profile.vacate_cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => onConfirm(leaveDate),
          disabled: isVacating,
          "data-ocid": "student_profile.vacate_confirm_button",
          children: isVacating ? "Saving…" : "Confirm Vacate"
        }
      )
    ] })
  ] }) });
}
function EditProfileForm({
  student,
  onCancel,
  onSaved
}) {
  var _a;
  const { data: rooms = [] } = useRooms();
  const updateStudent = useUpdateStudent();
  const [name, setName] = reactExports.useState(student.name);
  const [phone, setPhone] = reactExports.useState(student.phone);
  const [address, setAddress] = reactExports.useState(student.address);
  const [idProofText, setIdProofText] = reactExports.useState(student.idProofText);
  const [roomId, setRoomId] = reactExports.useState(((_a = student.roomId) == null ? void 0 : _a.toString()) ?? "");
  const [seatType, setSeatType] = reactExports.useState(student.seatType ?? SeatType.typeA);
  const handleSubmit = (e) => {
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
          roomId: roomId ? BigInt(roomId) : void 0,
          seatType
        }
      },
      { onSuccess: onSaved }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ep-name", children: "Full Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ep-name",
            value: name,
            onChange: (e) => setName(e.target.value),
            required: true,
            "data-ocid": "student_profile.edit_name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ep-phone", children: "Phone *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ep-phone",
            type: "tel",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            required: true,
            "data-ocid": "student_profile.edit_phone_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ep-address", children: "Address" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "ep-address",
          value: address,
          onChange: (e) => setAddress(e.target.value),
          "data-ocid": "student_profile.edit_address_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ep-idproof", children: "ID Proof" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "ep-idproof",
          value: idProofText,
          onChange: (e) => setIdProofText(e.target.value),
          placeholder: "e.g. Aadhar: 1234-5678-9012",
          "data-ocid": "student_profile.edit_idproof_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Room Assignment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: roomId,
            onChange: (e) => setRoomId(e.target.value),
            className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "data-ocid": "student_profile.edit_room_select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No room assigned" }),
              rooms.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.id.toString(), children: [
                "Room #",
                r.roomNumber
              ] }, r.id.toString()))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Seat Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: seatType,
            onChange: (e) => setSeatType(e.target.value),
            className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "data-ocid": "student_profile.edit_seat_type_select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SeatType.typeA, children: "Type A (₹8,500)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: SeatType.typeB, children: "Type B (₹8,900)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: onCancel,
          "data-ocid": "student_profile.edit_cancel_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 mr-1" }),
            " Cancel"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          size: "sm",
          disabled: updateStudent.isPending,
          "data-ocid": "student_profile.edit_save_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5 mr-1" }),
            updateStudent.isPending ? "Saving…" : "Save Changes"
          ]
        }
      )
    ] })
  ] });
}
function PhotoUpload({
  studentId,
  photoKey
}) {
  const updatePhoto = useUpdateStudentPhoto();
  const inputRef = reactExports.useRef(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    updatePhoto.mutate({
      id: studentId,
      photoKey: `photo_${studentId}_${file.name}`
    });
  };
  const displaySrc = previewUrl ?? (photoKey ? `/assets/uploaded/${photoKey}` : null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center", children: displaySrc ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: displaySrc,
        alt: "Profile",
        className: "h-full w-full object-cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-muted-foreground/40" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Profile Photo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          onClick: () => {
            var _a;
            return (_a = inputRef.current) == null ? void 0 : _a.click();
          },
          disabled: updatePhoto.isPending,
          "data-ocid": "student_profile.upload_photo_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
            updatePhoto.isPending ? "Uploading…" : photoKey ? "Change Photo" : "Upload Photo"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: handleFileChange
        }
      ),
      photoKey && !previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-emerald-400", children: "Photo on file ✓" })
    ] })
  ] });
}
function DocumentUpload({
  studentId,
  documentKey
}) {
  const updateDoc = useUpdateStudentDocument();
  const inputRef = reactExports.useRef(null);
  const [uploaded, setUploaded] = reactExports.useState(false);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setUploaded(true);
    updateDoc.mutate({
      id: studentId,
      documentKey: `doc_${studentId}_${file.name}`
    });
  };
  const hasDoc = documentKey || uploaded;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "ID Document" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: hasDoc ? "Document uploaded" : "Aadhar / ID proof" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      hasDoc && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-400 font-medium", children: "✓ On file" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          onClick: () => {
            var _a;
            return (_a = inputRef.current) == null ? void 0 : _a.click();
          },
          disabled: updateDoc.isPending,
          "data-ocid": "student_profile.upload_document_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
            updateDoc.isPending ? "Uploading…" : hasDoc ? "Replace" : "Upload"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "file",
          accept: ".pdf,.jpg,.jpeg,.png",
          className: "hidden",
          onChange: handleFileChange
        }
      )
    ] })
  ] });
}
function DetailsTab({ student }) {
  const [editing, setEditing] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoUpload, { studentId: student.id, photoKey: student.photoKey }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DocumentUpload,
      {
        studentId: student.id,
        documentKey: student.documentKey
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
    editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditProfileForm,
      {
        student,
        onCancel: () => setEditing(false),
        onSaved: () => setEditing(false)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
            label: "Phone",
            value: student.phone
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            label: "Join Date",
            value: formatDate(student.joinDate)
          }
        ),
        student.leaveDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            label: "Leave Date",
            value: formatDate(student.leaveDate)
          }
        ),
        student.roomId !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
            label: "Room",
            value: `Room #${student.roomId.toString()}`
          }
        ),
        student.seatType && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }),
            label: "Seat Type",
            value: student.seatType === SeatType.typeA ? "Type A (₹8,500)" : "Type B (₹8,900)"
          }
        ),
        student.address && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            label: "Address",
            value: student.address
          }
        ) }),
        student.idProofText && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
            label: "ID Proof",
            value: student.idProofText
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          onClick: () => setEditing(true),
          "data-ocid": "student_profile.edit_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" }),
            " Edit Profile"
          ]
        }
      )
    ] })
  ] });
}
function InfoRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 shrink-0 text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground break-words", children: value })
    ] })
  ] });
}
function PaymentsTab({ studentId }) {
  const { data: payments = [], isLoading } = useStudentPayments(studentId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, i)) });
  }
  if (payments.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-2 py-12 text-center",
        "data-ocid": "student_profile.payments_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-8 w-8 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No payment history yet" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-lg border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_1fr_1fr_auto] gap-3 bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Month / Year" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Rent Due" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Paid" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
    ] }),
    payments.map((p, i) => {
      const monthIdx = Math.max(0, Math.min(11, Number(p.month) - 1));
      const monthLabel = `${MONTHS[monthIdx]} ${Number(p.year)}`;
      const lateFeeAmount = p.lateFee > 0n ? ` + ₹${Number(p.lateFee).toLocaleString("en-IN")} late fee` : "";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 border-t border-border/50 px-4 py-3",
          "data-ocid": `student_profile.payment.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: monthLabel }),
              lateFeeAmount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: lateFeeAmount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-right text-sm text-foreground", children: formatAmount(p.rentDue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-right text-sm font-semibold text-foreground", children: formatAmount(p.paidAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: p.status })
          ]
        },
        p.id.toString()
      );
    })
  ] });
}
function StudentProfilePage() {
  const { studentId } = useParams({ from: "/students/$studentId" });
  const id = BigInt(studentId);
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudent(id);
  const { data: udharSummary } = useStudentUdhar(id);
  const vacate = useVacateStudent();
  const deleteStudent = useDeleteStudent();
  const [deleteOpen, setDeleteOpen] = reactExports.useState(false);
  const [vacateOpen, setVacateOpen] = reactExports.useState(false);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Student Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" })
    ] }) });
  }
  if (!student) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Student Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Student not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/students", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", "data-ocid": "student_profile.back_button", children: "Back to Students" }) })
    ] }) });
  }
  const isActive = student.status === StudentStatus.active;
  const handleDelete = () => {
    deleteStudent.mutate(id, {
      onSuccess: () => navigate({ to: "/students" })
    });
  };
  const handleVacate = (dateStr) => {
    const ts = BigInt(new Date(dateStr).getTime()) * 1000000n;
    vacate.mutate(
      { id, leaveDate: ts },
      { onSuccess: () => setVacateOpen(false) }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Student Profile", subtitle: student.name, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/students",
          className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth",
          "data-ocid": "student_profile.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Back to Students"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-1.5 w-full ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                    children: getInitials(student.name)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl", children: student.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: isActive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs" : "border-muted-foreground/30 bg-muted text-muted-foreground text-xs",
                        children: isActive ? "Active" : "Vacated"
                      }
                    ),
                    student.seatType && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: student.seatType === SeatType.typeA ? "Type A" : "Type B" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: [
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "text-amber-400 border-amber-500/30 hover:bg-amber-500/10",
                    onClick: () => setVacateOpen(true),
                    disabled: vacate.isPending,
                    "data-ocid": "student_profile.vacate_button",
                    children: "Mark Vacated"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                    onClick: () => setDeleteOpen(true),
                    "data-ocid": "student_profile.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
                  " ",
                  student.phone
                ] }),
                student.roomId !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
                  "Room #",
                  student.roomId.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
                  " Joined",
                  " ",
                  formatDate(student.joinDate)
                ] })
              ] }),
              udharSummary && udharSummary.totalOutstanding > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-amber-400", children: "Udhar Outstanding" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-400", children: formatAmount(udharSummary.totalOutstanding) })
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, delay: 0.08 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "details", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-5 w-full sm:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsTrigger,
                {
                  value: "details",
                  className: "flex-1 sm:flex-none",
                  "data-ocid": "student_profile.tab.details",
                  children: "Details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsTrigger,
                {
                  value: "payments",
                  className: "flex-1 sm:flex-none",
                  "data-ocid": "student_profile.tab.payments",
                  children: "Payment History"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DetailsTab, { student }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "payments", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentsTab, { studentId: id }) })
          ] }) }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: deleteOpen,
        onClose: () => setDeleteOpen(false),
        onConfirm: handleDelete,
        isDeleting: deleteStudent.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VacateDialog,
      {
        open: vacateOpen,
        onClose: () => setVacateOpen(false),
        onConfirm: handleVacate,
        isVacating: vacate.isPending
      }
    )
  ] });
}
export {
  StudentProfilePage as default
};

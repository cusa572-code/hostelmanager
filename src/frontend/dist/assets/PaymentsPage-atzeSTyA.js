import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, S as Skeleton, T as TrendingUp } from "./index-BHGx-AOT.js";
import { ac as usePayments, Y as useStudents, ad as useHostelSettings, N as useLanguage, aa as PaymentStatus, L as Layout, a6 as CreditCard, o as CircleAlert, T as Trash2, ae as useCreatePayment, af as useUpdatePayment, c as useSeatConfig, _ as useStudent, a3 as SeatType, ag as useDeletePayment, ah as useUpdateHostelSettings, p as Clock } from "./Layout-eWnk62al.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYMKrls9.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-tGAYEJgV.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { I as IndianRupee } from "./indian-rupee-BTCKBSaK.js";
import { P as Pen } from "./pen-COl7IO-I.js";
import { C as CircleCheck } from "./circle-check-Bi5fukHs.js";
import "./index-zxbJdcQE.js";
import "./index-CndKChVc.js";
import "./index-DbL77mm9.js";
import "./index-B33C2THV.js";
import "./index-BAJoFaFv.js";
import "./check-CR3PGC7v.js";
import "./index-DgyCW3I_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
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
  "December"
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
  "Dec"
];
function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function fmtNum(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function calcOverdueDays(year, month) {
  const dueDate = new Date(year, month - 1, 1);
  const now = /* @__PURE__ */ new Date();
  if (now <= dueDate) return 0;
  return Math.max(
    0,
    Math.floor((now.getTime() - dueDate.getTime()) / (1e3 * 60 * 60 * 24))
  );
}
function calcLateFee(overdueDays, lateFeePerMonth) {
  return Math.floor(overdueDays / 30) * lateFeePerMonth;
}
function suggestStatus(paid, due) {
  if (paid <= 0) return PaymentStatus.pending;
  if (paid >= due) return PaymentStatus.paid;
  return PaymentStatus.partial;
}
function StatusBadge({ status }) {
  const { t } = useLanguage();
  if (status === PaymentStatus.paid)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      " ",
      t("paid")
    ] });
  if (status === PaymentStatus.partial)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      " ",
      t("partial")
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-destructive/15 text-destructive border border-destructive/25", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
    " ",
    t("pending")
  ] });
}
function SettingsModal({
  open,
  onClose
}) {
  const { data: settings } = useHostelSettings();
  const update = useUpdateHostelSettings();
  const [lateFee, setLateFee] = reactExports.useState("100");
  reactExports.useEffect(() => {
    if (settings) setLateFee(String(Number(settings.lateFeePerMonth)));
  }, [settings]);
  const handleSave = (e) => {
    e.preventDefault();
    const s = {
      lateFeePerMonth: BigInt(Math.round(Number(lateFee) || 0))
    };
    update.mutate(s, { onSuccess: onClose });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "settings.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-primary" }),
      " Hostel Settings"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "st-latefee", children: "Late Fee Per Month (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "st-latefee",
            type: "number",
            min: "0",
            value: lateFee,
            onChange: (e) => setLateFee(e.target.value),
            placeholder: "e.g. 100",
            "data-ocid": "settings.late_fee_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Applied per 30-day overdue period per payment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: onClose,
            "data-ocid": "settings.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: update.isPending,
            "data-ocid": "settings.save_button",
            children: update.isPending ? "Saving…" : "Save Settings"
          }
        )
      ] })
    ] })
  ] }) });
}
function getDefaultMonth() {
  return String((/* @__PURE__ */ new Date()).getMonth() + 1);
}
function getDefaultYear() {
  return String((/* @__PURE__ */ new Date()).getFullYear());
}
function PaymentFormModal({
  open,
  onClose,
  students,
  editPayment
}) {
  const create = useCreatePayment();
  const update = useUpdatePayment();
  const isEdit = !!editPayment;
  const { data: seatConfig } = useSeatConfig();
  const [sid, setSid] = reactExports.useState((editPayment == null ? void 0 : editPayment.studentId.toString()) ?? "");
  const [month, setMonth] = reactExports.useState(
    editPayment ? String(Number(editPayment.month)) : getDefaultMonth()
  );
  const [year, setYear] = reactExports.useState(
    editPayment ? String(Number(editPayment.year)) : getDefaultYear()
  );
  const [rentDue, setRentDue] = reactExports.useState(
    editPayment ? String(Number(editPayment.rentDue)) : ""
  );
  const [paidAmount, setPaidAmount] = reactExports.useState(
    editPayment ? String(Number(editPayment.paidAmount)) : "0"
  );
  const [status, setStatus] = reactExports.useState(
    (editPayment == null ? void 0 : editPayment.status) ?? PaymentStatus.pending
  );
  const [note, setNote] = reactExports.useState((editPayment == null ? void 0 : editPayment.note) ?? "");
  const studentIdBigInt = sid ? BigInt(sid) : 0n;
  const { data: selectedStudent } = useStudent(studentIdBigInt);
  reactExports.useEffect(() => {
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
  }, [editPayment]);
  const handleStudentChange = (val) => {
    setSid(val);
  };
  reactExports.useEffect(() => {
    if (!sid || isEdit) return;
    if (selectedStudent) {
      const configuredPrice = selectedStudent.seatType === SeatType.typeB ? seatConfig == null ? void 0 : seatConfig.pricePerSeatB : seatConfig == null ? void 0 : seatConfig.pricePerSeatA;
      const priceNum = configuredPrice ? Number(configuredPrice) : 0;
      setRentDue(priceNum > 0 ? String(priceNum) : "");
    }
  }, [selectedStudent, sid, isEdit, seatConfig]);
  const handlePaidAmountChange = (val) => {
    setPaidAmount(val);
    const paid = Number(val) || 0;
    const due = Number(rentDue) || 0;
    if (due > 0) setStatus(suggestStatus(paid, due));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = {
      studentId: BigInt(sid),
      month: BigInt(month),
      year: BigInt(year),
      rentDue: BigInt(Math.round(Number(rentDue) || 0)),
      paidAmount: BigInt(Math.round(Number(paidAmount) || 0)),
      status,
      note: note.trim() || void 0
    };
    if (isEdit && editPayment) {
      update.mutate({ id: editPayment.id, input }, { onSuccess: onClose });
    } else {
      create.mutate(input, { onSuccess: onClose });
    }
  };
  const isPending = create.isPending || update.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "payments.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-primary" }),
      isEdit ? "Edit Payment" : "Record Payment"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Student *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: sid,
            onValueChange: handleStudentChange,
            required: true,
            disabled: isEdit,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "payments.student_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString())) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: month, onValueChange: setMonth, disabled: isEdit, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "payments.month_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, m)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "py-year", children: "Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "py-year",
              type: "number",
              min: "2020",
              max: "2099",
              value: year,
              onChange: (e) => setYear(e.target.value),
              disabled: isEdit,
              "data-ocid": "payments.year_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "py-rentdue", children: [
            "Rent Due (₹)",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: sid && !selectedStudent ? "loading…" : (selectedStudent == null ? void 0 : selectedStudent.seatType) ? `Type ${selectedStudent.seatType === SeatType.typeB ? "B" : "A"}` : "enter manually" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "py-rentdue",
              type: "number",
              min: "0",
              value: rentDue,
              onChange: (e) => setRentDue(e.target.value),
              placeholder: "₹ Enter amount",
              "data-ocid": "payments.rent_due_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "py-paid", children: "Paid Amount (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "py-paid",
              type: "number",
              min: "0",
              value: paidAmount,
              onChange: (e) => handlePaidAmountChange(e.target.value),
              "data-ocid": "payments.paid_amount_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Status",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: "auto-suggested" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: status,
            onValueChange: (v) => setStatus(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "payments.status_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.paid, children: "✅ Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.partial, children: "⏳ Partial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.pending, children: "❌ Pending" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "py-note", children: "Note (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "py-note",
            value: note,
            onChange: (e) => setNote(e.target.value),
            placeholder: "e.g. Paid via UPI, partial payment",
            "data-ocid": "payments.note_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: onClose,
            "data-ocid": "payments.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending || !sid,
            "data-ocid": "payments.submit_button",
            children: isPending ? "Saving…" : isEdit ? "Update Payment" : "Save Payment"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteConfirmModal({
  open,
  onClose,
  paymentId
}) {
  const del = useDeletePayment();
  const handleDelete = () => {
    if (!paymentId) return;
    del.mutate(paymentId, { onSuccess: onClose });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "payments.delete_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Payment?" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete this payment record. This action cannot be undone." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClose,
          "data-ocid": "payments.delete_cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          onClick: handleDelete,
          disabled: del.isPending,
          "data-ocid": "payments.delete_confirm_button",
          children: del.isPending ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function PaymentRow({
  payment,
  index,
  studentName,
  roomNumber,
  lateFeePerMonth,
  onEdit,
  onDelete
}) {
  const yr = Number(payment.year);
  const mo = Number(payment.month);
  const overdueDays = payment.status !== PaymentStatus.paid ? calcOverdueDays(yr, mo) : 0;
  const lateFee = calcLateFee(overdueDays, lateFeePerMonth);
  const balance = Number(payment.rentDue) - Number(payment.paidAmount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border transition-colors hover:bg-muted/10 group",
      "data-ocid": `payments.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 pl-4 pr-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: studentName }),
          roomNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Room ",
            roomNumber
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-3 text-sm text-muted-foreground", children: [
          MONTHS_SHORT[mo - 1],
          " ",
          yr
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right text-sm font-mono text-foreground", children: fmt(payment.rentDue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-3 text-right text-sm font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: payment.status === PaymentStatus.paid ? "text-emerald-400" : "text-foreground",
              children: fmt(payment.paidAmount)
            }
          ),
          balance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive/80", children: [
            "−",
            fmtNum(balance),
            " due"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: payment.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center text-sm", children: overdueDays > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium", children: [
          overdueDays,
          "d"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right text-sm font-mono", children: lateFee > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: fmtNum(lateFee) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pl-2 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-muted-foreground hover:text-primary",
              onClick: () => onEdit(payment),
              "data-ocid": `payments.edit_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-muted-foreground/50 hover:text-destructive",
              onClick: () => onDelete(payment.id),
              "data-ocid": `payments.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
function PaymentCard({
  payment,
  index,
  studentName,
  roomNumber,
  lateFeePerMonth,
  onEdit,
  onDelete
}) {
  const yr = Number(payment.year);
  const mo = Number(payment.month);
  const overdueDays = payment.status !== PaymentStatus.paid ? calcOverdueDays(yr, mo) : 0;
  const lateFee = calcLateFee(overdueDays, lateFeePerMonth);
  const balance = Number(payment.rentDue) - Number(payment.paidAmount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-border bg-card p-4 space-y-3",
      "data-ocid": `payments.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: studentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              roomNumber ? `Room ${roomNumber} · ` : "",
              MONTHS_SHORT[mo - 1],
              " ",
              yr
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-muted-foreground hover:text-primary",
                onClick: () => onEdit(payment),
                "data-ocid": `payments.edit_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-muted-foreground/50 hover:text-destructive",
                onClick: () => onDelete(payment.id),
                "data-ocid": `payments.delete_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Rent Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-medium text-foreground", children: fmt(payment.rentDue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono font-medium ${payment.status === PaymentStatus.paid ? "text-emerald-400" : "text-foreground"}`,
                children: fmt(payment.paidAmount)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: payment.status })
          ] })
        ] }),
        (overdueDays > 0 || balance > 0 || payment.note) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs", children: [
          balance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive/80", children: [
            "Balance: ",
            fmtNum(balance)
          ] }),
          overdueDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
            "Overdue: ",
            overdueDays,
            " days"
          ] }),
          lateFee > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive/80", children: [
            "Late fee: ",
            fmtNum(lateFee)
          ] }),
          payment.note && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: payment.note })
        ] })
      ]
    }
  );
}
function KPICards({
  payments,
  lateFeePerMonth
}) {
  const totalCollected = payments.filter((p) => p.status === PaymentStatus.paid).reduce((s, p) => s + Number(p.paidAmount), 0);
  const totalPending = payments.filter((p) => p.status !== PaymentStatus.paid).reduce((s, p) => s + (Number(p.rentDue) - Number(p.paidAmount)), 0);
  const overdueStudents = payments.filter((p) => {
    if (p.status === PaymentStatus.paid) return false;
    return calcOverdueDays(Number(p.year), Number(p.month)) > 0;
  }).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5",
        "data-ocid": "payments.collected_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-emerald-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-emerald-400/80", children: "Total Collected" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-emerald-400 font-display", children: fmtNum(totalCollected) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-400/60 mt-1", children: [
            payments.filter((p) => p.status === PaymentStatus.paid).length,
            " paid records"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-amber-500/20 bg-amber-500/5 p-5",
        "data-ocid": "payments.pending_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4 text-amber-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-amber-400/80", children: "Pending Amount" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-amber-400 font-display", children: fmtNum(totalPending) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-400/60 mt-1", children: [
            payments.filter((p) => p.status !== PaymentStatus.paid).length,
            " ",
            "unpaid records"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-destructive/20 bg-destructive/5 p-5",
        "data-ocid": "payments.overdue_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-destructive/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-destructive/80", children: "Overdue Students" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-destructive font-display", children: overdueStudents }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive/60 mt-1", children: [
            "Late fee: ",
            fmtNum(lateFeePerMonth),
            "/mo per record"
          ] })
        ]
      }
    )
  ] });
}
function PaymentsPage() {
  const { data: allPayments = [], isLoading } = usePayments();
  const { data: students = [] } = useStudents();
  const { data: settings } = useHostelSettings();
  const { t } = useLanguage();
  const lateFeePerMonth = settings ? Number(settings.lateFeePerMonth) : 100;
  const now = /* @__PURE__ */ new Date();
  const [filterMonth, setFilterMonth] = reactExports.useState(String(now.getMonth() + 1));
  const [filterYear, setFilterYear] = reactExports.useState(String(now.getFullYear()));
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editPayment, setEditPayment] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const studentMap = new Map(students.map((s) => [s.id.toString(), s]));
  const getStudentName = (id) => {
    var _a;
    return ((_a = studentMap.get(id.toString())) == null ? void 0 : _a.name) ?? `Student #${id}`;
  };
  const getRoomNumber = (id) => {
    var _a;
    return ((_a = studentMap.get(id.toString())) == null ? void 0 : _a.roomNumber) ?? "";
  };
  const monthFiltered = allPayments.filter((p) => {
    const matchMonth = !filterMonth || Number(p.month) === Number(filterMonth);
    const matchYear = !filterYear || Number(p.year) === Number(filterYear);
    return matchMonth && matchYear;
  });
  const filtered = monthFiltered.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "paid") return p.status === PaymentStatus.paid;
    if (statusFilter === "partial") return p.status === PaymentStatus.partial;
    if (statusFilter === "pending") return p.status === PaymentStatus.pending;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const yrDiff = Number(b.year) - Number(a.year);
    if (yrDiff !== 0) return yrDiff;
    const moDiff = Number(b.month) - Number(a.month);
    if (moDiff !== 0) return moDiff;
    return getStudentName(a.studentId).localeCompare(
      getStudentName(b.studentId)
    );
  });
  const openEdit = (p) => {
    setEditPayment(p);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditPayment(null);
  };
  const years = Array.from(
    { length: 6 },
    (_, i) => String(now.getFullYear() - 2 + i)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Layout,
    {
      title: t("payments"),
      subtitle: "Track rent collection and payment history",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground font-display", children: t("payments") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "h-9 w-9 border-border text-muted-foreground hover:text-foreground",
                  onClick: () => setSettingsOpen(true),
                  "data-ocid": "payments.settings_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => {
                    setEditPayment(null);
                    setFormOpen(true);
                  },
                  className: "gap-2",
                  "data-ocid": "payments.add_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("addPayment") })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICards, { payments: monthFiltered, lateFeePerMonth }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterMonth, onValueChange: setFilterMonth, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-36 h-8 text-sm",
                    "data-ocid": "payments.month_filter",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, m)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterYear, onValueChange: setFilterYear, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-24 h-8 text-sm",
                    "data-ocid": "payments.year_filter",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: years.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: y, children: y }, y)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tabs,
              {
                value: statusFilter,
                onValueChange: (v) => setStatusFilter(v),
                "data-ocid": "payments.filter.tab",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-8 gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "all",
                      className: "h-7 px-3 text-xs",
                      "data-ocid": "payments.filter_all",
                      children: [
                        "All (",
                        monthFiltered.length,
                        ")"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "paid",
                      className: "h-7 px-3 text-xs",
                      "data-ocid": "payments.filter_paid",
                      children: "Paid"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "partial",
                      className: "h-7 px-3 text-xs",
                      "data-ocid": "payments.filter_partial",
                      children: "Partial"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "pending",
                      className: "h-7 px-3 text-xs",
                      "data-ocid": "payments.filter_pending",
                      children: "Pending"
                    }
                  )
                ] })
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center",
              "data-ocid": "payments.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-8 w-8 text-muted-foreground/40" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No payment records" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: statusFilter !== "all" ? `No ${statusFilter} payments for ${MONTHS_SHORT[Number(filterMonth) - 1]} ${filterYear}` : `No payments recorded for ${MONTHS_SHORT[Number(filterMonth) - 1]} ${filterYear}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => {
                      setEditPayment(null);
                      setFormOpen(true);
                    },
                    className: "mt-2 gap-2",
                    "data-ocid": "payments.empty_add_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      " Record Payment"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pl-4 pr-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Student" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Rent Due" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Overdue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Late Fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pl-2 pr-4" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                PaymentRow,
                {
                  payment: p,
                  index: i,
                  studentName: getStudentName(p.studentId),
                  roomNumber: getRoomNumber(p.studentId),
                  lateFeePerMonth,
                  onEdit: openEdit,
                  onDelete: (id) => setDeleteId(id)
                },
                p.id.toString()
              )) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 md:hidden", children: sorted.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              PaymentCard,
              {
                payment: p,
                index: i,
                studentName: getStudentName(p.studentId),
                roomNumber: getRoomNumber(p.studentId),
                lateFeePerMonth,
                onEdit: openEdit,
                onDelete: (id) => setDeleteId(id)
              },
              p.id.toString()
            )) }),
            sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                sorted.length,
                " record",
                sorted.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Showing ",
                MONTHS_SHORT[Number(filterMonth) - 1],
                " ",
                filterYear,
                statusFilter !== "all" ? ` · ${statusFilter}` : ""
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PaymentFormModal,
          {
            open: formOpen,
            onClose: closeForm,
            students,
            editPayment
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteConfirmModal,
          {
            open: deleteId !== null,
            onClose: () => setDeleteId(null),
            paymentId: deleteId
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsModal,
          {
            open: settingsOpen,
            onClose: () => setSettingsOpen(false)
          }
        )
      ]
    }
  );
}
export {
  PaymentsPage as default
};

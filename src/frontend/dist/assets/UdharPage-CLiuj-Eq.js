import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, S as Skeleton } from "./index-BHGx-AOT.js";
import { ai as useUdharEntries, Y as useStudents, N as useLanguage, L as Layout, U as Users, aj as Wallet, $ as useStudentUdhar, ak as useDeleteUdharEntry, al as UdharCategory, a6 as CreditCard, am as useCreateUdharEntry, an as useMarkUdharPaid, l as Badge, X } from "./Layout-eWnk62al.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-0OsgAXp4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYMKrls9.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { A as ArrowLeft } from "./arrow-left-CbCNO325.js";
import { C as CircleCheck } from "./circle-check-Bi5fukHs.js";
import "./index-zxbJdcQE.js";
import "./index-CndKChVc.js";
import "./index-DbL77mm9.js";
import "./index-B33C2THV.js";
import "./index-BAJoFaFv.js";
import "./check-CR3PGC7v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2h8", key: "1ssgc1" }],
  [
    "path",
    {
      d: "M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2",
      key: "qtp12x"
    }
  ],
  ["path", { d: "M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0", key: "ygeh44" }]
];
const Milk = createLucideIcon("milk", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m15 11-1 9", key: "5wnq3a" }],
  ["path", { d: "m19 11-4-7", key: "cnml18" }],
  ["path", { d: "M2 11h20", key: "3eubbj" }],
  ["path", { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4", key: "yiazzp" }],
  ["path", { d: "M4.5 15.5h15", key: "13mye1" }],
  ["path", { d: "m5 11 4-7", key: "116ra9" }],
  ["path", { d: "m9 11 1 9", key: "1ojof7" }]
];
const ShoppingBasket = createLucideIcon("shopping-basket", __iconNode$1);
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
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function fmtDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
const CAT_META = {
  [UdharCategory.milk]: {
    label: "Milk",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Milk, { className: "h-3.5 w-3.5" }),
    cls: "border-blue-400/30 bg-blue-400/10 text-blue-400"
  },
  [UdharCategory.grocery]: {
    label: "Grocery",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBasket, { className: "h-3.5 w-3.5" }),
    cls: "border-amber-500/30 bg-amber-500/10 text-amber-400"
  },
  [UdharCategory.other]: {
    label: "Other",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
    cls: "border-border bg-muted/50 text-muted-foreground"
  }
};
function CategoryBadge({ cat }) {
  const { label, icon, cls } = CAT_META[cat] ?? CAT_META[UdharCategory.other];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `gap-1 text-xs ${cls}`, children: [
    icon,
    label
  ] });
}
function AddUdharDialog({ open, onClose, prefilledStudentId }) {
  const { data: students = [] } = useStudents();
  const create = useCreateUdharEntry();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [sid, setSid] = reactExports.useState(prefilledStudentId ?? "");
  const [description, setDescription] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState(UdharCategory.other);
  const [date, setDate] = reactExports.useState(today);
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
  function handleSubmit(e) {
    e.preventDefault();
    const input = {
      studentId: BigInt(sid),
      description,
      amount: BigInt(amount),
      category,
      date: BigInt(new Date(date).getTime()) * 1000000n
    };
    create.mutate(input, { onSuccess: handleClose });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "udhar.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5 text-primary" }),
      "Add Udhar Entry"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      !prefilledStudentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Student *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sid, onValueChange: setSid, required: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "udhar.student_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString())) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ud-desc", children: "Description *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ud-desc",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "e.g. Daily milk, grocery items…",
            required: true,
            "data-ocid": "udhar.description_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ud-amount", children: "Amount (₹) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "ud-amount",
              type: "number",
              min: "1",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              placeholder: "0",
              required: true,
              "data-ocid": "udhar.amount_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: category,
              onValueChange: (v) => setCategory(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "udhar.category_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UdharCategory.milk, children: "🥛 Milk" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UdharCategory.grocery, children: "🛒 Grocery" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UdharCategory.other, children: "📌 Other" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ud-date", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ud-date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            "data-ocid": "udhar.date_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: handleClose,
            "data-ocid": "udhar.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: create.isPending || !sid || !amount || !description,
            "data-ocid": "udhar.submit_button",
            children: create.isPending ? "Saving…" : "Add Entry"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "udhar.delete_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Udhar Entry?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This entry will be permanently removed. This action cannot be undone." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogCancel,
        {
          onClick: onCancel,
          "data-ocid": "udhar.delete_cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          onClick: onConfirm,
          disabled: isPending,
          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          "data-ocid": "udhar.delete_confirm_button",
          children: isPending ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function UdharEntryRow({
  entry,
  index,
  onDeleteRequest
}) {
  const markPaid = useMarkUdharPaid();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `udhar-entry group ${entry.isPaid ? "opacity-60" : ""}`,
      "data-ocid": `udhar.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { cat: entry.category }),
            entry.isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 border-primary/30 bg-primary/10 text-primary text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              " Paid"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-sm font-medium ${entry.isPaid ? "line-through text-muted-foreground" : "text-foreground"}`,
              children: entry.description
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fmtDate(entry.date) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-bold tabular-nums ${entry.isPaid ? "line-through text-muted-foreground" : "text-foreground"}`,
              children: fmt(entry.amount)
            }
          ),
          !entry.isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 gap-1 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10",
              onClick: () => markPaid.mutate(entry.id),
              disabled: markPaid.isPending,
              "data-ocid": `udhar.mark_paid_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                "Mark Paid"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth",
              onClick: () => onDeleteRequest(entry.id),
              "aria-label": "Delete entry",
              "data-ocid": `udhar.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] })
      ]
    }
  );
}
function StudentLedger({
  student,
  onBack,
  onAddEntry
}) {
  const { data: summary, isLoading } = useStudentUdhar(student.id);
  const deleteEntry = useDeleteUdharEntry();
  const [catFilter, setCatFilter] = reactExports.useState("all");
  const [paidFilter, setPaidFilter] = reactExports.useState(
    "all"
  );
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const entries = (summary == null ? void 0 : summary.entries) ?? [];
  const filtered = entries.filter((e) => {
    const matchCat = catFilter === "all" || e.category === catFilter;
    const matchPaid = paidFilter === "all" || paidFilter === "paid" && e.isPaid || paidFilter === "unpaid" && !e.isPaid;
    return matchCat && matchPaid;
  });
  const outstanding = (summary == null ? void 0 : summary.totalOutstanding) ?? 0n;
  const totalPaid = entries.filter((e) => e.isPaid).reduce((s, e) => s + e.amount, 0n);
  const totalUnpaid = entries.filter((e) => !e.isPaid).reduce((s, e) => s + e.amount, 0n);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-9 w-9 shrink-0",
          onClick: onBack,
          "data-ocid": "udhar.back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground truncate", children: student.name }),
        student.roomNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Room ",
          student.roomNumber
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 shrink-0",
          onClick: onAddEntry,
          "data-ocid": "udhar.ledger_add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Entry"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-lg border px-4 py-3 ${outstanding > 0n ? "border-red-500/20 bg-red-500/5" : "border-primary/20 bg-primary/5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xs font-medium ${outstanding > 0n ? "text-red-400/80" : "text-primary/80"}`,
                children: "Outstanding"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `mt-0.5 text-xl font-bold tabular-nums ${outstanding > 0n ? "text-red-400" : "text-primary"}`,
                children: fmt(outstanding)
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-primary/80", children: "Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xl font-bold tabular-nums text-primary", children: fmt(totalPaid) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xl font-bold tabular-nums text-foreground", children: fmt(totalPaid + totalUnpaid) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 rounded-lg bg-muted/40 p-1",
          "data-ocid": "udhar.category_filter",
          children: [
            "all",
            UdharCategory.milk,
            UdharCategory.grocery,
            UdharCategory.other
          ].map((cat) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCatFilter(cat),
                className: `rounded-md px-3 py-1 text-xs font-semibold transition-smooth ${catFilter === cat ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `udhar.cat_tab.${cat}`,
                children: cat === "all" ? "All" : ((_a = CAT_META[cat]) == null ? void 0 : _a.label) ?? cat
              },
              cat
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 rounded-lg bg-muted/40 p-1",
          "data-ocid": "udhar.paid_filter",
          children: ["all", "unpaid", "paid"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPaidFilter(f),
              className: `rounded-md px-3 py-1 text-xs font-semibold capitalize transition-smooth ${paidFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": `udhar.paid_tab.${f}`,
              children: f
            },
            f
          ))
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "udhar.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center",
        "data-ocid": "udhar.ledger_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: entries.length === 0 ? "No entries yet" : "No entries match the filter" }),
          entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "gap-2",
              onClick: onAddEntry,
              "data-ocid": "udhar.ledger_empty_add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                " Add First Entry"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      UdharEntryRow,
      {
        entry,
        index: i,
        onDeleteRequest: setDeleteTarget
      },
      entry.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: deleteTarget !== null,
        onCancel: () => setDeleteTarget(null),
        onConfirm: () => {
          if (deleteTarget !== null) {
            deleteEntry.mutate(deleteTarget, {
              onSuccess: () => setDeleteTarget(null)
            });
          }
        },
        isPending: deleteEntry.isPending
      }
    )
  ] });
}
function StudentUdharCard({
  student,
  entries,
  onClick
}) {
  const outstanding = entries.filter((e) => !e.isPaid).reduce((s, e) => s + e.amount, 0n);
  const entryCount = entries.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "w-full text-left rounded-lg border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:bg-card/80 focus-ring",
      "data-ocid": `udhar.student_card.${student.id.toString()}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: student.name }),
          student.roomNumber ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Room ",
            student.roomNumber
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            entryCount,
            " entr",
            entryCount === 1 ? "y" : "ies"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-base font-bold tabular-nums ${outstanding > 0n ? "text-red-400" : "text-primary"}`,
              children: fmt(outstanding)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: outstanding > 0n ? "outstanding" : "all clear" })
        ] })
      ] })
    }
  );
}
function UdharPage() {
  const { data: entries = [], isLoading } = useUdharEntries();
  const { data: students = [] } = useStudents();
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = reactExports.useState(
    null
  );
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const studentsWithUdhar = students.map((s) => ({
    student: s,
    entries: entries.filter((e) => e.studentId === s.id)
  })).filter(({ entries: es }) => es.length > 0);
  const totalOutstanding = entries.filter((e) => !e.isPaid).reduce((s, e) => s + e.amount, 0n);
  const studentsWithDebt = studentsWithUdhar.filter(
    ({ entries: es }) => es.some((e) => !e.isPaid)
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: t("udhar"), subtitle: "Track daily credit given to students", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: selectedStudent ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentLedger,
      {
        student: selectedStudent,
        onBack: () => setSelectedStudent(null),
        onAddEntry: () => setDialogOpen(true)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg border px-4 py-3 ${totalOutstanding > 0n ? "border-red-500/20 bg-red-500/5" : "border-primary/20 bg-primary/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-xs font-medium ${totalOutstanding > 0n ? "text-red-400/80" : "text-primary/80"}`,
                    children: t("outstanding")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `mt-0.5 text-2xl font-bold tabular-nums ${totalOutstanding > 0n ? "text-red-400" : "text-primary"}`,
                    children: fmt(totalOutstanding)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Students with Udhar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: studentsWithDebt })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2 shrink-0",
            onClick: () => setDialogOpen(true),
            "data-ocid": "udhar.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " ",
              t("addUdhar")
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
          "data-ocid": "udhar.loading_state",
          children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, i))
        }
      ) : studentsWithUdhar.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-20 text-center",
          "data-ocid": "udhar.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-12 w-12 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No udhar entries yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Start tracking credit given to students — milk, grocery, and more." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "mt-2 gap-2",
                onClick: () => setDialogOpen(true),
                "data-ocid": "udhar.empty_add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " ",
                  t("addUdhar")
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: studentsWithUdhar.map(({ student, entries: es }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        StudentUdharCard,
        {
          student,
          entries: es,
          onClick: () => setSelectedStudent(student)
        },
        student.id.toString()
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddUdharDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        prefilledStudentId: selectedStudent == null ? void 0 : selectedStudent.id.toString()
      }
    )
  ] });
}
export {
  UdharPage as default
};

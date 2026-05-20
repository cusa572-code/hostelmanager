import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, a as cn, S as Skeleton, m as motion, f as useNavigate } from "./index-BHGx-AOT.js";
import { ao as useComplaints, Y as useStudents, N as useLanguage, ap as ComplaintStatus, L as Layout, p as Clock, o as CircleAlert, l as Badge, X, aq as useUpdateComplaintStatus, T as Trash2, ar as useCreateComplaint, as as useDeleteComplaint, G as TriangleAlert } from "./Layout-eWnk62al.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-0OsgAXp4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { C as ChevronUp, e as ChevronDown, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYMKrls9.js";
import { T as Textarea } from "./textarea-BIpkTMUK.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { C as CircleCheck } from "./circle-check-Bi5fukHs.js";
import { S as Search } from "./search-DtqW_Oyj.js";
import { A as AnimatePresence } from "./index-Cp6wErU0.js";
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
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v2", key: "stiyo7" }],
  ["path", { d: "M12 13h.01", key: "y0uutt" }]
];
const MessageSquareWarning = createLucideIcon("message-square-warning", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function sortComplaints(complaints) {
  const order = {
    [ComplaintStatus.pending]: 0,
    [ComplaintStatus.inProgress]: 1,
    [ComplaintStatus.resolved]: 2
  };
  return [...complaints].sort((a, b) => {
    const od = order[a.status] - order[b.status];
    if (od !== 0) return od;
    return Number(b.createdAt - a.createdAt);
  });
}
function getStatusMeta(status, t) {
  if (status === ComplaintStatus.resolved)
    return {
      label: t("resolved"),
      badgeClass: "badge-complaint-resolved",
      borderClass: "border-l-emerald-500",
      iconColor: "text-emerald-400"
    };
  if (status === ComplaintStatus.inProgress)
    return {
      label: t("inProgress"),
      badgeClass: "badge-complaint-progress",
      borderClass: "border-l-primary",
      iconColor: "text-primary"
    };
  return {
    label: t("pending_complaint"),
    badgeClass: "badge-complaint-pending",
    borderClass: "border-l-amber-500",
    iconColor: "text-amber-400"
  };
}
function ReportIssueDialog({
  open,
  onClose,
  students
}) {
  const create = useCreateComplaint();
  const [sid, setSid] = reactExports.useState("");
  const [roomNumber, setRoomNumber] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const handleStudentChange = (val) => {
    setSid(val);
    if (val) {
      const s = students.find((s2) => s2.id.toString() === val);
      if (s == null ? void 0 : s.roomNumber) setRoomNumber(s.roomNumber);
    }
  };
  const handleClose = () => {
    setSid("");
    setRoomNumber("");
    setDescription("");
    onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim().length < 10) return;
    const input = {
      description: description.trim(),
      roomNumber: roomNumber.trim(),
      studentId: sid ? BigInt(sid) : void 0
    };
    create.mutate(input, { onSuccess: handleClose });
  };
  const descOk = description.trim().length >= 10;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", "data-ocid": "complaints.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-400" }),
      "Report Issue"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "form-label", children: "Student (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sid, onValueChange: handleStudentChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "complaints.student_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student (optional)" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id.toString(), children: [
            s.name,
            s.roomNumber ? ` — Room ${s.roomNumber}` : ""
          ] }, s.id.toString())) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cp-room", className: "form-label", children: "Room Number *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "cp-room",
            placeholder: "e.g. 101",
            value: roomNumber,
            onChange: (e) => setRoomNumber(e.target.value),
            required: true,
            "data-ocid": "complaints.room_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cp-desc", className: "form-label", children: [
          "Description *",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "(min 10 chars)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "cp-desc",
            placeholder: "Describe the issue in detail…",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            className: "form-textarea min-h-[100px]",
            required: true,
            "data-ocid": "complaints.description_input"
          }
        ),
        description.length > 0 && !descOk && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "complaints.desc_field_error",
            children: "Description must be at least 10 characters"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleClose,
            "data-ocid": "complaints.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: create.isPending || !roomNumber.trim() || !descOk,
            "data-ocid": "complaints.submit_button",
            children: create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Filing…"
            ] }) : "File Complaint"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteComplaintDialog({
  complaintId,
  onClose
}) {
  const deleteComplaint = useDeleteComplaint();
  const handleConfirm = () => {
    if (complaintId == null) return;
    deleteComplaint.mutate(complaintId, { onSuccess: onClose });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AlertDialog,
    {
      open: complaintId != null,
      onOpenChange: (v) => !v && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "complaints.delete_dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive" }),
            "Delete Complaint?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This complaint will be permanently deleted and cannot be recovered." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "complaints.delete_cancel_button", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              onClick: handleConfirm,
              disabled: deleteComplaint.isPending,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              "data-ocid": "complaints.delete_confirm_button",
              children: deleteComplaint.isPending ? "Deleting…" : "Delete"
            }
          )
        ] })
      ] })
    }
  );
}
function ComplaintCard({
  complaint,
  studentName,
  studentId,
  index,
  onDelete
}) {
  const updateStatus = useUpdateComplaintStatus();
  const navigate = useNavigate();
  const [expanded, setExpanded] = reactExports.useState(false);
  const { t } = useLanguage();
  const meta = getStatusMeta(complaint.status, t);
  const isResolved = complaint.status === ComplaintStatus.resolved;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
      transition: {
        duration: 0.2,
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1]
      },
      className: cn(
        "group relative rounded-lg border-l-4 bg-card border border-border p-4 space-y-3 transition-smooth",
        meta.borderClass,
        isResolved && "opacity-60"
      ),
      "data-ocid": `complaints.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-foreground text-sm", children: [
                "Room #",
                complaint.roomNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: meta.badgeClass, children: meta.label })
            ] }),
            studentName && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => studentId && navigate({
                  to: "/students/$studentId",
                  params: { studentId: studentId.toString() }
                }),
                className: "mt-0.5 text-xs text-primary hover:underline text-left",
                "data-ocid": `complaints.student_link.${index + 1}`,
                children: studentName
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth",
              onClick: () => onDelete(complaint.id),
              "aria-label": "Delete complaint",
              "data-ocid": `complaints.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-sm text-muted-foreground leading-relaxed",
                !expanded && "line-clamp-2"
              ),
              children: complaint.description
            }
          ),
          complaint.description.length > 120 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "mt-1 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth",
              "data-ocid": `complaints.expand_button.${index + 1}`,
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }),
                " Show less"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }),
                " Show more"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-1 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(complaint.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: complaint.status,
              onValueChange: (v) => updateStatus.mutate({
                id: complaint.id,
                status: v
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-7 w-36 text-xs",
                    "data-ocid": `complaints.status_select.${index + 1}`,
                    children: updateStatus.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ComplaintStatus.pending, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-amber-400" }),
                    " ",
                    t("pending_complaint")
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ComplaintStatus.inProgress, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 text-primary" }),
                    " ",
                    t("inProgress")
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ComplaintStatus.resolved, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-400" }),
                    " ",
                    t("resolved")
                  ] }) })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function StatCard({ label, count, colorClass, bgClass, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-lg border px-4 py-3 flex items-center gap-3 ${bgClass}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 ${colorClass}`, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-medium ${colorClass} opacity-80`, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display ${colorClass}`, children: count })
        ] })
      ]
    }
  );
}
function ComplaintsPage() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { data: students = [] } = useStudents();
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [filterTab, setFilterTab] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const studentMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const s of students) m.set(s.id.toString(), s);
    return m;
  }, [students]);
  const studentName = (id) => {
    var _a;
    return id !== void 0 ? (_a = studentMap.get(id.toString())) == null ? void 0 : _a.name : void 0;
  };
  const studentId = (id) => id;
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === ComplaintStatus.pending
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === ComplaintStatus.inProgress
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === ComplaintStatus.resolved
  ).length;
  const filtered = reactExports.useMemo(() => {
    let list = sortComplaints(complaints);
    if (filterTab !== "all") {
      const statusMap = {
        pending: ComplaintStatus.pending,
        inProgress: ComplaintStatus.inProgress,
        resolved: ComplaintStatus.resolved
      };
      list = list.filter((c) => c.status === statusMap[filterTab]);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((c) => {
        var _a, _b, _c;
        const name = ((_c = (_b = studentMap.get(((_a = c.studentId) == null ? void 0 : _a.toString()) ?? "")) == null ? void 0 : _b.name) == null ? void 0 : _c.toLowerCase()) ?? "";
        return c.roomNumber.toLowerCase().includes(q) || name.includes(q) || c.description.toLowerCase().includes(q);
      });
    }
    return list;
  }, [complaints, filterTab, search, studentMap]);
  const tabs = [
    { key: "all", label: "All", count: totalCount },
    { key: "pending", label: t("pending_complaint"), count: pendingCount },
    { key: "inProgress", label: t("inProgress"), count: inProgressCount },
    { key: "resolved", label: t("resolved"), count: resolvedCount }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-0 h-full min-h-0",
        "data-ocid": "complaints.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-6 py-4 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: t("complaints") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track and resolve hostel issues" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setDialogOpen(true),
                className: "gap-2",
                "data-ocid": "complaints.report_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " ",
                  t("addComplaint")
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                label: t("total"),
                count: totalCount,
                colorClass: "text-foreground",
                bgClass: "border-border bg-card",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareWarning, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                label: t("pending_complaint"),
                count: pendingCount,
                colorClass: "text-amber-400",
                bgClass: "border-amber-500/20 bg-amber-500/5",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                label: t("inProgress"),
                count: inProgressCount,
                colorClass: "text-primary",
                bgClass: "border-primary/20 bg-primary/5",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                label: t("resolved"),
                count: resolvedCount,
                colorClass: "text-emerald-400",
                bgClass: "border-emerald-500/20 bg-emerald-500/5",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-4 pb-3 shrink-0 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center gap-1 overflow-x-auto",
                "data-ocid": "complaints.filter_tabs",
                children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFilterTab(tab.key),
                    className: cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-smooth whitespace-nowrap",
                      filterTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    ),
                    "data-ocid": `complaints.filter.${tab.key}`,
                    children: [
                      tab.label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: cn(
                            "px-1.5 py-0 text-xs",
                            filterTab === tab.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                          ),
                          children: tab.count
                        }
                      )
                    ]
                  },
                  tab.key
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search by room number, student name…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9 form-input",
                  "data-ocid": "complaints.search_input"
                }
              ),
              search && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearch(""),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                  "aria-label": "Clear search",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 pb-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-4 sm:grid-cols-2",
              "data-ocid": "complaints.loading_state",
              children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-lg" }, i))
            }
          ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "empty-state",
              "data-ocid": "complaints.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareWarning, { className: "h-12 w-12 mx-auto opacity-30" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-title", children: search || filterTab !== "all" ? "No complaints found" : "No complaints yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: search ? "Try a different search term or clear the filter" : filterTab !== "all" ? "No complaints with this status" : "Issues reported by students or staff will appear here" }),
                !search && filterTab === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => setDialogOpen(true),
                    className: "gap-2",
                    "data-ocid": "complaints.empty_report_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      " Report Issue"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: filtered.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComplaintCard,
            {
              complaint: c,
              studentName: studentName(c.studentId),
              studentId: studentId(c.studentId),
              index: i,
              onDelete: (id) => setDeletingId(id)
            },
            c.id.toString()
          )) }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportIssueDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        students
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteComplaintDialog,
      {
        complaintId: deletingId,
        onClose: () => setDeletingId(null)
      }
    )
  ] });
}
export {
  ComplaintsPage as default
};

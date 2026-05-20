import { r as reactExports, u as useComposedRefs, j as jsxRuntimeExports, a as cn, B as Button, S as Skeleton } from "./index-BHGx-AOT.js";
import { A as Primitive, y as composeEventHandlers, z as createContextScope, aw as useStaff, ax as useAttendanceByMonth, ay as useStaffSalaryReport, az as useAddStaff, aA as useRemoveStaff, aB as useMarkAttendance, aC as AttendanceStatus, L as Layout, C as ChevronRight, U as Users, a2 as User, o as CircleAlert, l as Badge, T as Trash2 } from "./Layout-eWnk62al.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-xdwy8hkx.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { u as useControllableState } from "./index-zxbJdcQE.js";
import { u as usePrevious } from "./index-BAJoFaFv.js";
import { u as useSize } from "./index-B33C2THV.js";
import { u as useMonthSelector } from "./useMonthSelector-CLlxXPrd.js";
import { C as ChevronLeft } from "./chevron-left-D3t0WHEH.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { I as IndianRupee } from "./indian-rupee-BTCKBSaK.js";
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function todayString() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function StaffCard({
  member,
  index,
  todayStatus,
  presentDays,
  totalDays,
  earnedSalary,
  onTogglePresent,
  onDelete
}) {
  const isPresent = todayStatus === AttendanceStatus.present;
  const attendancePct = totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card p-4 space-y-4 hover:shadow-md transition-smooth",
      "data-ocid": `staff.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground truncate", children: member.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: member.role })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: isPresent ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs shrink-0" : "border-destructive/30 bg-destructive/10 text-destructive text-xs shrink-0",
              children: isPresent ? "Present" : "Absent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              "Joined ",
              new Date(Number(member.joinDate) / 1e6).getFullYear()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "₹",
              Number(member.monthlySalary).toLocaleString("en-IN"),
              "/mo"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Attendance: ",
              presentDays,
              "/",
              totalDays,
              " days"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              attendancePct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-all duration-500",
              style: { width: `${attendancePct}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/20 border border-border px-3 py-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Salary earned this month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold font-display text-foreground", children: [
            "₹",
            Number(earnedSalary).toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: isPresent,
                onCheckedChange: () => onTogglePresent(member.id, todayStatus),
                "data-ocid": `staff.attendance_toggle.${index + 1}`,
                "aria-label": `Mark ${member.name} ${isPresent ? "absent" : "present"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Mark ",
              isPresent ? "Absent" : "Present"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5",
              onClick: () => onDelete(member.id),
              "data-ocid": `staff.delete_button.${index + 1}`,
              "aria-label": `Remove ${member.name}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
function AddStaffDialog({
  open,
  onClose,
  isSaving,
  onAdd
}) {
  const [name, setName] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [salary, setSalary] = reactExports.useState("");
  function handleSubmit(e) {
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
  const isValid = name.trim() && role.trim() && salary && !Number.isNaN(parsedSalary);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border sm:max-w-sm",
      "data-ocid": "staff.add_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg font-bold", children: "Add Staff Member" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "staff-name", className: "text-sm font-semibold", children: [
              "Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "staff-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Ramesh Kumar",
                required: true,
                autoFocus: true,
                "data-ocid": "staff.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "staff-role", className: "text-sm font-semibold", children: [
              "Role ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "staff-role",
                value: role,
                onChange: (e) => setRole(e.target.value),
                placeholder: "e.g. Warden, Cook, Guard",
                required: true,
                "data-ocid": "staff.role_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "staff-salary", className: "text-sm font-semibold", children: [
              "Monthly Salary (₹) ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "staff-salary",
                type: "number",
                min: 0,
                value: salary,
                onChange: (e) => setSalary(e.target.value),
                placeholder: "e.g. 10000",
                required: true,
                "data-ocid": "staff.salary_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: handleClose,
                "data-ocid": "staff.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: !isValid || isSaving,
                className: "gap-1.5",
                "data-ocid": "staff.add_submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  isSaving ? "Adding…" : "Add Staff"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function StaffPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } = useMonthSelector();
  const { data: staff = [], isLoading } = useStaff();
  const { data: attendance = [] } = useAttendanceByMonth(year, month);
  const { data: salaryReport } = useStaffSalaryReport(year, month);
  const addStaff = useAddStaff();
  const removeStaff = useRemoveStaff();
  const markAttendance = useMarkAttendance();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const today = todayString();
  const todayAttendanceMap = /* @__PURE__ */ new Map();
  for (const a of attendance) {
    if (a.date === today) {
      todayAttendanceMap.set(a.staffId.toString(), a.status);
    }
  }
  const salaryEntryMap = new Map(
    ((salaryReport == null ? void 0 : salaryReport.entries) ?? []).map((e) => [e.staffId.toString(), e])
  );
  const totalSalary = staff.reduce(
    (sum, m) => sum + Number(m.monthlySalary),
    0
  );
  const totalEarned = Number((salaryReport == null ? void 0 : salaryReport.totalEarned) ?? 0n);
  const presentCount = [...todayAttendanceMap.values()].filter(
    (s) => s === AttendanceStatus.present
  ).length;
  const absentCount = staff.length - presentCount;
  function handleTogglePresent(staffId, currentStatus) {
    const newStatus = currentStatus === AttendanceStatus.present ? AttendanceStatus.absent : AttendanceStatus.present;
    markAttendance.mutate({ staffId, date: today, status: newStatus });
  }
  function handleDelete(id) {
    removeStaff.mutate(id);
  }
  function handleAdd(name, role, monthlySalary) {
    addStaff.mutate(
      {
        name,
        role,
        monthlySalary,
        joinDate: BigInt(Date.now()) * 1000000n
      },
      { onSuccess: () => setAddOpen(false) }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Staff", subtitle: "Attendance tracking and salary management", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "staff.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3",
          "data-ocid": "staff.month_selector",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: prevMonth,
                className: "h-8 w-8 shrink-0",
                "aria-label": "Previous month",
                "data-ocid": "staff.prev_month_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-[140px] text-center font-display text-base font-semibold text-foreground", children: [
              monthLabel,
              " ",
              yearLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: nextMonth,
                className: "h-8 w-8 shrink-0",
                "aria-label": "Next month",
                "data-ocid": "staff.next_month_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Staff Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${staff.length} staff member${staff.length !== 1 ? "s" : ""}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setAddOpen(true),
            className: "gap-2 shrink-0",
            "data-ocid": "staff.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add Staff"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "kpi-card flex items-center gap-3",
            "data-ocid": "staff.kpi_total",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg border text-muted-foreground bg-muted/30 border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label", children: "Total Staff" }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: staff.length })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "kpi-card flex items-center gap-3",
            "data-ocid": "staff.kpi_present",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg border text-primary bg-primary/10 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label", children: "Present Today" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: presentCount })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "kpi-card flex items-center gap-3",
            "data-ocid": "staff.kpi_absent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg border text-destructive bg-destructive/10 border-destructive/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label", children: "Absent Today" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: absentCount })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "kpi-card flex items-center gap-3",
            "data-ocid": "staff.kpi_salary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg border text-amber-400 bg-amber-500/10 border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label", children: "Monthly Salaries" }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold font-display text-foreground", children: [
                  "₹",
                  totalSalary.toLocaleString("en-IN")
                ] })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-5 py-4 flex flex-wrap items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "Estimated salary payout — ",
            monthLabel,
            " ",
            yearLabel
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Based on attendance records (",
            Number((salaryReport == null ? void 0 : salaryReport.workingDays) ?? 0),
            " working days)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold font-display text-primary", children: [
            "₹",
            totalEarned.toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "of ₹",
            totalSalary.toLocaleString("en-IN"),
            " total"
          ] })
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1.5 w-full" })
          ]
        },
        i
      )) }) : staff.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-20 text-center",
          "data-ocid": "staff.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted/40 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/50" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No staff added yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Add your hostel staff to track attendance and manage salaries." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setAddOpen(true),
                className: "gap-2 mt-1",
                "data-ocid": "staff.empty_add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " Add First Staff Member"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          "data-ocid": "staff.list",
          children: staff.map((member, i) => {
            const entry = salaryEntryMap.get(member.id.toString());
            const todayStatus = todayAttendanceMap.get(member.id.toString()) ?? null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              StaffCard,
              {
                member,
                index: i,
                todayStatus,
                presentDays: Number((entry == null ? void 0 : entry.presentDays) ?? 0n),
                totalDays: Number(
                  (entry == null ? void 0 : entry.totalWorkingDays) ?? (salaryReport == null ? void 0 : salaryReport.workingDays) ?? 26n
                ),
                earnedSalary: (entry == null ? void 0 : entry.earnedSalary) ?? 0n,
                onTogglePresent: handleTogglePresent,
                onDelete: handleDelete
              },
              member.id.toString()
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddStaffDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        isSaving: addStaff.isPending,
        onAdd: handleAdd
      }
    )
  ] });
}
export {
  StaffPage as default
};

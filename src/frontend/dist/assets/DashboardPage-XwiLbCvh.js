import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, T as TrendingUp, r as reactExports, B as Button, b as BedDouble } from "./index-BHGx-AOT.js";
import { E as ExpensesCard } from "./ExpensesCard-BdqTKhp0.js";
import { u as useSetSeatConfig, a as useSetMonthlyBooking, b as useGetBuildingStats, c as useSeatConfig, d as useSeatSummary, e as useMonthlyExpenses, f as useMonthlyProfit, L as Layout, B as Building2, U as Users, C as ChevronRight } from "./Layout-eWnk62al.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { u as useMonthSelector } from "./useMonthSelector-CLlxXPrd.js";
import { C as ChevronLeft } from "./chevron-left-D3t0WHEH.js";
import { I as IndianRupee } from "./indian-rupee-BTCKBSaK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M11 20H2", key: "nlcfvz" }],
  [
    "path",
    {
      d: "M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z",
      key: "au4z13"
    }
  ],
  ["path", { d: "M11 4H8a2 2 0 0 0-2 2v14", key: "74r1mk" }],
  ["path", { d: "M14 12h.01", key: "1jfl7z" }],
  ["path", { d: "M22 20h-3", key: "vhrsz" }]
];
const DoorOpen = createLucideIcon("door-open", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const variantStyles = {
  default: "border-border",
  emerald: "border-emerald-500/30 bg-emerald-950/20",
  orange: "border-orange-500/30 bg-orange-950/20",
  red: "border-red-500/30 bg-red-950/20",
  blue: "border-blue-500/30 bg-blue-950/20"
};
const valueStyles = {
  default: "text-foreground",
  emerald: "text-emerald-400",
  orange: "text-orange-400",
  red: "text-red-400",
  blue: "text-blue-400"
};
const iconStyles = {
  default: "text-muted-foreground",
  emerald: "text-emerald-500",
  orange: "text-orange-500",
  red: "text-red-500",
  blue: "text-blue-500"
};
function KPICard({
  label,
  value,
  subtext,
  icon,
  variant = "default",
  loading = false,
  onClick,
  "data-ocid": dataOcid
}) {
  const isClickable = typeof onClick === "function";
  if (isClickable) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick,
        className: cn(
          "kpi-card transition-smooth w-full text-left",
          "hover:border-primary/40 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer",
          variantStyles[variant]
        ),
        "data-ocid": dataOcid,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          KPICardContent,
          {
            label,
            value,
            subtext,
            icon,
            variant,
            loading,
            iconStyles,
            valueStyles
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("kpi-card transition-smooth", variantStyles[variant]),
      "data-ocid": dataOcid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICardContent,
        {
          label,
          value,
          subtext,
          icon,
          variant,
          loading,
          iconStyles,
          valueStyles
        }
      )
    }
  );
}
function KPICardContent({
  label,
  value,
  subtext,
  icon,
  variant,
  loading,
  iconStyles: iconStyles2,
  valueStyles: valueStyles2
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label truncate", children: label }),
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0", iconStyles2[variant]), children: icon })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-8 w-24 animate-pulse rounded bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: cn(
          "mt-2 font-display text-2xl font-bold leading-none",
          valueStyles2[variant]
        ),
        children: value
      }
    ),
    subtext && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground truncate", children: subtext })
  ] });
}
function fmt$1(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}
function ProfitCard({
  profit,
  isLoading,
  monthLabel,
  yearLabel
}) {
  const isPositive = profit ? profit.profit >= 0n : true;
  const profitValue = (profit == null ? void 0 : profit.profit) ?? 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "kpi-card transition-smooth",
        isPositive ? "border-emerald-500/30 bg-emerald-950/20" : "border-red-500/30 bg-red-950/20"
      ),
      "data-ocid": "profit.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric-label", children: "Net Profit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              monthLabel,
              " ",
              yearLabel
            ] })
          ] }),
          isPositive ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-emerald-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-5 w-5 text-red-400 shrink-0" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-10 w-36 animate-pulse rounded bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: cn(
              "mt-3 font-display text-4xl font-bold leading-none tracking-tight",
              isPositive ? "text-emerald-400" : "text-red-400"
            ),
            "data-ocid": "profit.value",
            children: [
              isPositive ? "+" : "",
              fmt$1(profitValue)
            ]
          }
        ),
        profit && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Revenue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-sm font-semibold text-emerald-400", children: fmt$1(profit.revenue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-sm font-semibold text-orange-400", children: fmt$1(profit.totalExpenses) })
          ] })
        ] })
      ]
    }
  );
}
function SeatConfigCard({
  summary,
  pricePerSeatA,
  pricePerSeatB,
  totalCapacity,
  year,
  month,
  isLoading
}) {
  const [capacity, setCapacity] = reactExports.useState(
    totalCapacity !== void 0 ? String(totalCapacity) : ""
  );
  const [priceA, setPriceA] = reactExports.useState(
    pricePerSeatA !== void 0 && pricePerSeatA > 0n ? String(pricePerSeatA) : ""
  );
  const [priceB, setPriceB] = reactExports.useState(
    pricePerSeatB !== void 0 && pricePerSeatB > 0n ? String(pricePerSeatB) : ""
  );
  const [bookedA, setBookedA] = reactExports.useState(
    (summary == null ? void 0 : summary.bookedSeatsA) !== void 0 ? String(summary.bookedSeatsA) : ""
  );
  const [bookedB, setBookedB] = reactExports.useState(
    (summary == null ? void 0 : summary.bookedSeatsB) !== void 0 ? String(summary.bookedSeatsB) : ""
  );
  const setSeatConfig = useSetSeatConfig();
  const setMonthlyBooking = useSetMonthlyBooking();
  reactExports.useEffect(() => {
    if (totalCapacity !== void 0) setCapacity(String(totalCapacity));
  }, [totalCapacity]);
  reactExports.useEffect(() => {
    if (pricePerSeatA !== void 0)
      setPriceA(pricePerSeatA > 0n ? String(pricePerSeatA) : "");
  }, [pricePerSeatA]);
  reactExports.useEffect(() => {
    if (pricePerSeatB !== void 0)
      setPriceB(pricePerSeatB > 0n ? String(pricePerSeatB) : "");
  }, [pricePerSeatB]);
  reactExports.useEffect(() => {
    if ((summary == null ? void 0 : summary.bookedSeatsA) !== void 0)
      setBookedA(String(summary.bookedSeatsA));
  }, [summary == null ? void 0 : summary.bookedSeatsA]);
  reactExports.useEffect(() => {
    if ((summary == null ? void 0 : summary.bookedSeatsB) !== void 0)
      setBookedB(String(summary.bookedSeatsB));
  }, [summary == null ? void 0 : summary.bookedSeatsB]);
  const handleSaveConfig = () => {
    const cap = BigInt(Math.round(Number(capacity) || 0));
    const pA = BigInt(Math.round(Number(priceA) || 0));
    const pB = BigInt(Math.round(Number(priceB) || 0));
    setSeatConfig.mutate({
      totalCapacity: cap,
      pricePerSeatA: pA,
      pricePerSeatB: pB
    });
  };
  const handleSaveBooking = () => {
    setMonthlyBooking.mutate({
      year,
      month,
      bookedSeatsA: BigInt(Math.round(Number(bookedA) || 0)),
      bookedSeatsB: BigInt(Math.round(Number(bookedB) || 0))
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card space-y-4", "data-ocid": "seat-config.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "Seat Configuration" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["f1", "f2", "f3", "f4"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 animate-pulse rounded bg-muted" }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "seat-capacity",
            className: "text-xs font-medium text-muted-foreground",
            children: "Total Seat Capacity (building-wide)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "seat-capacity",
            type: "number",
            min: 0,
            step: 1,
            inputMode: "numeric",
            value: capacity,
            onChange: (e) => setCapacity(e.target.value),
            placeholder: "e.g. 50",
            className: "h-10 font-mono text-sm cursor-text",
            "data-ocid": "seat-config.capacity_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "seat-price-a",
              className: "text-xs font-medium text-muted-foreground",
              children: "Student Type A Fee (₹)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "seat-price-a",
              type: "number",
              min: 0,
              step: 1,
              inputMode: "numeric",
              value: priceA,
              onChange: (e) => setPriceA(e.target.value),
              placeholder: "Enter amount",
              className: "h-10 font-mono text-sm cursor-text",
              "data-ocid": "seat-config.price_a_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "seat-price-b",
              className: "text-xs font-medium text-muted-foreground",
              children: "Student Type B Fee (₹)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "seat-price-b",
              type: "number",
              min: 0,
              step: 1,
              inputMode: "numeric",
              value: priceB,
              onChange: (e) => setPriceB(e.target.value),
              placeholder: "Enter amount",
              className: "h-10 font-mono text-sm cursor-text",
              "data-ocid": "seat-config.price_b_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: handleSaveConfig,
          disabled: setSeatConfig.isPending,
          className: "w-full cursor-pointer",
          "data-ocid": "seat-config.save_button",
          children: setSeatConfig.isPending ? "Saving…" : "Save Capacity & Fees"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Monthly Bookings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "booked-a",
                className: "text-xs font-medium text-muted-foreground",
                children: "Type A Seats Booked"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "booked-a",
                type: "number",
                min: 0,
                step: 1,
                inputMode: "numeric",
                value: bookedA,
                onChange: (e) => setBookedA(e.target.value),
                placeholder: "e.g. 20",
                className: "h-10 font-mono text-sm cursor-text",
                "data-ocid": "seat-config.booked_a_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "booked-b",
                className: "text-xs font-medium text-muted-foreground",
                children: "Type B Seats Booked"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "booked-b",
                type: "number",
                min: 0,
                step: 1,
                inputMode: "numeric",
                value: bookedB,
                onChange: (e) => setBookedB(e.target.value),
                placeholder: "e.g. 18",
                className: "h-10 font-mono text-sm cursor-text",
                "data-ocid": "seat-config.booked_b_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            onClick: handleSaveBooking,
            disabled: setMonthlyBooking.isPending,
            className: "w-full cursor-pointer",
            "data-ocid": "seat-config.booked_save_button",
            children: setMonthlyBooking.isPending ? "Updating…" : "Update Bookings"
          }
        )
      ] })
    ] })
  ] });
}
function fmt(val) {
  if (val === void 0) return "—";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}
function fmtNum(val) {
  if (val === void 0 || val === null) return "—";
  return Number(val).toLocaleString("en-IN");
}
function DashboardPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } = useMonthSelector();
  const { data: buildingStats, isLoading: buildingLoading } = useGetBuildingStats();
  const { data: seatConfig, isLoading: configLoading } = useSeatConfig();
  const { data: summary, isLoading: summaryLoading } = useSeatSummary(
    year,
    month
  );
  const { data: expenses, isLoading: expensesLoading } = useMonthlyExpenses(
    year,
    month
  );
  const { data: profit, isLoading: profitLoading } = useMonthlyProfit(
    year,
    month
  );
  const anyLoading = configLoading || summaryLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Dashboard", subtitle: "Monthly Overview", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Total Seats in Building",
          value: fmtNum(buildingStats == null ? void 0 : buildingStats.totalSeats),
          subtext: "across all rooms",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
          loading: buildingLoading,
          "data-ocid": "kpi.building_total_seats.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Students Living",
          value: fmtNum(buildingStats == null ? void 0 : buildingStats.totalActiveStudents),
          subtext: "currently active",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          variant: "emerald",
          loading: buildingLoading,
          "data-ocid": "kpi.building_students_living.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Empty Rooms",
          value: fmtNum(buildingStats == null ? void 0 : buildingStats.totalEmptyRooms),
          subtext: "available right now",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-4 w-4" }),
          loading: buildingLoading,
          "data-ocid": "kpi.building_empty_rooms.card"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3",
        "data-ocid": "dashboard.month_selector",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: prevMonth,
              className: "h-8 w-8 shrink-0",
              "data-ocid": "dashboard.prev_month_button",
              "aria-label": "Previous month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-[140px] text-center font-display text-base font-semibold text-foreground", children: [
            "Month: ",
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
              "data-ocid": "dashboard.next_month_button",
              "aria-label": "Next month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Total Seats",
          value: fmtNum(seatConfig == null ? void 0 : seatConfig.totalCapacity),
          subtext: "configured capacity",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4" }),
          loading: configLoading,
          "data-ocid": "kpi.total_seats.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Booked Seats",
          value: fmtNum(summary == null ? void 0 : summary.totalBookedSeats),
          subtext: summary ? `${Number(summary.totalBookedSeats)} of ${Number(summary.totalCapacity)}` : "this month",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-4 w-4" }),
          variant: "emerald",
          loading: anyLoading,
          "data-ocid": "kpi.booked_seats.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Empty Seats",
          value: fmtNum(summary == null ? void 0 : summary.emptySeats),
          subtext: "available this month",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-4 w-4" }),
          loading: anyLoading,
          "data-ocid": "kpi.empty_seats.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Total Revenue",
          value: fmt(summary == null ? void 0 : summary.totalRevenue),
          subtext: "Type A + Type B",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }),
          variant: "emerald",
          loading: anyLoading,
          "data-ocid": "kpi.total_revenue.card"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Type A Price",
          value: fmt(seatConfig == null ? void 0 : seatConfig.pricePerSeatA),
          subtext: "per student / month",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }),
          loading: configLoading,
          "data-ocid": "kpi.price_a.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Type B Price",
          value: fmt(seatConfig == null ? void 0 : seatConfig.pricePerSeatB),
          subtext: "per student / month",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4" }),
          loading: configLoading,
          "data-ocid": "kpi.price_b.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Type A Revenue",
          value: fmt(summary == null ? void 0 : summary.revenueA),
          subtext: summary ? `${Number(summary.bookedSeatsA)} seats × price` : "this month",
          variant: "emerald",
          loading: anyLoading,
          "data-ocid": "kpi.revenue_a.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Type B Revenue",
          value: fmt(summary == null ? void 0 : summary.revenueB),
          subtext: summary ? `${Number(summary.bookedSeatsB)} seats × price` : "this month",
          variant: "blue",
          loading: anyLoading,
          "data-ocid": "kpi.revenue_b.card"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Monthly Revenue",
          value: fmt(summary == null ? void 0 : summary.totalRevenue),
          subtext: "all seats combined",
          variant: "emerald",
          loading: anyLoading,
          "data-ocid": "kpi.revenue.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          label: "Total Expenses",
          value: fmt(profit == null ? void 0 : profit.totalExpenses),
          subtext: "rent + electricity + salary + other",
          variant: "orange",
          loading: profitLoading,
          "data-ocid": "kpi.total_expenses.card"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "kpi.profit_summary.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfitCard,
        {
          profit,
          isLoading: profitLoading,
          monthLabel,
          yearLabel
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SeatConfigCard,
        {
          summary,
          pricePerSeatA: seatConfig == null ? void 0 : seatConfig.pricePerSeatA,
          pricePerSeatB: seatConfig == null ? void 0 : seatConfig.pricePerSeatB,
          totalCapacity: seatConfig == null ? void 0 : seatConfig.totalCapacity,
          year,
          month,
          isLoading: anyLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExpensesCard,
        {
          expenses,
          year,
          month,
          isLoading: expensesLoading
        }
      )
    ] })
  ] }) });
}
export {
  DashboardPage as default
};

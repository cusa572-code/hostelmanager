import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, L as Link, S as Skeleton, T as TrendingUp } from "./index-BHGx-AOT.js";
import { h as useSubscription, i as useYearlyProfitChart, L as Layout, C as ChevronRight, j as Crown } from "./Layout-eWnk62al.js";
import { P as PLAN_OPTIONS } from "./types-DO1d-v-O.js";
import { C as ChevronLeft } from "./chevron-left-D3t0WHEH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
const MONTH_SHORT = [
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
const MONTH_FULL = [
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
function bigint_abs(v) {
  return v < 0n ? -v : v;
}
function formatShort(val) {
  const n = Number(val);
  if (Math.abs(n) >= 1e6) return `₹${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e3).toFixed(0)}k`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
  return `₹${n}`;
}
function formatFull(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(val));
}
function normalise(data) {
  const map = /* @__PURE__ */ new Map();
  for (const entry of data) {
    map.set(Number(entry.month), entry.profit);
  }
  return Array.from({ length: 12 }, (_, i) => map.get(i + 1) ?? 0n);
}
function niceGridMax(rawMax) {
  if (rawMax === 0) return 100;
  const mag = 10 ** Math.floor(Math.log10(rawMax));
  return Math.ceil(rawMax / mag) * mag;
}
function YearlyProfitChart({ data, year }) {
  const [hoveredIdx, setHoveredIdx] = reactExports.useState(null);
  const values = reactExports.useMemo(() => normalise(data), [data]);
  const maxAbs = reactExports.useMemo(
    () => values.reduce((m, v) => bigint_abs(v) > m ? bigint_abs(v) : m, 0n),
    [values]
  );
  const total = reactExports.useMemo(() => values.reduce((s, v) => s + v, 0n), [values]);
  const bestIdx = reactExports.useMemo(
    () => values.reduce((bi, v, i) => v > values[bi] ? i : bi, 0),
    [values]
  );
  const worstIdx = reactExports.useMemo(
    () => values.reduce((wi, v, i) => v < values[wi] ? i : wi, 0),
    [values]
  );
  const svgH = 260;
  const paddingTop = 24;
  const paddingBottom = 44;
  const paddingLeft = 58;
  const paddingRight = 12;
  const barAreaH = svgH - paddingTop - paddingBottom;
  const midY = paddingTop + barAreaH / 2;
  const rawMax = Number(maxAbs);
  const gridMax = niceGridMax(rawMax);
  const scale = gridMax > 0 ? barAreaH / 2 / gridMax : 1;
  const svgW = 900;
  const chartW = svgW - paddingLeft - paddingRight;
  const colW = chartW / 12;
  const barWidth = colW * 0.62;
  const barOffset = (colW - barWidth) / 2;
  const bars = values.map((v, i) => {
    const x = paddingLeft + i * colW + barOffset;
    const h = Math.max(2, Math.abs(Number(v)) * scale);
    const isPositive = v >= 0n;
    const y = isPositive ? midY - h : midY;
    return { x, y, h, isPositive, v };
  });
  const gridStep = gridMax / 4;
  const gridLines = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({
    y: midY - k * gridStep * scale,
    label: k === 0 ? "0" : formatShort(BigInt(Math.round(k * gridStep))),
    isZero: k === 0
  }));
  const positiveCount = values.filter((v) => v > 0n).length;
  const negativeCount = values.filter((v) => v < 0n).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "chart.container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs-label text-muted-foreground", children: "Monthly Profit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 font-display text-xl font-bold text-foreground", children: [
            year,
            " Overview"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block h-2.5 w-4 rounded-sm",
                style: { background: "oklch(0.65 0.18 155)" }
              }
            ),
            "Profit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block h-2.5 w-4 rounded-sm",
                style: { background: "oklch(0.55 0.2 25)" }
              }
            ),
            "Loss"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto px-2 pb-4 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          viewBox: `0 0 ${svgW} ${svgH}`,
          className: "w-full",
          style: { minWidth: "540px", height: "260px" },
          "aria-label": `Yearly profit bar chart for ${year}`,
          role: "img",
          children: [
            gridLines.map((gl) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: paddingLeft,
                  y1: gl.y,
                  x2: svgW - paddingRight,
                  y2: gl.y,
                  stroke: gl.isZero ? "oklch(0.40 0.012 260)" : "oklch(0.28 0.012 260)",
                  strokeWidth: gl.isZero ? 1.5 : 0.8,
                  strokeDasharray: gl.isZero ? void 0 : "3 5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "text",
                {
                  x: paddingLeft - 6,
                  y: gl.y + 4,
                  textAnchor: "end",
                  fontSize: "9",
                  fill: "oklch(0.45 0.01 260)",
                  fontFamily: "var(--font-mono)",
                  children: gl.label
                }
              )
            ] }, `gl-${gl.label}`)),
            bars.map((bar, i) => {
              const isHovered = hoveredIdx === i;
              const isBest = i === bestIdx && values[bestIdx] > 0n;
              const isWorst = i === worstIdx && values[worstIdx] < 0n;
              const baseFill = bar.isPositive ? isBest ? "oklch(0.78 0.20 155)" : "oklch(0.65 0.18 155)" : isWorst ? "oklch(0.65 0.24 25)" : "oklch(0.55 0.2 25)";
              const hovFill = bar.isPositive ? "oklch(0.82 0.22 155)" : "oklch(0.68 0.26 25)";
              const fill = isHovered ? hovFill : baseFill;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "g",
                {
                  style: { cursor: "pointer" },
                  onMouseEnter: () => setHoveredIdx(i),
                  onMouseLeave: () => setHoveredIdx(null),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "rect",
                      {
                        x: paddingLeft + i * colW,
                        y: paddingTop,
                        width: colW,
                        height: barAreaH,
                        fill: isHovered ? "oklch(0.22 0.012 260)" : "transparent"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "rect",
                      {
                        x: bar.x,
                        y: bar.y,
                        width: barWidth,
                        height: bar.h,
                        rx: 3,
                        ry: 3,
                        fill,
                        opacity: isHovered ? 1 : 0.88
                      }
                    ),
                    isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: bar.x + barWidth / 2,
                        y: bar.isPositive ? bar.y - 7 : bar.y + bar.h + 15,
                        textAnchor: "middle",
                        fontSize: "10",
                        fontWeight: "600",
                        fill: bar.isPositive ? "oklch(0.78 0.20 155)" : "oklch(0.68 0.26 25)",
                        fontFamily: "var(--font-mono)",
                        children: formatShort(bar.v)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: paddingLeft + i * colW + colW / 2,
                        y: svgH - 8,
                        textAnchor: "middle",
                        fontSize: "10",
                        fill: isHovered ? "oklch(0.85 0.01 260)" : "oklch(0.55 0.01 260)",
                        fontFamily: "var(--font-body)",
                        fontWeight: isHovered ? "600" : "400",
                        children: MONTH_SHORT[i]
                      }
                    )
                  ]
                },
                MONTH_SHORT[i]
              );
            })
          ]
        }
      ) }),
      hoveredIdx !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-muted/40 px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-sm font-semibold text-foreground", children: [
          MONTH_FULL[hoveredIdx],
          " ",
          year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-sm font-bold ${values[hoveredIdx] >= 0n ? "text-emerald-400" : "text-red-400"}`,
            children: formatFull(values[hoveredIdx])
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
        "data-ocid": "chart.summary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "kpi-card flex flex-col gap-1.5",
              "data-ocid": "chart.total_profit.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs-label text-muted-foreground", children: "Total Annual Profit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-display text-2xl font-bold ${total >= 0n ? "text-emerald-400" : "text-red-400"}`,
                    children: formatFull(total)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "inline-block h-1.5 w-1.5 rounded-full",
                        style: { background: "oklch(0.65 0.18 155)" }
                      }
                    ),
                    positiveCount,
                    " profitable"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "inline-block h-1.5 w-1.5 rounded-full",
                        style: { background: "oklch(0.55 0.2 25)" }
                      }
                    ),
                    negativeCount,
                    " loss"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "kpi-card flex flex-col gap-1.5",
              style: { borderColor: "oklch(0.65 0.18 155 / 0.35)" },
              "data-ocid": "chart.best_month.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs-label text-muted-foreground", children: "Best Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-emerald-400", children: formatFull(values[bestIdx]) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  MONTH_FULL[bestIdx],
                  " ",
                  year
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "kpi-card flex flex-col gap-1.5",
              style: { borderColor: "oklch(0.55 0.2 25 / 0.35)" },
              "data-ocid": "chart.worst_month.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs-label text-muted-foreground", children: "Worst Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-red-400", children: formatFull(values[worstIdx]) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  MONTH_FULL[worstIdx],
                  " ",
                  year
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "overflow-hidden rounded-xl border border-border bg-card",
        "data-ocid": "chart.breakdown_table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs-label text-muted-foreground", children: "Monthly Breakdown" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: values.map((v, i) => {
            const isBest = i === bestIdx && v > 0n;
            const isWorst = i === worstIdx && v < 0n;
            const pct = gridMax > 0 ? Math.abs(Number(v)) / gridMax : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-4 px-5 py-2.5 transition-colors hover:bg-muted/30",
                "data-ocid": `chart.breakdown.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 shrink-0 font-mono text-xs text-muted-foreground", children: MONTH_SHORT[i] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all",
                      style: {
                        width: `${(pct * 100).toFixed(1)}%`,
                        background: v >= 0n ? "oklch(0.65 0.18 155)" : "oklch(0.55 0.2 25)"
                      }
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `shrink-0 font-mono text-xs font-semibold tabular-nums ${v > 0n ? "text-emerald-400" : v < 0n ? "text-red-400" : "text-muted-foreground"}`,
                      children: formatFull(v)
                    }
                  ),
                  (isBest || isWorst) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${isBest ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`,
                      children: isBest ? "best" : "worst"
                    }
                  )
                ]
              },
              MONTH_SHORT[i]
            );
          }) })
        ]
      }
    )
  ] });
}
function ChartSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "chart.loading_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-36" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-4 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex w-full items-end gap-1.5 px-4",
          style: { minWidth: "540px", height: "260px" },
          children: [
            "m1",
            "m2",
            "m3",
            "m4",
            "m5",
            "m6",
            "m7",
            "m8",
            "m9",
            "m10",
            "m11",
            "m12"
          ].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: "flex-1 rounded-sm",
              style: { height: `${30 + Math.random() * 60}%` }
            },
            id
          ))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: ["s1", "s2", "s3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
    ] }, id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-36" }) }),
      ["r1", "r2", "r3", "r4", "r5", "r6"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-5 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1.5 flex-1 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
      ] }, id))
    ] })
  ] });
}
function EmptyChart({ year }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-24 text-center",
      "data-ocid": "chart.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border",
            style: { background: "oklch(0.22 0.015 260)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-7 w-7 text-muted-foreground opacity-50" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold text-foreground", children: [
          "No data for ",
          year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-xs text-sm text-muted-foreground", children: "Add monthly bookings and expenses to start tracking profit trends for this year." })
      ]
    }
  );
}
function PaywallOverlay() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative rounded-2xl border border-border overflow-hidden",
      "data-ocid": "chart.paywall",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none select-none blur-sm opacity-30 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 rounded-xl bg-card border border-border flex items-end gap-2 px-4 pb-4", children: [
          { h: 40, id: "b1" },
          { h: 65, id: "b2" },
          { h: 30, id: "b3" },
          { h: 80, id: "b4" },
          { h: 55, id: "b5" },
          { h: 90, id: "b6" },
          { h: 45, id: "b7" },
          { h: 70, id: "b8" },
          { h: 35, id: "b9" },
          { h: 60, id: "b10" },
          { h: 85, id: "b11" },
          { h: 50, id: "b12" }
        ].map(({ h, id }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 rounded-sm bg-primary",
            style: { height: `${h}%` }
          },
          id
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm px-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-6 w-6 text-orange-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Premium Feature" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-8", children: "The yearly profit chart is available on premium plans. Upgrade to visualise your full profit trends." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-lg mb-6 sm:grid-cols-4", children: PLAN_OPTIONS.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl border p-3 text-center transition-smooth ${plan.highlight ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: plan.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `font-display text-base font-bold ${plan.highlight ? "text-primary" : "text-foreground"}`,
                    children: plan.priceLabel
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: plan.perMonth })
              ]
            },
            plan.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscription", "data-ocid": "chart.paywall.upgrade_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 px-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4" }),
            "View Plans & Upgrade"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "1 week free trial included with all plans" })
        ] })
      ]
    }
  );
}
function ChartPage() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const [year, setYear] = reactExports.useState(currentYear);
  const { isExpired, isLoading: subLoading } = useSubscription();
  const { data, isLoading, isError } = useYearlyProfitChart(year);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Profit Chart", subtitle: "Yearly Trends", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-6", "data-ocid": "chart.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3",
        "data-ocid": "chart.year_selector",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => setYear((y) => y - 1),
              "data-ocid": "chart.prev_year_button",
              "aria-label": "Previous year",
              className: "h-9 w-9",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "min-w-[88px] text-center font-display text-2xl font-bold tabular-nums text-foreground",
              "data-ocid": "chart.year_label",
              children: year
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => setYear((y) => y + 1),
              disabled: year >= currentYear,
              "data-ocid": "chart.next_year_button",
              "aria-label": "Next year",
              className: "h-9 w-9",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          ),
          year !== currentYear && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setYear(currentYear),
              className: "text-xs text-muted-foreground transition-smooth hover:text-foreground",
              "data-ocid": "chart.current_year_button",
              children: [
                "Back to ",
                currentYear
              ]
            }
          )
        ]
      }
    ),
    !subLoading && isExpired ? /* @__PURE__ */ jsxRuntimeExports.jsx(PaywallOverlay, {}) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChartSkeleton, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-12 text-center",
        "data-ocid": "chart.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-destructive", children: "Failed to load chart data. Please try again." })
      }
    ) : !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyChart, { year }) : /* @__PURE__ */ jsxRuntimeExports.jsx(YearlyProfitChart, { data, year })
  ] }) });
}
export {
  ChartPage as default
};

import type { YearlyChartEntry } from "@/types";
import { useMemo, useState } from "react";

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
  "Dec",
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
  "December",
];

interface YearlyProfitChartProps {
  data: YearlyChartEntry[];
  year: number;
}

function bigint_abs(v: bigint): bigint {
  return v < 0n ? -v : v;
}

function formatShort(val: bigint): string {
  const n = Number(val);
  if (Math.abs(n) >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 100_000) return `₹${(n / 1000).toFixed(0)}k`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n}`;
}

function formatFull(val: bigint): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(val));
}

function normalise(data: YearlyChartEntry[]): bigint[] {
  const map = new Map<number, bigint>();
  for (const entry of data) {
    map.set(Number(entry.month), entry.profit);
  }
  return Array.from({ length: 12 }, (_, i) => map.get(i + 1) ?? 0n);
}

function niceGridMax(rawMax: number): number {
  if (rawMax === 0) return 100;
  const mag = 10 ** Math.floor(Math.log10(rawMax));
  return Math.ceil(rawMax / mag) * mag;
}

export function YearlyProfitChart({ data, year }: YearlyProfitChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const values = useMemo(() => normalise(data), [data]);

  const maxAbs = useMemo(
    () => values.reduce((m, v) => (bigint_abs(v) > m ? bigint_abs(v) : m), 0n),
    [values],
  );

  const total = useMemo(() => values.reduce((s, v) => s + v, 0n), [values]);

  const bestIdx = useMemo(
    () => values.reduce((bi, v, i) => (v > values[bi] ? i : bi), 0),
    [values],
  );

  const worstIdx = useMemo(
    () => values.reduce((wi, v, i) => (v < values[wi] ? i : wi), 0),
    [values],
  );

  // SVG layout
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

  // Bar geometry
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

  // Y-axis grid lines (4 steps each side)
  const gridStep = gridMax / 4;
  const gridLines = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({
    y: midY - k * gridStep * scale,
    label: k === 0 ? "0" : formatShort(BigInt(Math.round(k * gridStep))),
    isZero: k === 0,
  }));

  const positiveCount = values.filter((v) => v > 0n).length;
  const negativeCount = values.filter((v) => v < 0n).length;

  return (
    <div className="space-y-5" data-ocid="chart.container">
      {/* Chart card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs-label text-muted-foreground">
              Monthly Profit
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-foreground">
              {year} Overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: "oklch(0.65 0.18 155)" }}
              />
              Profit
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: "oklch(0.55 0.2 25)" }}
              />
              Loss
            </span>
          </div>
        </div>

        {/* SVG */}
        <div className="overflow-x-auto px-2 pb-4 pt-3">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full"
            style={{ minWidth: "540px", height: "260px" }}
            aria-label={`Yearly profit bar chart for ${year}`}
            role="img"
          >
            {/* Grid lines */}
            {gridLines.map((gl) => (
              <g key={`gl-${gl.label}`}>
                <line
                  x1={paddingLeft}
                  y1={gl.y}
                  x2={svgW - paddingRight}
                  y2={gl.y}
                  stroke={
                    gl.isZero
                      ? "oklch(0.40 0.012 260)"
                      : "oklch(0.28 0.012 260)"
                  }
                  strokeWidth={gl.isZero ? 1.5 : 0.8}
                  strokeDasharray={gl.isZero ? undefined : "3 5"}
                />
                <text
                  x={paddingLeft - 6}
                  y={gl.y + 4}
                  textAnchor="end"
                  fontSize="9"
                  fill="oklch(0.45 0.01 260)"
                  fontFamily="var(--font-mono)"
                >
                  {gl.label}
                </text>
              </g>
            ))}

            {/* Bars */}
            {bars.map((bar, i) => {
              const isHovered = hoveredIdx === i;
              const isBest = i === bestIdx && values[bestIdx] > 0n;
              const isWorst = i === worstIdx && values[worstIdx] < 0n;

              const baseFill = bar.isPositive
                ? isBest
                  ? "oklch(0.78 0.20 155)"
                  : "oklch(0.65 0.18 155)"
                : isWorst
                  ? "oklch(0.65 0.24 25)"
                  : "oklch(0.55 0.2 25)";

              const hovFill = bar.isPositive
                ? "oklch(0.82 0.22 155)"
                : "oklch(0.68 0.26 25)";

              const fill = isHovered ? hovFill : baseFill;

              return (
                <g
                  key={MONTH_SHORT[i]}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Hover highlight column */}
                  <rect
                    x={paddingLeft + i * colW}
                    y={paddingTop}
                    width={colW}
                    height={barAreaH}
                    fill={isHovered ? "oklch(0.22 0.012 260)" : "transparent"}
                  />

                  {/* Bar */}
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={barWidth}
                    height={bar.h}
                    rx={3}
                    ry={3}
                    fill={fill}
                    opacity={isHovered ? 1 : 0.88}
                  />

                  {/* Value label on hover */}
                  {isHovered && (
                    <text
                      x={bar.x + barWidth / 2}
                      y={bar.isPositive ? bar.y - 7 : bar.y + bar.h + 15}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={
                        bar.isPositive
                          ? "oklch(0.78 0.20 155)"
                          : "oklch(0.68 0.26 25)"
                      }
                      fontFamily="var(--font-mono)"
                    >
                      {formatShort(bar.v)}
                    </text>
                  )}

                  {/* Month label */}
                  <text
                    x={paddingLeft + i * colW + colW / 2}
                    y={svgH - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill={
                      isHovered
                        ? "oklch(0.85 0.01 260)"
                        : "oklch(0.55 0.01 260)"
                    }
                    fontFamily="var(--font-body)"
                    fontWeight={isHovered ? "600" : "400"}
                  >
                    {MONTH_SHORT[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover tooltip bar */}
        {hoveredIdx !== null && (
          <div className="border-t border-border bg-muted/40 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-foreground">
                {MONTH_FULL[hoveredIdx]} {year}
              </span>
              <span
                className={`font-mono text-sm font-bold ${
                  values[hoveredIdx] >= 0n ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatFull(values[hoveredIdx])}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary KPIs */}
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        data-ocid="chart.summary"
      >
        {/* Total */}
        <div
          className="kpi-card flex flex-col gap-1.5"
          data-ocid="chart.total_profit.card"
        >
          <span className="text-xs-label text-muted-foreground">
            Total Annual Profit
          </span>
          <span
            className={`font-display text-2xl font-bold ${
              total >= 0n ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatFull(total)}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "oklch(0.65 0.18 155)" }}
              />
              {positiveCount} profitable
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "oklch(0.55 0.2 25)" }}
              />
              {negativeCount} loss
            </span>
          </div>
        </div>

        {/* Best month */}
        <div
          className="kpi-card flex flex-col gap-1.5"
          style={{ borderColor: "oklch(0.65 0.18 155 / 0.35)" }}
          data-ocid="chart.best_month.card"
        >
          <span className="text-xs-label text-muted-foreground">
            Best Month
          </span>
          <span className="font-display text-2xl font-bold text-emerald-400">
            {formatFull(values[bestIdx])}
          </span>
          <span className="text-xs text-muted-foreground">
            {MONTH_FULL[bestIdx]} {year}
          </span>
        </div>

        {/* Worst month */}
        <div
          className="kpi-card flex flex-col gap-1.5"
          style={{ borderColor: "oklch(0.55 0.2 25 / 0.35)" }}
          data-ocid="chart.worst_month.card"
        >
          <span className="text-xs-label text-muted-foreground">
            Worst Month
          </span>
          <span className="font-display text-2xl font-bold text-red-400">
            {formatFull(values[worstIdx])}
          </span>
          <span className="text-xs text-muted-foreground">
            {MONTH_FULL[worstIdx]} {year}
          </span>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div
        className="overflow-hidden rounded-xl border border-border bg-card"
        data-ocid="chart.breakdown_table"
      >
        <div className="border-b border-border px-5 py-3">
          <span className="text-xs-label text-muted-foreground">
            Monthly Breakdown
          </span>
        </div>
        <div className="divide-y divide-border">
          {values.map((v, i) => {
            const isBest = i === bestIdx && v > 0n;
            const isWorst = i === worstIdx && v < 0n;
            const pct = gridMax > 0 ? Math.abs(Number(v)) / gridMax : 0;

            return (
              <div
                key={MONTH_SHORT[i]}
                className="flex items-center gap-4 px-5 py-2.5 transition-colors hover:bg-muted/30"
                data-ocid={`chart.breakdown.item.${i + 1}`}
              >
                <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
                  {MONTH_SHORT[i]}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(pct * 100).toFixed(1)}%`,
                        background:
                          v >= 0n
                            ? "oklch(0.65 0.18 155)"
                            : "oklch(0.55 0.2 25)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${
                    v > 0n
                      ? "text-emerald-400"
                      : v < 0n
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {formatFull(v)}
                </span>
                {(isBest || isWorst) && (
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                      isBest
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {isBest ? "best" : "worst"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

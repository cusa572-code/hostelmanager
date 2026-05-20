import { cn } from "@/lib/utils";
import type { MonthlyProfit } from "@/types";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ProfitCardProps {
  profit: MonthlyProfit | undefined;
  isLoading?: boolean;
  monthLabel: string;
  yearLabel: string;
}

function fmt(amount: bigint): string {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function ProfitCard({
  profit,
  isLoading,
  monthLabel,
  yearLabel,
}: ProfitCardProps) {
  const isPositive = profit ? profit.profit >= 0n : true;
  const profitValue = profit?.profit ?? 0n;

  return (
    <div
      className={cn(
        "kpi-card transition-smooth",
        isPositive
          ? "border-emerald-500/30 bg-emerald-950/20"
          : "border-red-500/30 bg-red-950/20",
      )}
      data-ocid="profit.card"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-metric-label">Net Profit</p>
          <p className="text-xs text-muted-foreground">
            {monthLabel} {yearLabel}
          </p>
        </div>
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-400 shrink-0" />
        )}
      </div>

      {isLoading ? (
        <div className="mt-3 h-10 w-36 animate-pulse rounded bg-muted" />
      ) : (
        <p
          className={cn(
            "mt-3 font-display text-4xl font-bold leading-none tracking-tight",
            isPositive ? "text-emerald-400" : "text-red-400",
          )}
          data-ocid="profit.value"
        >
          {isPositive ? "+" : ""}
          {fmt(profitValue)}
        </p>
      )}

      {profit && !isLoading && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">
              {fmt(profit.revenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Expenses</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-orange-400">
              {fmt(profit.totalExpenses)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

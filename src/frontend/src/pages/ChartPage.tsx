import { Layout } from "@/components/Layout";
import { YearlyProfitChart } from "@/components/YearlyProfitChart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useYearlyProfitChart } from "@/hooks/useQueries";
import { useSubscription } from "@/hooks/useSubscription";
import { PLAN_OPTIONS } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

function ChartSkeleton() {
  return (
    <div className="space-y-5" data-ocid="chart.loading_state">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="px-2 pb-4 pt-3">
          <div
            className="flex w-full items-end gap-1.5 px-4"
            style={{ minWidth: "540px", height: "260px" }}
          >
            {[
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
              "m12",
            ].map((id) => (
              <Skeleton
                key={id}
                className="flex-1 rounded-sm"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {["s1", "s2", "s3"].map((id) => (
          <div key={id} className="kpi-card space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <Skeleton className="h-3 w-36" />
        </div>
        {["r1", "r2", "r3", "r4", "r5", "r6"].map((id) => (
          <div key={id} className="flex items-center gap-4 px-5 py-2.5">
            <Skeleton className="h-3 w-7" />
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChart({ year }: { year: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-24 text-center"
      data-ocid="chart.empty_state"
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border"
        style={{ background: "oklch(0.22 0.015 260)" }}
      >
        <TrendingUp className="h-7 w-7 text-muted-foreground opacity-50" />
      </div>
      <p className="font-display text-xl font-bold text-foreground">
        No data for {year}
      </p>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Add monthly bookings and expenses to start tracking profit trends for
        this year.
      </p>
    </div>
  );
}

function PaywallOverlay() {
  return (
    <div
      className="relative rounded-2xl border border-border overflow-hidden"
      data-ocid="chart.paywall"
    >
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-30 p-6">
        <div className="h-64 rounded-xl bg-card border border-border flex items-end gap-2 px-4 pb-4">
          {[
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
            { h: 50, id: "b12" },
          ].map(({ h, id }) => (
            <div
              key={id}
              className="flex-1 rounded-sm bg-primary"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 mb-4">
          <Lock className="h-6 w-6 text-orange-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Premium Feature
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-8">
          The yearly profit chart is available on premium plans. Upgrade to
          visualise your full profit trends.
        </p>

        {/* Mini plan cards */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-lg mb-6 sm:grid-cols-4">
          {PLAN_OPTIONS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-3 text-center transition-smooth ${
                plan.highlight
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{plan.label}</p>
              <p
                className={`font-display text-base font-bold ${plan.highlight ? "text-primary" : "text-foreground"}`}
              >
                {plan.priceLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {plan.perMonth}
              </p>
            </div>
          ))}
        </div>

        <Link to="/subscription" data-ocid="chart.paywall.upgrade_button">
          <Button className="gap-2 px-8">
            <Crown className="h-4 w-4" />
            View Plans & Upgrade
          </Button>
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">
          1 week free trial included with all plans
        </p>
      </div>
    </div>
  );
}

export default function ChartPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { isExpired, isLoading: subLoading } = useSubscription();

  const { data, isLoading, isError } = useYearlyProfitChart(year);

  return (
    <Layout title="Profit Chart" subtitle="Yearly Trends">
      <div className="mx-auto max-w-5xl space-y-6" data-ocid="chart.page">
        {/* Year Selector */}
        <div
          className="flex items-center gap-3"
          data-ocid="chart.year_selector"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear((y) => y - 1)}
            data-ocid="chart.prev_year_button"
            aria-label="Previous year"
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span
            className="min-w-[88px] text-center font-display text-2xl font-bold tabular-nums text-foreground"
            data-ocid="chart.year_label"
          >
            {year}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= currentYear}
            data-ocid="chart.next_year_button"
            aria-label="Next year"
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {year !== currentYear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setYear(currentYear)}
              className="text-xs text-muted-foreground transition-smooth hover:text-foreground"
              data-ocid="chart.current_year_button"
            >
              Back to {currentYear}
            </Button>
          )}
        </div>

        {/* Paywall or chart content */}
        {!subLoading && isExpired ? (
          <PaywallOverlay />
        ) : isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <div
            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-12 text-center"
            data-ocid="chart.error_state"
          >
            <p className="font-display text-sm font-semibold text-destructive">
              Failed to load chart data. Please try again.
            </p>
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyChart year={year} />
        ) : (
          <YearlyProfitChart data={data} year={year} />
        )}
      </div>
    </Layout>
  );
}

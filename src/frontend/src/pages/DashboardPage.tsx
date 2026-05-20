import { ExpensesCard } from "@/components/ExpensesCard";
import { KPICard } from "@/components/KPICard";
import { Layout } from "@/components/Layout";
import { ProfitCard } from "@/components/ProfitCard";
import { SeatConfigCard } from "@/components/SeatConfigCard";
import { Button } from "@/components/ui/button";
import { useMonthSelector } from "@/hooks/useMonthSelector";
import {
  useGetBuildingStats,
  useMonthlyExpenses,
  useMonthlyProfit,
  useSeatConfig,
  useSeatSummary,
} from "@/hooks/useQueries";
import {
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  IndianRupee,
  LayoutGrid,
  Users,
} from "lucide-react";

function fmt(val: bigint | undefined): string {
  if (val === undefined) return "—";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

function fmtNum(val: bigint | undefined | null): string {
  if (val === undefined || val === null) return "—";
  return Number(val).toLocaleString("en-IN");
}

export default function DashboardPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } =
    useMonthSelector();

  const { data: buildingStats, isLoading: buildingLoading } =
    useGetBuildingStats();
  const { data: seatConfig, isLoading: configLoading } = useSeatConfig();
  const { data: summary, isLoading: summaryLoading } = useSeatSummary(
    year,
    month,
  );
  const { data: expenses, isLoading: expensesLoading } = useMonthlyExpenses(
    year,
    month,
  );
  const { data: profit, isLoading: profitLoading } = useMonthlyProfit(
    year,
    month,
  );

  const anyLoading = configLoading || summaryLoading;

  return (
    <Layout title="Dashboard" subtitle="Monthly Overview">
      <div className="space-y-6" data-ocid="dashboard.page">
        {/* Building-wide KPIs — always visible at the top */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPICard
            label="Total Seats in Building"
            value={fmtNum(buildingStats?.totalSeats)}
            subtext="across all rooms"
            icon={<Building2 className="h-4 w-4" />}
            loading={buildingLoading}
            data-ocid="kpi.building_total_seats.card"
          />
          <KPICard
            label="Students Living"
            value={fmtNum(buildingStats?.totalActiveStudents)}
            subtext="currently active"
            icon={<Users className="h-4 w-4" />}
            variant="emerald"
            loading={buildingLoading}
            data-ocid="kpi.building_students_living.card"
          />
          <KPICard
            label="Empty Rooms"
            value={fmtNum(buildingStats?.totalEmptyRooms)}
            subtext="available right now"
            icon={<DoorOpen className="h-4 w-4" />}
            loading={buildingLoading}
            data-ocid="kpi.building_empty_rooms.card"
          />
        </div>

        {/* Month Selector */}
        <div
          className="flex items-center gap-3"
          data-ocid="dashboard.month_selector"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 shrink-0"
            data-ocid="dashboard.prev_month_button"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center font-display text-base font-semibold text-foreground">
            Month: {monthLabel} {yearLabel}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 shrink-0"
            data-ocid="dashboard.next_month_button"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* KPI Row 1 — Seats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KPICard
            label="Total Seats"
            value={fmtNum(seatConfig?.totalCapacity)}
            subtext="configured capacity"
            icon={<LayoutGrid className="h-4 w-4" />}
            loading={configLoading}
            data-ocid="kpi.total_seats.card"
          />
          <KPICard
            label="Booked Seats"
            value={fmtNum(summary?.totalBookedSeats)}
            subtext={
              summary
                ? `${Number(summary.totalBookedSeats)} of ${Number(summary.totalCapacity)}`
                : "this month"
            }
            icon={<BedDouble className="h-4 w-4" />}
            variant="emerald"
            loading={anyLoading}
            data-ocid="kpi.booked_seats.card"
          />
          <KPICard
            label="Empty Seats"
            value={fmtNum(summary?.emptySeats)}
            subtext="available this month"
            icon={<DoorOpen className="h-4 w-4" />}
            loading={anyLoading}
            data-ocid="kpi.empty_seats.card"
          />
          <KPICard
            label="Total Revenue"
            value={fmt(summary?.totalRevenue)}
            subtext="Type A + Type B"
            icon={<IndianRupee className="h-4 w-4" />}
            variant="emerald"
            loading={anyLoading}
            data-ocid="kpi.total_revenue.card"
          />
        </div>

        {/* KPI Row 2 — Revenue breakdown */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KPICard
            label="Type A Price"
            value={fmt(seatConfig?.pricePerSeatA)}
            subtext="per student / month"
            icon={<IndianRupee className="h-4 w-4" />}
            loading={configLoading}
            data-ocid="kpi.price_a.card"
          />
          <KPICard
            label="Type B Price"
            value={fmt(seatConfig?.pricePerSeatB)}
            subtext="per student / month"
            icon={<IndianRupee className="h-4 w-4" />}
            loading={configLoading}
            data-ocid="kpi.price_b.card"
          />
          <KPICard
            label="Type A Revenue"
            value={fmt(summary?.revenueA)}
            subtext={
              summary
                ? `${Number(summary.bookedSeatsA)} seats × price`
                : "this month"
            }
            variant="emerald"
            loading={anyLoading}
            data-ocid="kpi.revenue_a.card"
          />
          <KPICard
            label="Type B Revenue"
            value={fmt(summary?.revenueB)}
            subtext={
              summary
                ? `${Number(summary.bookedSeatsB)} seats × price`
                : "this month"
            }
            variant="blue"
            loading={anyLoading}
            data-ocid="kpi.revenue_b.card"
          />
        </div>

        {/* KPI Row 3 — Profit */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPICard
            label="Monthly Revenue"
            value={fmt(summary?.totalRevenue)}
            subtext="all seats combined"
            variant="emerald"
            loading={anyLoading}
            data-ocid="kpi.revenue.card"
          />
          <KPICard
            label="Total Expenses"
            value={fmt(profit?.totalExpenses)}
            subtext="rent + electricity + salary + other"
            variant="orange"
            loading={profitLoading}
            data-ocid="kpi.total_expenses.card"
          />
          <div data-ocid="kpi.profit_summary.card">
            <ProfitCard
              profit={profit}
              isLoading={profitLoading}
              monthLabel={monthLabel}
              yearLabel={yearLabel}
            />
          </div>
        </div>

        {/* Config + Expenses Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SeatConfigCard
            summary={summary}
            pricePerSeatA={seatConfig?.pricePerSeatA}
            pricePerSeatB={seatConfig?.pricePerSeatB}
            totalCapacity={seatConfig?.totalCapacity}
            year={year}
            month={month}
            isLoading={anyLoading}
          />
          <ExpensesCard
            expenses={expenses}
            year={year}
            month={month}
            isLoading={expensesLoading}
          />
        </div>
      </div>
    </Layout>
  );
}

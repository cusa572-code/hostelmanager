import { ExpensesCard } from "@/components/ExpensesCard";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useMonthSelector } from "@/hooks/useMonthSelector";
import { useMonthlyExpenses } from "@/hooks/useQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ExpensesPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } =
    useMonthSelector();

  const { data: expenses, isLoading } = useMonthlyExpenses(year, month);

  return (
    <Layout title="Expenses" subtitle="Monthly Breakdown">
      <div className="space-y-6 max-w-2xl" data-ocid="expenses.page">
        {/* Month Selector */}
        <div
          className="flex items-center gap-3"
          data-ocid="expenses.month_selector"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 shrink-0"
            data-ocid="expenses.prev_month_button"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center font-display text-base font-semibold text-foreground">
            {monthLabel} {yearLabel}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 shrink-0"
            data-ocid="expenses.next_month_button"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Expenses Card */}
        <ExpensesCard
          expenses={expenses}
          year={year}
          month={month}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}

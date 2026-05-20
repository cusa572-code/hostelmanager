import Array "mo:core/Array";
import Nat "mo:core/Nat";
import SeatLib "seats";
import ExpenseLib "expenses";
import ProfitTypes "../types/profit";

module {
  // Compute profit for a single month
  public func getMonthlyProfit(
    configStore : SeatLib.SeatConfigStore,
    bookingStore : SeatLib.BookingStore,
    expenseStore : ExpenseLib.ExpenseStore,
    year : Nat,
    month : Nat,
  ) : ProfitTypes.MonthlyProfit {
    let revenue = switch (SeatLib.getSummary(configStore, bookingStore, year, month)) {
      case (?s) s.totalRevenue;
      case null 0;
    };
    let expenses = ExpenseLib.totalExpenses(expenseStore, year, month);
    let profit : Int = revenue.toInt() - expenses.toInt();
    { year; month; revenue; totalExpenses = expenses; profit };
  };

  // Return profit for every month (1-12) of a given year for the yearly chart
  public func getYearlyChart(
    configStore : SeatLib.SeatConfigStore,
    bookingStore : SeatLib.BookingStore,
    expenseStore : ExpenseLib.ExpenseStore,
    year : Nat,
  ) : [ProfitTypes.YearlyChartEntry] {
    Array.tabulate<ProfitTypes.YearlyChartEntry>(
      12,
      func(i) {
        let month = i + 1;
        let mp = getMonthlyProfit(configStore, bookingStore, expenseStore, year, month);
        { month; profit = mp.profit };
      },
    );
  };
};

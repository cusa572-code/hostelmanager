import ProfitLib "../lib/profit";
import SeatLib "../lib/seats";
import ExpenseLib "../lib/expenses";
import ProfitTypes "../types/profit";

mixin (
  seatConfig : SeatLib.SeatConfigStore,
  seatBookings : SeatLib.BookingStore,
  expenseStore : ExpenseLib.ExpenseStore,
) {
  // Get profit details for a single month
  public query func getMonthlyProfit(year : Nat, month : Nat) : async ProfitTypes.MonthlyProfit {
    ProfitLib.getMonthlyProfit(seatConfig, seatBookings, expenseStore, year, month);
  };

  // Get profit for every month of a year (for the yearly chart)
  public query func getYearlyProfitChart(year : Nat) : async [ProfitTypes.YearlyChartEntry] {
    ProfitLib.getYearlyChart(seatConfig, seatBookings, expenseStore, year);
  };
};

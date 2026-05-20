import Common "common";

module {
  public type MonthKey = Common.MonthKey;

  // Profit summary for a single month
  public type MonthlyProfit = {
    year : Nat;
    month : Nat;
    revenue : Common.Amount;
    totalExpenses : Common.Amount;
    profit : Int; // can be negative
  };

  // Entry in a yearly chart: [month (1-12), profit]
  public type YearlyChartEntry = {
    month : Nat;
    profit : Int;
  };
};

import Common "common";

module {
  public type MonthKey = Common.MonthKey;

  // Monthly expense record broken down by category
  public type MonthlyExpenses = {
    key : MonthKey;
    rent : Common.Amount;
    electricity : Common.Amount;
    staffSalary : Common.Amount;
    other : Common.Amount;
  };

  // Input type for setting/updating expenses
  public type ExpenseInput = {
    rent : Common.Amount;
    electricity : Common.Amount;
    staffSalary : Common.Amount;
    other : Common.Amount;
  };
};

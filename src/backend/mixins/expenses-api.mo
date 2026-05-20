import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import ExpenseLib "../lib/expenses";
import ExpenseTypes "../types/expenses";

mixin (expenseStore : ExpenseLib.ExpenseStore) {
  // Set or overwrite monthly expenses by category
  public shared ({ caller }) func setMonthlyExpenses(
    year : Nat,
    month : Nat,
    input : ExpenseTypes.ExpenseInput,
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    ExpenseLib.setExpenses(expenseStore, year, month, input);
  };

  // Get expense breakdown for a specific month
  public query func getMonthlyExpenses(year : Nat, month : Nat) : async ?ExpenseTypes.MonthlyExpenses {
    ExpenseLib.getExpenses(expenseStore, year, month);
  };

  // Get total expenses for a specific month
  public query func getTotalExpenses(year : Nat, month : Nat) : async Nat {
    ExpenseLib.totalExpenses(expenseStore, year, month);
  };
};

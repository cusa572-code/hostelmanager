import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Types "../types/expenses";

module {
  public type ExpenseStore = Map.Map<(Nat, Nat), Types.MonthlyExpenses>; // key: (year, month)

  func compareMonthKey(a : (Nat, Nat), b : (Nat, Nat)) : Order.Order {
    let yearOrd = Nat.compare(a.0, b.0);
    if (yearOrd != #equal) yearOrd else Nat.compare(a.1, b.1);
  };

  // Set or overwrite expenses for a given month
  public func setExpenses(
    store : ExpenseStore,
    year : Nat,
    month : Nat,
    input : Types.ExpenseInput,
  ) {
    store.add(
      compareMonthKey,
      (year, month),
      {
        key = { year; month };
        rent = input.rent;
        electricity = input.electricity;
        staffSalary = input.staffSalary;
        other = input.other;
      },
    );
  };

  // Get expenses for a given month
  public func getExpenses(
    store : ExpenseStore,
    year : Nat,
    month : Nat,
  ) : ?Types.MonthlyExpenses {
    store.get(compareMonthKey, (year, month));
  };

  // Sum all expense categories for a given month
  public func totalExpenses(
    store : ExpenseStore,
    year : Nat,
    month : Nat,
  ) : Nat {
    switch (getExpenses(store, year, month)) {
      case null 0;
      case (?e) e.rent + e.electricity + e.staffSalary + e.other;
    };
  };
};

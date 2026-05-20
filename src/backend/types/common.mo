module {
  // A month key is a (year, month) pair: year e.g. 2024, month 1-12
  public type MonthKey = { year : Nat; month : Nat };

  // Monetary amounts are stored as Nat (e.g. smallest currency unit or whole units)
  public type Amount = Nat;
};

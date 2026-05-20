import Common "common";

module {
  public type MonthKey = Common.MonthKey;

  // Configuration: total seat capacity and dual-tier pricing per month
  public type SeatConfig = {
    totalCapacity : Nat;
    pricePerSeatA : Common.Amount; // default 8500
    pricePerSeatB : Common.Amount; // default 8900
  };

  // Monthly booking record with tier-based counts
  public type MonthlyBooking = {
    key : MonthKey;
    bookedSeatsA : Nat; // seats booked at tier A price (8500)
    bookedSeatsB : Nat; // seats booked at tier B price (8900)
  };

  // Derived view returned to callers
  public type SeatSummary = {
    year : Nat;
    month : Nat;
    totalCapacity : Nat;
    bookedSeatsA : Nat;
    bookedSeatsB : Nat;
    totalBookedSeats : Nat;
    emptySeats : Nat;
    pricePerSeatA : Common.Amount;
    pricePerSeatB : Common.Amount;
    revenueA : Common.Amount;
    revenueB : Common.Amount;
    totalRevenue : Common.Amount;
  };
};

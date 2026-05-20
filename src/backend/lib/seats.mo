import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Types "../types/seats";

module {
  public type SeatConfigStore = Map.Map<Nat, Types.SeatConfig>; // key: 0 (singleton config)
  public type BookingStore = Map.Map<(Nat, Nat), Types.MonthlyBooking>; // key: (year, month)

  func compareMonthKey(a : (Nat, Nat), b : (Nat, Nat)) : Order.Order {
    let yearOrd = Nat.compare(a.0, b.0);
    if (yearOrd != #equal) yearOrd else Nat.compare(a.1, b.1);
  };

  // Set or update global seat configuration with dual-tier pricing
  public func setConfig(
    store : SeatConfigStore,
    totalCapacity : Nat,
    pricePerSeatA : Nat,
    pricePerSeatB : Nat,
  ) {
    let cfg : Types.SeatConfig = { totalCapacity; pricePerSeatA; pricePerSeatB };
    store.add(0, cfg);
  };

  // Get current seat configuration
  public func getConfig(store : SeatConfigStore) : ?Types.SeatConfig {
    store.get(0);
  };

  // Set booked seats for a given month with tier-based counts
  public func setBooking(
    store : BookingStore,
    year : Nat,
    month : Nat,
    bookedSeatsA : Nat,
    bookedSeatsB : Nat,
  ) {
    let key : (Nat, Nat) = (year, month);
    let booking : Types.MonthlyBooking = {
      key = { year; month };
      bookedSeatsA;
      bookedSeatsB;
    };
    store.add(compareMonthKey, key, booking);
  };

  // Get seat summary for a given month (capacity, booked per tier, empty, revenue per tier, total)
  public func getSummary(
    configStore : SeatConfigStore,
    bookingStore : BookingStore,
    year : Nat,
    month : Nat,
  ) : ?Types.SeatSummary {
    switch (configStore.get(0)) {
      case null { null };
      case (?cfg) {
        let key : (Nat, Nat) = (year, month);
        let (bookedA, bookedB) = switch (bookingStore.get(compareMonthKey, key)) {
          case null { (0, 0) };
          case (?b) { (b.bookedSeatsA, b.bookedSeatsB) };
        };
        let totalBooked = bookedA + bookedB;
        let empty = if (cfg.totalCapacity >= totalBooked) cfg.totalCapacity - totalBooked else 0;
        let revA = bookedA * cfg.pricePerSeatA;
        let revB = bookedB * cfg.pricePerSeatB;
        ?{
          year;
          month;
          totalCapacity   = cfg.totalCapacity;
          bookedSeatsA    = bookedA;
          bookedSeatsB    = bookedB;
          totalBookedSeats = totalBooked;
          emptySeats      = empty;
          pricePerSeatA   = cfg.pricePerSeatA;
          pricePerSeatB   = cfg.pricePerSeatB;
          revenueA        = revA;
          revenueB        = revB;
          totalRevenue    = revA + revB;
        };
      };
    };
  };
};

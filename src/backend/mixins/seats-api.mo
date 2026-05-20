import Runtime "mo:core/Runtime";
import SeatLib "../lib/seats";
import SeatTypes "../types/seats";

mixin (
  seatConfig : SeatLib.SeatConfigStore,
  seatBookings : SeatLib.BookingStore,
) {
  // Set total seat capacity and dual-tier prices (A = 8500, B = 8900 by default)
  public shared ({ caller }) func setSeatConfig(
    totalCapacity : Nat,
    pricePerSeatA : Nat,
    pricePerSeatB : Nat,
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    SeatLib.setConfig(seatConfig, totalCapacity, pricePerSeatA, pricePerSeatB);
  };

  // Get current seat configuration
  public query func getSeatConfig() : async ?SeatTypes.SeatConfig {
    SeatLib.getConfig(seatConfig);
  };

  // Record or update tier-based booked seats for a specific month
  public shared ({ caller }) func setMonthlyBooking(
    year : Nat,
    month : Nat,
    bookedSeatsA : Nat,
    bookedSeatsB : Nat,
  ) : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    SeatLib.setBooking(seatBookings, year, month, bookedSeatsA, bookedSeatsB);
  };

  // Get seat summary for a month (capacity, booked per tier, empty, revenue per tier, total)
  public query func getMonthSeatSummary(year : Nat, month : Nat) : async ?SeatTypes.SeatSummary {
    SeatLib.getSummary(seatConfig, seatBookings, year, month);
  };
};

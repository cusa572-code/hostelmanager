import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/payments";

module {
  public type PaymentStore = List.List<Types.Payment>;
  public type SettingsStore = Map.Map<Text, Nat>;
  public type IdCounter = { var value : Nat };

  let SETTINGS_KEY_LATE_FEE = "lateFeePerMonth";
  let DEFAULT_LATE_FEE : Nat = 100;

  // Returns nanoseconds for the 1st of the given year/month (UTC approx.)
  func monthStartNanos(year : Nat, month : Nat) : Int {
    // Approximate: each year = 365 days, each month using cumulative days
    let daysInMonths : [Nat] = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let yearsFromEpoch : Int = Int.fromNat(year) - 1970;
    var daysToMonth : Int = 0;
    var m = 1;
    while (m < month) {
      daysToMonth += Int.fromNat(daysInMonths[m]);
      m += 1;
    };
    let totalDays = yearsFromEpoch * 365 + daysToMonth;
    totalDays * 24 * 60 * 60 * 1_000_000_000;
  };

  public func create(store : PaymentStore, idCounter : IdCounter, input : Types.PaymentInput) : Types.PaymentId {
    let id = idCounter.value;
    idCounter.value += 1;
    let now = Time.now();
    let dueDate = monthStartNanos(input.year, input.month);
    // Late fee: 0 if not overdue, else lateFeePerMonth (caller passes settings)
    // We compute 0 here; caller can provide via settings
    store.add({
      id;
      studentId = input.studentId;
      year = input.year;
      month = input.month;
      rentDue = input.rentDue;
      paidAmount = input.paidAmount;
      status = input.status;
      dueDate;
      paidDate = if (input.status == #paid) { ?now } else { null };
      note = input.note;
      lateFee = 0;
      createdAt = now;
    });
    id;
  };

  public func createWithSettings(
    store : PaymentStore,
    idCounter : IdCounter,
    settingsStore : SettingsStore,
    input : Types.PaymentInput,
  ) : Types.PaymentId {
    let id = idCounter.value;
    idCounter.value += 1;
    let now = Time.now();
    let dueDate = monthStartNanos(input.year, input.month);
    let lateFeePerMonth = switch (settingsStore.get(SETTINGS_KEY_LATE_FEE)) {
      case (?fee) { fee };
      case null { DEFAULT_LATE_FEE };
    };
    let lateFee : Nat = if (now > dueDate) { lateFeePerMonth } else { 0 };
    store.add({
      id;
      studentId = input.studentId;
      year = input.year;
      month = input.month;
      rentDue = input.rentDue;
      paidAmount = input.paidAmount;
      status = input.status;
      dueDate;
      paidDate = if (input.status == #paid) { ?now } else { null };
      note = input.note;
      lateFee;
      createdAt = now;
    });
    id;
  };

  public func update(store : PaymentStore, id : Types.PaymentId, input : Types.PaymentInput) : Bool {
    var found = false;
    store.mapInPlace(func(payment) {
      if (payment.id == id) {
        found := true;
        let now = Time.now();
        {
          payment with
          paidAmount = input.paidAmount;
          status = input.status;
          note = input.note;
          paidDate = if (input.status == #paid) { ?now } else { payment.paidDate };
        };
      } else {
        payment;
      };
    });
    found;
  };

  public func delete(store : PaymentStore, id : Types.PaymentId) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(p) { p.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };

  public func list(store : PaymentStore) : [Types.Payment] {
    let arr = store.toArray();
    arr.sort<Types.Payment>(func(a, b) {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
  };

  public func listByStudent(store : PaymentStore, studentId : Types.StudentId) : [Types.Payment] {
    let arr = store.toArray().filter(func(p) { p.studentId == studentId });
    arr.sort<Types.Payment>(func(a, b) {
      if (a.year > b.year) { #less }
      else if (a.year < b.year) { #greater }
      else if (a.month > b.month) { #less }
      else if (a.month < b.month) { #greater }
      else { #equal };
    });
  };

  public func getSettings(settingsStore : SettingsStore) : Types.HostelSettings {
    let lateFeePerMonth = switch (settingsStore.get(SETTINGS_KEY_LATE_FEE)) {
      case (?fee) { fee };
      case null { DEFAULT_LATE_FEE };
    };
    { lateFeePerMonth };
  };

  public func updateSettings(settingsStore : SettingsStore, settings : Types.HostelSettings) {
    settingsStore.add(SETTINGS_KEY_LATE_FEE, settings.lateFeePerMonth);
  };
};

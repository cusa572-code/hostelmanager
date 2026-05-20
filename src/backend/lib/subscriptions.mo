import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/subscriptions";

module {
  public type SubscriptionStore = Map.Map<Principal, Types.SubscriptionRecord>;

  // 7-day free trial in nanoseconds (604_800_000_000_000)
  let TRIAL_DURATION_NS : Int = 604_800_000_000_000;

  // Plan durations in nanoseconds
  func planDurationNs(planId : Types.PlanId) : Int {
    switch planId {
      case (#monthly)  { 2_592_000_000_000_000   }; // 30 days
      case (#quarterly){ 7_776_000_000_000_000   }; // 90 days
      case (#biannual) { 15_552_000_000_000_000  }; // 180 days
      case (#annual)   { 31_536_000_000_000_000  }; // 365 days
    };
  };

  // Start a free trial for the caller (idempotent if already started)
  public func startTrial(
    store : SubscriptionStore,
    userId : Principal,
    now : Int,
  ) {
    // Only create if no record exists yet
    switch (store.get(userId)) {
      case (?_existing) { /* already started — idempotent */ };
      case null {
        let expiryDate : ?Int = ?(now + TRIAL_DURATION_NS);
        let record : Types.SubscriptionRecord = {
          userId;
          status         = #trial;
          trialStartDate = now;
          expiryDate;
          planId         = null;
        };
        store.add(userId, record);
      };
    };
  };

  // Activate a paid plan, computing expiry from now based on plan duration
  public func activatePlan(
    store : SubscriptionStore,
    userId : Principal,
    planId : Types.PlanId,
    now : Int,
  ) {
    let newExpiry : Int = now + planDurationNs(planId);
    switch (store.get(userId)) {
      case (?existing) {
        let updated : Types.SubscriptionRecord = {
          existing with
          status     = #active;
          expiryDate = ?newExpiry;
          planId     = ?planId;
        };
        store.add(userId, updated);
      };
      case null {
        // No trial started yet — activate directly
        let record : Types.SubscriptionRecord = {
          userId;
          status         = #active;
          trialStartDate = now;
          expiryDate     = ?newExpiry;
          planId         = ?planId;
        };
        store.add(userId, record);
      };
    };
  };

  // Cancel subscription (expire immediately)
  public func cancelSubscription(
    store : SubscriptionStore,
    userId : Principal,
    now : Int,
  ) {
    switch (store.get(userId)) {
      case (?existing) {
        let updated : Types.SubscriptionRecord = {
          existing with
          status     = #expired;
          expiryDate = ?now;
        };
        store.add(userId, updated);
      };
      case null { /* nothing to cancel */ };
    };
  };

  // Get subscription record for a user
  public func getSubscription(
    store : SubscriptionStore,
    userId : Principal,
  ) : ?Types.SubscriptionRecord {
    store.get(userId);
  };

  // Resolve current effective status, checking expiry against now
  public func resolveStatus(
    store : SubscriptionStore,
    userId : Principal,
    now : Int,
  ) : { status : Types.SubscriptionStatus; daysRemaining : Nat } {
    switch (store.get(userId)) {
      case null { { status = #expired; daysRemaining = 0 } };
      case (?rec) {
        switch (rec.expiryDate) {
          case null { { status = #expired; daysRemaining = 0 } };
          case (?expiry) {
            if (now < expiry) {
              let remainingNs : Int = expiry - now;
              let daysNat : Nat = switch (remainingNs.toNat()) {
                case n { n / 1_000_000_000 / 86400 };
              };
              let status : Types.SubscriptionStatus = switch (rec.planId) {
                case null  { #trial  };
                case (?_p) { #active };
              };
              { status; daysRemaining = daysNat };
            } else {
              { status = #expired; daysRemaining = 0 };
            };
          };
        };
      };
    };
  };
};

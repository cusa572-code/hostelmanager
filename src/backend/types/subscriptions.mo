module {
  // Subscription plan identifiers with their billing period
  // monthly   = 100 INR / 1 month
  // quarterly = 250 INR / 3 months
  // biannual  = 450 INR / 6 months
  // annual    = 800 INR / 12 months
  public type PlanId = {
    #monthly;
    #quarterly;
    #biannual;
    #annual;
  };

  // Pricing constants in INR (Rupees) as Nat
  public let PRICE_MONTHLY   : Nat = 100;
  public let PRICE_QUARTERLY : Nat = 250;
  public let PRICE_BIANNUAL  : Nat = 450;
  public let PRICE_ANNUAL    : Nat = 800;

  // Free trial duration constants
  public let TRIAL_DAYS : Nat = 7;

  // Lifecycle state of a subscription
  public type SubscriptionStatus = {
    #trial;   // 1-week free trial active
    #active;  // paid plan, within expiry window
    #expired; // trial elapsed or payment period ended
  };

  // Per-user subscription record (stored in canister state)
  public type SubscriptionRecord = {
    userId         : Principal;
    status         : SubscriptionStatus;
    trialStartDate : Int;  // nanoseconds since epoch (Time.now())
    expiryDate     : ?Int; // nanoseconds since epoch; null = never expires (shouldn't occur)
    planId         : ?PlanId; // null while on trial only
  };

  // Public result type returned by getMySubscriptionStatus
  public type SubscriptionStatusResult = {
    status        : SubscriptionStatus;
    daysRemaining : Nat;
  };
};

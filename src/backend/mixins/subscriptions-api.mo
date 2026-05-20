import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import SubLib "../lib/subscriptions";
import SubTypes "../types/subscriptions";

mixin (
  subscriptions : SubLib.SubscriptionStore,
) {
  // Begin or retrieve the caller's free trial (1 week, idempotent)
  public shared ({ caller }) func startTrial() : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    SubLib.startTrial(subscriptions, caller, Time.now());
  };

  // Activate a paid plan for the caller
  // Plans: #monthly (100 INR), #quarterly (250 INR), #biannual (450 INR), #annual (800 INR)
  public shared ({ caller }) func activateSubscription(planId : SubTypes.PlanId) : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    SubLib.activatePlan(subscriptions, caller, planId, Time.now());
  };

  // Cancel current subscription
  public shared ({ caller }) func cancelSubscription() : async () {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    SubLib.cancelSubscription(subscriptions, caller, Time.now());
  };

  // Get the caller's current subscription record
  public query ({ caller }) func getMySubscription() : async ?SubTypes.SubscriptionRecord {
    SubLib.getSubscription(subscriptions, caller);
  };

  // Resolve the caller's effective status and days remaining
  public shared ({ caller }) func getMySubscriptionStatus() : async SubTypes.SubscriptionStatusResult {
    if (caller.isAnonymous()) Runtime.trap("Unauthorized");
    let result = SubLib.resolveStatus(subscriptions, caller, Time.now());
    { status = result.status; daysRemaining = result.daysRemaining };
  };

  // Stripe webhook endpoint — receives payment confirmation and activates plan
  // The planId is encoded in the Stripe metadata field "planId"
  public shared func stripeWebhook(
    userId : Principal,
    planId : SubTypes.PlanId,
  ) : async () {
    SubLib.activatePlan(subscriptions, userId, planId, Time.now());
  };
};

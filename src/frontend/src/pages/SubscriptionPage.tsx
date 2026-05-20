import { PlanId } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActivateSubscription } from "@/hooks/useQueries";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import { PLAN_OPTIONS } from "@/types";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

const PLAN_FEATURES = [
  "Yearly profit chart & analytics",
  "Revenue breakdown by student type",
  "Unlimited months of data",
  "Expense tracking & profit calculations",
  "Priority support",
];

const PLAN_ID_MAP: Record<string, PlanId> = {
  monthly: PlanId.monthly,
  quarterly: PlanId.quarterly,
  biannual: PlanId.biannual,
  annual: PlanId.annual,
};

function TrialBanner({ daysRemaining }: { daysRemaining: number }) {
  return (
    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-5 flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20">
        <Sparkles className="h-5 w-5 text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-foreground">
          Free Trial Active — {daysRemaining} day
          {daysRemaining !== 1 ? "s" : ""} remaining
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          You have full access to all premium features during your trial.
          Upgrade before it expires to keep access.
        </p>
      </div>
      <Badge className="shrink-0 border-orange-500/40 bg-orange-500/15 text-orange-400 gap-1.5">
        <Crown className="h-3 w-3" />
        Trial
      </Badge>
    </div>
  );
}

function ActiveBanner() {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
        <Crown className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-foreground">
          Premium Active
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          You have full access to all premium features. Thank you for
          subscribing!
        </p>
      </div>
      <Badge className="shrink-0 border-emerald-500/40 bg-emerald-500/15 text-emerald-400 gap-1.5">
        <Check className="h-3 w-3" />
        Active
      </Badge>
    </div>
  );
}

export default function SubscriptionPage() {
  const { status, daysRemaining } = useSubscription();
  const activate = useActivateSubscription();

  const handleActivate = (planId: string) => {
    const id = PLAN_ID_MAP[planId];
    if (id) activate.mutate(id);
  };

  return (
    <Layout title="Subscription" subtitle="Premium Plans">
      <div
        className="mx-auto max-w-4xl space-y-8"
        data-ocid="subscription.page"
      >
        {/* Status banner */}
        {status === "trial" && <TrialBanner daysRemaining={daysRemaining} />}
        {status === "active" && <ActiveBanner />}
        {status === "expired" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-5">
            <p className="font-display font-semibold text-foreground">
              Your subscription has expired
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a plan below to restore access to premium features.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xs-label text-primary">Premium Plans</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Unlock Full Analytics
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get access to yearly profit charts, detailed revenue breakdowns, and
            full historical data. Start with a free 1-week trial.
          </p>
        </div>

        {/* Plan cards */}
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          data-ocid="subscription.plans"
        >
          {PLAN_OPTIONS.map((plan, index) => (
            <div
              key={plan.id}
              data-ocid={`subscription.plan.${index + 1}`}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5 transition-smooth",
                plan.highlight
                  ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-border/80",
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="border-primary/40 bg-primary/20 text-primary gap-1 shadow">
                    <Crown className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {plan.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={cn(
                        "font-display text-3xl font-bold",
                        plan.highlight ? "text-primary" : "text-foreground",
                      )}
                    >
                      {plan.priceLabel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.perMonth} · {plan.duration}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 pt-2 border-t border-border">
                  {PLAN_FEATURES.slice(0, 3).map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={cn(
                  "mt-4 w-full gap-2",
                  plan.highlight ? "" : "variant-outline",
                )}
                variant={plan.highlight ? "default" : "outline"}
                disabled={activate.isPending || status === "active"}
                onClick={() => handleActivate(plan.id)}
                data-ocid={`subscription.plan.${index + 1}.subscribe_button`}
              >
                <Crown className="h-3.5 w-3.5" />
                {status === "active" ? "Current Plan" : `Get ${plan.label}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Trial note */}
        <div className="rounded-xl border border-border bg-card px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              1 week free trial
            </span>{" "}
            included with all plans. No payment required to start — explore all
            features risk-free.
          </p>
        </div>

        {/* All features list */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Everything included in Premium
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PLAN_FEATURES.map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-primary shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

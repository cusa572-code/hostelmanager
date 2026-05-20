import { SubscriptionStatus } from "@/backend";
import { useMySubscription, useStartTrial } from "@/hooks/useQueries";
import { useEffect } from "react";

export interface SubscriptionInfo {
  status: "trial" | "active" | "expired" | "unknown";
  daysRemaining: number;
  isLoading: boolean;
  isPremium: boolean;
  isTrial: boolean;
  isExpired: boolean;
}

/**
 * Provides subscription status and auto-starts trial on first load.
 */
export function useSubscription(): SubscriptionInfo {
  const { data: sub, isLoading } = useMySubscription();
  const startTrial = useStartTrial();

  // Auto-start trial if no subscription exists
  useEffect(() => {
    if (
      !isLoading &&
      sub === null &&
      !startTrial.isPending &&
      !startTrial.isSuccess
    ) {
      startTrial.mutate();
    }
  }, [isLoading, sub, startTrial]);

  if (isLoading || sub === undefined) {
    return {
      status: "unknown",
      daysRemaining: 0,
      isLoading: true,
      isPremium: false,
      isTrial: false,
      isExpired: false,
    };
  }

  if (!sub) {
    return {
      status: "trial",
      daysRemaining: 7,
      isLoading: false,
      isPremium: true,
      isTrial: true,
      isExpired: false,
    };
  }

  const now = Date.now();
  const expiryDate = sub.expiryDate ? Number(sub.expiryDate) / 1_000_000 : null;
  const trialEnd =
    Number(sub.trialStartDate) / 1_000_000 + 7 * 24 * 60 * 60 * 1000;

  let daysRemaining = 0;

  if (sub.status === SubscriptionStatus.trial) {
    daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000)),
    );
  } else if (sub.status === SubscriptionStatus.active && expiryDate) {
    daysRemaining = Math.max(
      0,
      Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000)),
    );
  }

  const status =
    sub.status === SubscriptionStatus.trial
      ? "trial"
      : sub.status === SubscriptionStatus.active
        ? "active"
        : "expired";

  return {
    status,
    daysRemaining,
    isLoading: false,
    isPremium: status === "trial" || status === "active",
    isTrial: status === "trial",
    isExpired: status === "expired",
  };
}

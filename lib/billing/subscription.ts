import type { BillingPlan } from "@/lib/billing/types";

export type ComputeSubscriptionPeriodInput = {
  now: Date;
  plan: BillingPlan;
  currentEndsAt?: Date | null;
};

export type SubscriptionPeriod = {
  startsAt: Date;
  endsAt: Date;
  isStacked: boolean;
};

function addPlanDuration(base: Date, plan: BillingPlan): Date {
  const next = new Date(base);
  if (plan.durationUnit === "month") {
    next.setUTCMonth(next.getUTCMonth() + plan.durationValue);
    return next;
  }
  next.setUTCFullYear(next.getUTCFullYear() + plan.durationValue);
  return next;
}

export function computeSubscriptionPeriod(
  input: ComputeSubscriptionPeriodInput
): SubscriptionPeriod {
  const { now, plan, currentEndsAt } = input;
  const isStacked = Boolean(
    currentEndsAt && currentEndsAt.getTime() > now.getTime()
  );
  const startsAt = now;
  const extensionBase = isStacked ? currentEndsAt! : now;
  const endsAt = addPlanDuration(extensionBase, plan);

  return { startsAt, endsAt, isStacked };
}


import { PLAN_IDS, type BillingPlan, type PlanId } from "@/lib/billing/types";

const PLAN_MAP: Record<PlanId, BillingPlan> = {
  monthly: {
    id: "monthly",
    amountHalalas: 9999,
    currency: "SAR",
    durationValue: 1,
    durationUnit: "month",
  },
  yearly: {
    id: "yearly",
    amountHalalas: 99999,
    currency: "SAR",
    durationValue: 1,
    durationUnit: "year",
  },
};

export function isPlanId(value: string): value is PlanId {
  return (PLAN_IDS as readonly string[]).includes(value);
}

export function getPlan(planId: string): BillingPlan {
  if (!isPlanId(planId)) {
    throw new Error("Invalid plan ID.");
  }
  return PLAN_MAP[planId];
}

export function listPlans(): BillingPlan[] {
  return PLAN_IDS.map((id) => PLAN_MAP[id]);
}


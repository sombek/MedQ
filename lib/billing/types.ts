export const PLAN_IDS = ["monthly", "yearly"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export type PlanDurationUnit = "month" | "year";

export type BillingPlan = {
  id: PlanId;
  amountHalalas: number;
  currency: "SAR";
  durationValue: 1;
  durationUnit: PlanDurationUnit;
};

export type SubscriptionStatus = "active" | "expired";


import { randomUUID } from "node:crypto";

import { adminDb } from "@/lib/admin-db";
import { getPlan } from "@/lib/billing/plans";
import { computeSubscriptionPeriod } from "@/lib/billing/subscription";
import type { MoyasarWebhookEvent } from "@/lib/moyasar/types";

export async function processMoyasarWebhook(event: MoyasarWebhookEvent) {
  const payment = event.data;
  if (!payment?.id) {
    return { accepted: false, reason: "missing_payment" as const };
  }

  const metadata = payment.metadata ?? {};
  const userId = metadata.userId;
  const planId = metadata.planId;

  if (!userId || !planId) {
    return { accepted: false, reason: "missing_metadata" as const };
  }

  const plan = getPlan(planId);
  if (payment.amount !== plan.amountHalalas || payment.currency !== plan.currency) {
    return { accepted: false, reason: "amount_mismatch" as const };
  }

  const existingPayment = await adminDb.query({
    payments: {
      $: {
        where: { moyasarPaymentId: payment.id },
        limit: 1,
      },
    },
  });

  const alreadyPaid = existingPayment.payments[0]?.status === "paid";
  if (alreadyPaid && event.type === "payment_paid") {
    return { accepted: true, reason: "already_processed" as const };
  }

  const paymentRowId = existingPayment.payments[0]?.id ?? randomUUID();
  const paymentTx = adminDb.tx.payments[paymentRowId].update({
    userId,
    planId,
    moyasarPaymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    paidAt: payment.status === "paid" ? new Date().toISOString() : undefined,
    sourceType: payment.source?.type,
    sourceCompany: payment.source?.company,
    sourceLast4: payment.source?.last4,
    tokenId: payment.source?.token,
    rawMeta: metadata,
    createdAt:
      existingPayment.payments[0]?.createdAt ?? new Date().toISOString(),
  });

  if (event.type === "payment_paid" && payment.status === "paid") {
    const existingSubscription = await adminDb.query({
      subscriptions: {
        $: {
          where: { userId },
          limit: 1,
        },
      },
    });

    const now = new Date();
    const currentEndsAt = existingSubscription.subscriptions[0]?.endsAt
      ? new Date(existingSubscription.subscriptions[0].endsAt)
      : null;

    const period = computeSubscriptionPeriod({
      now,
      plan,
      currentEndsAt,
    });

    const subscriptionRowId =
      existingSubscription.subscriptions[0]?.id ?? randomUUID();

    await adminDb.transact([
      paymentTx,
      adminDb.tx.subscriptions[subscriptionRowId].update({
        userId,
        planId,
        status: "active",
        startsAt:
          existingSubscription.subscriptions[0]?.startsAt ??
          period.startsAt.toISOString(),
        endsAt: period.endsAt.toISOString(),
        lastPaymentId: payment.id,
        createdAt:
          existingSubscription.subscriptions[0]?.createdAt ?? now.toISOString(),
        updatedAt: now.toISOString(),
      }),
    ]);
  } else {
    await adminDb.transact([paymentTx]);
  }
  return { accepted: true, reason: "processed" as const };
}


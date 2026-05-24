import { getUnverifiedUserFromInstantCookie } from "@instantdb/react/nextjs";

import { getPlan } from "@/lib/billing/plans";
import { createMoyasarPayment } from "@/lib/moyasar/client";

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const appBaseUrl = process.env.APP_BASE_URL;

if (!appId) {
  throw new Error("NEXT_PUBLIC_INSTANT_APP_ID is not set.");
}

if (!appBaseUrl) {
  throw new Error("APP_BASE_URL is not set.");
}

const instantAppId: string = appId;
const appOrigin: string = appBaseUrl;

type CheckoutBody = {
  planId?: string;
  applePayToken?: string;
};

export async function POST(request: Request) {
  try {
    const user = await getUnverifiedUserFromInstantCookie(instantAppId);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CheckoutBody;
    if (!body.planId || !body.applePayToken) {
      return Response.json(
        { error: "Missing planId or applePayToken" },
        { status: 400 }
      );
    }

    const plan = getPlan(body.planId);
    const payment = await createMoyasarPayment({
      amount: plan.amountHalalas,
      currency: plan.currency,
      description: `MedQ ${plan.id} subscription`,
      callback_url: `${appOrigin}/practice`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        renewalType: "manual",
      },
      source: {
        type: "applepay",
        token: body.applePayToken,
        save_card: true,
        manual: false,
      },
    });

    return Response.json({
      paymentId: payment.id,
      status: payment.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout request failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}


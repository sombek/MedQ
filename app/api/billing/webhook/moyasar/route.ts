import { processMoyasarWebhook } from "@/lib/billing/webhook";
import type { MoyasarWebhookEvent } from "@/lib/moyasar/types";

const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("MOYASAR_WEBHOOK_SECRET is not set.");
}

export async function POST(request: Request) {
  try {
    const event = (await request.json()) as MoyasarWebhookEvent;
    if (event.secret_token !== webhookSecret) {
      return Response.json({ error: "Invalid webhook secret." }, { status: 401 });
    }

    const result = await processMoyasarWebhook(event);
    if (!result.accepted) {
      return Response.json({ ok: true, skipped: result.reason }, { status: 202 });
    }

    return Response.json({ ok: true, result: result.reason });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process webhook.";
    return Response.json({ error: message }, { status: 500 });
  }
}


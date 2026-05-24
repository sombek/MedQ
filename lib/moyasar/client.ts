import type {
  MoyasarPaymentRequest,
  MoyasarPaymentResponse,
} from "@/lib/moyasar/types";

const MOYASAR_API_BASE_URL = "https://api.moyasar.com/v1";

const secretKey = process.env.MOYASAR_SECRET_KEY;

if (!secretKey) {
  throw new Error("MOYASAR_SECRET_KEY is not set in environment.");
}

function getBasicAuthHeader(): string {
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

export async function createMoyasarPayment(
  payload: MoyasarPaymentRequest
): Promise<MoyasarPaymentResponse> {
  const response = await fetch(`${MOYASAR_API_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Moyasar create payment failed: ${message}`);
  }

  return (await response.json()) as MoyasarPaymentResponse;
}


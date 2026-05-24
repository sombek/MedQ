export type MoyasarPaymentStatus =
  | "initiated"
  | "paid"
  | "failed"
  | "authorized"
  | "captured"
  | "voided"
  | "refunded"
  | "verified";

export type MoyasarPaymentRequest = {
  amount: number;
  currency: "SAR";
  description: string;
  callback_url: string;
  metadata: Record<string, string>;
  source: {
    type: "applepay";
    token: string;
    save_card?: boolean;
    manual?: boolean;
  };
};

export type MoyasarPaymentResponse = {
  id: string;
  status: MoyasarPaymentStatus;
  amount: number;
  currency: "SAR";
  metadata?: Record<string, string>;
  source?: {
    type?: string;
    company?: string;
    last4?: string;
    token?: string;
  };
};

export type MoyasarWebhookEvent = {
  id?: string;
  type: string;
  created_at?: string;
  secret_token?: string;
  data?: MoyasarPaymentResponse;
};


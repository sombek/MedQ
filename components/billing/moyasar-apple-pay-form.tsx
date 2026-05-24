"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { listPlans } from "@/lib/billing/plans";
import { db } from "@/lib/db";

declare global {
  interface Window {
    Moyasar?: {
      init: (config: Record<string, unknown>) => void;
    };
  }
}

const MOYASAR_SCRIPT_ID = "moyasar-payment-form-script";
const MOYASAR_CSS_ID = "moyasar-payment-form-css";
const MOYASAR_SCRIPT_SRC =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.7/dist/moyasar.umd.min.js";
const MOYASAR_CSS_SRC =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.7/dist/moyasar.css";

function loadMoyasarSdk() {
  if (!document.getElementById(MOYASAR_CSS_ID)) {
    const link = document.createElement("link");
    link.id = MOYASAR_CSS_ID;
    link.rel = "stylesheet";
    link.href = MOYASAR_CSS_SRC;
    document.head.appendChild(link);
  }

  if (window.Moyasar) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(
    MOYASAR_SCRIPT_ID
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise<void>((resolve) => {
      if (window.Moyasar) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = MOYASAR_SCRIPT_ID;
    script.src = MOYASAR_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Moyasar SDK"));
    document.body.appendChild(script);
  });
}

export function MoyasarApplePayForm() {
  const t = useTranslations("billing");
  const locale = useLocale();
  const auth = db.useAuth();
  const plans = useMemo(() => listPlans(), []);
  const [isReady, setIsReady] = useState(false);

  const publishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!publishableKey || !auth.user) {
      setIsReady(false);
      return;
    }

    let cancelled = false;

    const initializeForms = () => {
      if (cancelled || !window.Moyasar) return false;

      const containersReady = plans.every((plan) =>
        document.getElementById(`moyasar-${plan.id}`)
      );
      if (!containersReady) return false;

      plans.forEach((plan) => {
        const container = document.getElementById(`moyasar-${plan.id}`);
        if (!container) return;

        container.replaceChildren();

        window.Moyasar!.init({
          element: `#moyasar-${plan.id}`,
          amount: plan.amountHalalas,
          currency: "SAR",
          description: `MedQ ${plan.id} subscription`,
          publishable_api_key: publishableKey,
          callback_url: `${window.location.origin}/${locale}/billing`,
          methods: ["applepay"],
          language: locale === "ar" ? "ar" : "en",
          supported_networks: ["mada", "visa", "mastercard"],
          apple_pay: {
            country: "SA",
            label: "MedQ",
            validate_merchant_url:
              "https://api.moyasar.com/v1/applepay/initiate",
          },
          metadata: {
            userId: String(auth.user!.id),
            planId: plan.id,
            renewalType: "manual",
          },
          on_completed: async () => {
            toast.success(t("paymentSubmitted"));
          },
        });
      });

      setIsReady(true);
      return true;
    };

    const waitForContainersAndInit = () => {
      if (cancelled) return;

      if (initializeForms()) return;

      requestAnimationFrame(waitForContainersAndInit);
    };

    loadMoyasarSdk()
      .then(() => {
        if (!cancelled) waitForContainersAndInit();
      })
      .catch(() => {
        if (!cancelled) setIsReady(false);
      });

    return () => {
      cancelled = true;
      setIsReady(false);
    };
  }, [auth.user, locale, plans, publishableKey, t]);

  if (!auth.user) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <p className="text-sm">{t("signInRequired")}</p>
          <Button render={<Link href="/login" />}>{t("goToLogin")}</Button>
        </CardContent>
      </Card>
    );
  }

  if (!publishableKey) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm">{t("missingPublishableKey")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{t(`plans.${plan.id}.title`)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold">{t(`plans.${plan.id}.price`)}</p>
            <p className="text-muted-foreground text-xs">{t("applePayOnly")}</p>
            <p className="text-muted-foreground text-xs">{t("manualRenewNotice")}</p>
            <div id={`moyasar-${plan.id}`} className="min-h-12" />
            {!isReady ? (
              <p className="text-muted-foreground text-xs">{t("loadingCheckout")}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

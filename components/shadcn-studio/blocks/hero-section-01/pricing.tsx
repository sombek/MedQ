import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const plans = ["monthly", "yearly"] as const;

export default async function PricingSection() {
  const t = await getTranslations("landingPricing");

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan} className="border-primary/20">
              <CardHeader>
                <CardTitle>{t(`plans.${plan}.name`)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold">{t(`plans.${plan}.price`)}</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>{t("featureUnlimited")}</li>
                  <li>{t("featureApplePay")}</li>
                  <li>{t("featureManualRenew")}</li>
                </ul>
                <Button className="w-full" render={<Link href="/billing" />}>
                  {t("cta")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


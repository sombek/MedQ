import { getTranslations } from "next-intl/server";

import PricingCards from "@/components/shadcn-studio/blocks/pricing-component-01/pricing-component-01";

export default async function PricingSection() {
  const t = await getTranslations("landingPricing");

  const pricingData = [
    {
      id: "medq-pro",
      title: t("title"),
      description: t("subtitle"),
      monthly: 99.99,
      annual: 999.99,
      features: [
        t("featureUnlimited"),
        t("featureApplePay"),
        t("featureManualRenew"),
      ],
    },
  ];

  return (
    <PricingCards
      pricingData={pricingData}
      heading={t("title")}
      subtitle={t("subtitle")}
      monthlyLabel={t("toggleMonthly")}
      annuallyLabel={t("toggleYearly")}
      ctaLabel={t("cta")}
      ctaHref="/billing"
      currency="SAR "
    />
  );
}

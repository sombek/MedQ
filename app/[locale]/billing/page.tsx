import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AppleLogoIcon,
  HandTapIcon,
} from "@phosphor-icons/react/dist/ssr";

import { MoyasarApplePayForm } from "@/components/billing/moyasar-apple-pay-form";
import CTASection from "@/components/shadcn-studio/blocks/cta-section-10/cta-section-10";
import Features from "@/components/shadcn-studio/blocks/features-section-01/features-section-01";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "billing" });
  return { title: t("title") };
}

export default async function BillingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("billing");

  const trustFeatures = [
    {
      icon: <AppleLogoIcon weight="fill" />,
      title: t("trustApplePayTitle"),
      description: t("applePayOnly"),
      cardBorderColor: "ring-primary/40 hover:ring-primary",
      avatarTextColor: "text-primary",
      avatarBgColor: "bg-primary/10",
    },
    {
      icon: <HandTapIcon weight="fill" />,
      title: t("trustManualRenewTitle"),
      description: t("manualRenewNotice"),
      cardBorderColor:
        "ring-green-600/40 hover:ring-green-600 dark:ring-green-400/40 dark:hover:ring-green-400",
      avatarTextColor: "text-green-600 dark:text-green-400",
      avatarBgColor: "bg-green-600/10 dark:bg-green-400/10",
    },
  ];

  return (
    <main>
      <MoyasarApplePayForm />

      <Features
        featuresList={trustFeatures}
        heading={t("trustHeading")}
        subtitle={t("trustSubtitle")}
        ctaLabel=""
      />

      <CTASection
        heading={t("checkoutHeading")}
        description={t("checkoutReady")}
        cta={
          <Button
            size="lg"
            variant="secondary"
            className="shrink-0"
            render={<Link href="/practice" />}
          >
            {t("backToPractice")}
          </Button>
        }
      />
    </main>
  );
}

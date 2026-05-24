import { getTranslations, setRequestLocale } from "next-intl/server";

import { MoyasarApplePayForm } from "@/components/billing/moyasar-apple-pay-form";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("subtitle")}</p>

      <MoyasarApplePayForm />

      <Card>
        <CardContent className="space-y-3 p-4">
          <p className="text-sm">{t("checkoutReady")}</p>
          <Button render={<Link href="/practice" />}>{t("backToPractice")}</Button>
        </CardContent>
      </Card>
    </main>
  );
}


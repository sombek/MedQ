import { getTranslations, setRequestLocale } from "next-intl/server";

import { PracticeGuard } from "@/components/auth/practice-guard";
import { SpecialtyPicker } from "@/components/practice/specialty-picker";
import { AppHeader } from "@/components/layout/app-header";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("practice") };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PracticePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader logoHref="/" />
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        <PracticeGuard>
          <SpecialtyPicker />
        </PracticeGuard>
      </main>
    </div>
  );
}

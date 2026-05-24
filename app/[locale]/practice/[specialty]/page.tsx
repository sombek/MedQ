import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PracticeGuard } from "@/components/auth/practice-guard";
import { SpecialtyHome } from "@/components/practice/specialty-home";
import { AppHeader } from "@/components/layout/app-header";
import { routing } from "@/i18n/routing";
import { SPECIALTIES, type SpecialtyId } from "@/lib/specialties";

type Props = {
  params: Promise<{ locale: string; specialty: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SPECIALTIES.filter((s) => s.enabled).map((s) => ({
      locale,
      specialty: s.id,
    }))
  );
}

export default async function SpecialtyPage({ params }: Props) {
  const { locale, specialty } = await params;
  setRequestLocale(locale);

  const found = SPECIALTIES.find((s) => s.id === specialty && s.enabled);
  if (!found) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader logoHref="/practice" />
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        <PracticeGuard>
          <SpecialtyHome specialty={specialty as SpecialtyId} />
        </PracticeGuard>
      </main>
    </div>
  );
}

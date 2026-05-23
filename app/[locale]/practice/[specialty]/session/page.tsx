import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SessionClient } from "@/components/practice/session-client";
import { UserMenu } from "@/components/auth/user-menu";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SPECIALTIES, type SpecialtyId } from "@/lib/specialties";

type Props = {
  params: Promise<{ locale: string; specialty: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SPECIALTIES.filter((s) => s.enabled).map((s) => ({
      locale,
      specialty: s.id,
    }))
  );
}

export default async function SessionPage({ params, searchParams }: Props) {
  const { locale, specialty } = await params;
  const { mode } = await searchParams;
  setRequestLocale(locale);

  const found = SPECIALTIES.find((s) => s.id === specialty && s.enabled);
  if (!found) notFound();

  const sessionMode = mode === "retry" ? "retry" : "new";

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-background sticky top-0 z-50 h-16 border-b">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href={`/practice/${specialty}`} className="flex items-center">
            <Logo className="gap-3" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        <SessionClient specialty={specialty as SpecialtyId} mode={sessionMode} />
      </main>
    </div>
  );
}

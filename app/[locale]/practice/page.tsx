import { getTranslations, setRequestLocale } from "next-intl/server";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SpecialtyPicker } from "@/components/practice/specialty-picker";
import { ModeToggle } from "@/components/admin/mode-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";
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
      <header className="bg-background sticky top-0 z-50 h-16 border-b">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Logo className="gap-3" />
          </Link>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        <SpecialtyPicker />
      </main>
    </div>
  );
}

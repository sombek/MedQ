import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { ModeToggle } from "@/components/admin/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/auth/user-menu";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("admin") };
}

export default async function AdminLayout({ children, params }: Props) {
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
      <AdminGuard>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
          <AdminNav />
          <div className="py-6">{children}</div>
        </div>
      </AdminGuard>
    </div>
  );
}

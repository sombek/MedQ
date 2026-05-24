import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { AppHeader } from "@/components/layout/app-header";

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
      <AppHeader logoHref="/" />
      <AdminGuard>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
          <AdminNav />
          <div className="py-6">{children}</div>
        </div>
      </AdminGuard>
    </div>
  );
}

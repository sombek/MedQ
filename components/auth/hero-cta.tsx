"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export function HeroCta() {
  const auth = db.useAuth();
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("cta");

  return (
    <Button size="lg" render={<Link href={href} />} nativeButton={false}>
      {label}
    </Button>
  );
}

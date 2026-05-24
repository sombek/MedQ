"use client";

import { useTranslations } from "next-intl";

import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export function HeroCta() {
  const auth = db.useAuth();
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("cta");

  return (
    <Link href={href}>
      <ShimmerButton className="px-8 py-3 text-base">
        {label}
      </ShimmerButton>
    </Link>
  );
}

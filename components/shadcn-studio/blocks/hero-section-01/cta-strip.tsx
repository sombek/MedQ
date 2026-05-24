"use client";

import { useTranslations } from "next-intl";

import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export default function CtaStrip() {
  const auth = db.useAuth();
  const t = useTranslations("ctaStrip");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("button");

  return (
    <section className="bg-primary/5 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t("title")}</h2>
        <Link href={href}>
          <ShimmerButton className="px-8 py-3 text-base">{label}</ShimmerButton>
        </Link>
      </div>
    </section>
  );
}

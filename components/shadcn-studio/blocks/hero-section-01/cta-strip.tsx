"use client";

import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export default function CtaStrip() {
  const auth = db.useAuth();
  const t = useTranslations("ctaStrip");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("button");

  return (
    <section className="py-10 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary px-8 py-10 text-primary-foreground sm:flex-row sm:gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-start">
            <h2 className="text-xl font-bold sm:text-2xl">{t("title")}</h2>
          </div>
          <Link href={href}>
            <Button className="relative flex items-center gap-2 overflow-hidden whitespace-nowrap bg-primary-foreground text-primary hover:bg-primary-foreground/90 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]">
              {label}
              <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

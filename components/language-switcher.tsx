"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = ["en", "ar"] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border p-0.5",
        className
      )}
    >
      {locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            item === "ar" && "[font-family:var(--font-ibm-plex-arabic)]",
            locale === item
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t(item)}
        </Link>
      ))}
    </div>
  );
}

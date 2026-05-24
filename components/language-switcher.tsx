"use client";

import { GlobeHemisphereWestIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = ["en", "ar"] as const;

type Locale = (typeof locales)[number];

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");
  const isFullWidth = className?.includes("w-full");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        isFullWidth && "w-full",
        className
      )}
    >
      {!isFullWidth ? (
        <GlobeHemisphereWestIcon
          className="text-muted-foreground size-4 shrink-0"
          aria-hidden
        />
      ) : null}

      <ToggleGroup
        multiple={false}
        value={[locale]}
        spacing={0}
        variant="outline"
        size="sm"
        onValueChange={(values) => {
          const next = values[0];
          if (next && next !== locale) {
            router.replace(pathname, { locale: next as Locale });
          }
        }}
        className={cn("w-fit", isFullWidth && "w-full flex-1")}
      >
        {locales.map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            aria-label={t(item)}
            className={cn(
              "min-w-14 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
              isFullWidth && "flex-1",
              item === "ar" && "[font-family:var(--font-ibm-plex-arabic)]"
            )}
          >
            {t(item)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

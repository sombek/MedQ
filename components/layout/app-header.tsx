"use client";

import { ListIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { ModeToggle } from "@/components/admin/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/auth/user-menu";
import Logo from "@/components/shadcn-studio/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  logoHref?: string;
  className?: string;
};

export function AppHeader({ logoHref = "/practice", className }: AppHeaderProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const sheetSide = locale === "ar" ? "left" : "right";

  return (
    <header
      className={cn(
        "bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href={logoHref} className="flex shrink-0 items-center">
          <Logo className="gap-2 sm:gap-3" />
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          <LanguageSwitcher />
          <UserMenu />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <UserMenu />
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon-lg" />}>
              <ListIcon />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side={sheetSide} className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle>{t("settings")}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-4 pb-6">
                <div className="flex justify-center">
                  <ModeToggle />
                </div>
                <Separator />
                <LanguageSwitcher className="w-full justify-center" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

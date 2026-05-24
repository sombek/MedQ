"use client";

import { ListIcon } from "@phosphor-icons/react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LanguageSwitcher } from "@/components/language-switcher";
import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type NavigationSection = {
  title: string;
  href: string;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  signInLabel: string;
  className?: string;
};

function NavLink({
  navItem,
  className,
  onNavigate,
}: {
  navItem: NavigationSection;
  className?: string;
  onNavigate?: () => void;
}) {
  if (navItem.href.startsWith("#")) {
    return (
      <a href={navItem.href} className={className} onClick={onNavigate}>
        {navItem.title}
      </a>
    );
  }

  return (
    <Link href={navItem.href} className={className} onClick={onNavigate}>
      {navItem.title}
    </Link>
  );
}

const Header = ({ navigationData, signInLabel, className }: HeaderProps) => {
  const locale = useLocale();
  const sheetSide = locale === "ar" ? "left" : "right";
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={cn(
        "bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 h-16 border-b backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo className="gap-2 sm:gap-3" />
        </Link>

        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList className="flex-wrap justify-start gap-0">
            {navigationData.map((navItem) => (
              <NavigationMenuItem key={navItem.title}>
                {navItem.href.startsWith("#") ? (
                  <NavigationMenuLink
                    href={navItem.href}
                    className="text-muted-foreground hover:text-primary bg-transparent! px-3 py-1.5 text-base! font-medium"
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink
                    render={<Link href={navItem.href} />}
                    className="text-muted-foreground hover:text-primary bg-transparent! px-3 py-1.5 text-base! font-medium"
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="max-sm:hidden" />

          <HeaderAuthActions
            signInLabel={signInLabel}
            className="max-lg:hidden"
          />

          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon-lg" />}>
                <ListIcon />
                <span className="sr-only">Menu</span>
              </SheetTrigger>
              <SheetContent side={sheetSide} className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>MedQ</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {navigationData.map((navItem) => (
                    <NavLink
                      key={navItem.title}
                      navItem={navItem}
                      onNavigate={closeMobile}
                      className="hover:bg-muted rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
                    />
                  ))}
                </nav>
                <Separator className="my-4" />
                <div className="flex flex-col gap-4 px-4 pb-6">
                  <LanguageSwitcher className="w-full justify-center" />
                  <HeaderAuthActions
                    signInLabel={signInLabel}
                    className="w-full justify-center"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

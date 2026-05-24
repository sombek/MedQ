"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { LanguageSwitcher } from "@/components/language-switcher";
import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ListIcon } from "@phosphor-icons/react";

export type NavigationSection = {
  title: string;
  href: string;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  signInLabel: string;
  className?: string;
};

const Header = ({ navigationData, signInLabel, className }: HeaderProps) => {
  return (
    <header
      className={cn("bg-background sticky top-0 z-50 h-16 border-b", className)}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo className="gap-3" />
        </Link>

        <NavigationMenu className="max-md:hidden">
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

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="max-sm:hidden" />

          <HeaderAuthActions signInLabel={signInLabel} className="max-md:hidden" />

          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="icon-lg" />}
              >
                <ListIcon />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
                <div className="px-2 py-2 border-t mt-1">
                  <LanguageSwitcher className="w-full justify-center" />
                </div>
                <div className="px-2 pb-2">
                  <HeaderAuthActions signInLabel={signInLabel} className="w-full" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

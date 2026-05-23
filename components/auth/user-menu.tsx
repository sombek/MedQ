"use client";

import { useTranslations } from "next-intl";
import { SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { db } from "@/lib/db";

export function UserMenu() {
  const t = useTranslations("nav");
  const router = useRouter();
  const auth = db.useAuth();

  if (auth.isLoading || !auth.user) return null;

  const handleSignOut = async () => {
    await db.auth.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon-lg" />}>
        <UserCircleIcon />
        <span className="sr-only">{auth.user.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{auth.user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <SignOutIcon className="me-2 size-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

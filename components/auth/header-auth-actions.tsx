"use client";

import { useTranslations } from "next-intl";

import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

type Props = {
  signInLabel: string;
  className?: string;
};

export function HeaderAuthActions({ signInLabel, className }: Props) {
  const auth = db.useAuth();
  const t = useTranslations("nav");

  if (auth.isLoading) {
    return <Skeleton className="h-10 w-24 rounded-md" />;
  }

  if (auth.user) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button
          size="lg"
          className="max-md:hidden"
          render={<Link href="/practice" />}
          nativeButton={false}
        >
          {t("practice")}
        </Button>
        <UserMenu />
      </div>
    );
  }

  return (
    <Button
      size="lg"
      className={className}
      render={<Link href="/login" />}
      nativeButton={false}
    >
      {signInLabel}
    </Button>
  );
}

"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "@/i18n/navigation";
import { db } from "@/lib/db";

export function PracticeGuard({ children }: { children: ReactNode }) {
  const auth = db.useAuth();
  const router = useRouter();
  const { isLoading: profileLoading, profile } = useProfile();
  const t = useTranslations("practice");

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.replace("/login");
    }
  }, [auth.isLoading, auth.user, router]);

  if (auth.isLoading || (auth.user && profileLoading)) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!auth.user) {
    return null;
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!profile.isActive) {
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="p-8">
          <p className="text-center text-base">{t("accountDisabled")}</p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

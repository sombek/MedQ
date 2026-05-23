"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "@/i18n/navigation";
import { db } from "@/lib/db";

export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <>
      <db.SignedOut>
        <RedirectTo path="/login" />
      </db.SignedOut>
      <db.SignedIn>
        <AdminCheck>{children}</AdminCheck>
      </db.SignedIn>
    </>
  );
}

function AdminCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, profile } = useProfile();
  const t = useTranslations("admin");

  useEffect(() => {
    if (!isLoading && profile && !profile.isAdmin) {
      router.replace("/practice");
    }
  }, [isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Skeleton className="h-32 w-full max-w-2xl" />
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <Card className="m-12">
        <CardContent className="p-8 text-center">{t("notAdmin")}</CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

function RedirectTo({ path }: { path: "/login" }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(path);
  }, [router, path]);
  return null;
}

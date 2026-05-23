"use client";

import { useLocale } from "next-intl";

import { useProfile } from "@/hooks/use-profile";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  if (!profile?.isAdmin) return null;

  const isAdmin = pathname.startsWith("/admin");

  const practiceLabel = locale === "ar" ? "التدريب" : "Practice";
  const adminLabel = locale === "ar" ? "الإدارة" : "Admin";

  return (
    <div className="flex items-center rounded-lg border p-0.5">
      <button
        type="button"
        onClick={() => router.push("/practice")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          !isAdmin
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {practiceLabel}
      </button>
      <button
        type="button"
        onClick={() => router.push("/admin/questions")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isAdmin
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {adminLabel}
      </button>
    </div>
  );
}

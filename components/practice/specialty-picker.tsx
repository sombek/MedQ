"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { SPECIALTIES, type SpecialtyId } from "@/lib/specialties";
import { cn } from "@/lib/utils";

type QuestionRow = { id: string; specialty: string };
type AnswerRow = { question?: { id?: string; specialty?: string } };

export function SpecialtyPicker() {
  const t = useTranslations("practice");
  const locale = useLocale();
  const auth = db.useAuth();
  const userId = auth.user?.id;

  const { data } = db.useQuery(
    userId
      ? {
          questions: { $: { where: { isPublished: true } } },
          answers: { $: { where: { userId } }, question: {} },
        }
      : null
  );

  const statsBySpecialty = useMemo(() => {
    const questions = (data?.questions ?? []) as QuestionRow[];
    const answers = (data?.answers ?? []) as AnswerRow[];

    return Object.fromEntries(
      SPECIALTIES.map((s) => {
        const total = questions.filter((q) => q.specialty === s.id).length;
        const answered = answers.filter(
          (a) => a.question?.specialty === s.id
        ).length;
        return [s.id, { total, answered }];
      })
    ) as Record<SpecialtyId, { total: number; answered: number }>;
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">
        {locale === "ar" ? "اختر التخصص" : "Choose a Specialty"}
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SPECIALTIES.map((s) => {
          const stats = statsBySpecialty[s.id] ?? { total: 0, answered: 0 };
          const label = locale === "ar" ? s.label.ar : s.label.en;

          if (!s.enabled) {
            return (
              <Card key={s.id} className="cursor-not-allowed opacity-50">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold">{label}</h2>
                    <Badge variant="secondary">{t("comingSoon")}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Link key={s.id} href={`/practice/${s.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-6">
                  <h2 className="font-semibold">{label}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t("answered", {
                      answered: stats.answered,
                      total: stats.total,
                    })}
                  </p>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={cn("bg-primary h-full rounded-full transition-all")}
                      style={{
                        width:
                          stats.total > 0
                            ? `${Math.round((stats.answered / stats.total) * 100)}%`
                            : "0%",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

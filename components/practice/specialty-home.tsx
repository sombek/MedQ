"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionReviewModal } from "@/components/practice/question-review-modal";
import { useProfile } from "@/hooks/use-profile";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import type { QuestionRow } from "@/lib/questions";
import { getSpecialtyLabel, type SpecialtyId } from "@/lib/specialties";
import { cn } from "@/lib/utils";

type Props = {
  specialty: SpecialtyId;
};

type AnswerRecord = {
  id: string;
  selectedIndex: number;
  isCorrect: boolean;
  userId: string;
  question?: { id?: string };
};

export function SpecialtyHome({ specialty }: Props) {
  const auth = db.useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const locale = useLocale();
  const t = useTranslations("practice");
  const userId = auth.user?.id;

  const { isLoading, data, error } = db.useQuery(
    userId
      ? {
          questions: {
            $: { where: { isPublished: true, specialty } },
          },
          answers: {
            $: { where: { userId } },
            question: {},
          },
        }
      : null
  );

  const questions = (data?.questions ?? []) as QuestionRow[];
  const answers = (data?.answers ?? []) as AnswerRecord[];

  const answerMap = useMemo(() => {
    const map = new Map<string, { selectedIndex: number; isCorrect: boolean }>();
    for (const a of answers) {
      const qId = a.question?.id;
      if (qId) map.set(qId, { selectedIndex: a.selectedIndex, isCorrect: a.isCorrect });
    }
    return map;
  }, [answers]);

  const answeredCount = useMemo(
    () => questions.filter((q) => answerMap.has(q.id)).length,
    [questions, answerMap]
  );

  const wrongCount = useMemo(
    () =>
      questions.filter((q) => {
        const a = answerMap.get(q.id);
        return a && !a.isCorrect;
      }).length,
    [questions, answerMap]
  );

  const [reviewQuestion, setReviewQuestion] = useState<QuestionRow | null>(null);

  const specialtyLabel = getSpecialtyLabel(specialty, locale);
  const total = questions.length;
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  const handleResetAll = async () => {
    if (!userId) return;
    try {
      const toDelete = answers.filter((a) => a.question?.id !== undefined);
      if (toDelete.length === 0) return;
      await db.transact(toDelete.map((a) => db.tx.answers[a.id].delete()));
      toast.success(t("resetSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  if (profileLoading || isLoading || !profile) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="p-8 text-center">{error.message}</CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <h1 className="text-xl font-semibold">{specialtyLabel}</h1>

          <div className="space-y-1">
            <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              {t("answered", { answered: answeredCount, total })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {answeredCount < total && (
              <Button render={<Link href={`/practice/${specialty}/session?mode=new`} />}>
                {t("startPracticing")}
              </Button>
            )}

            {wrongCount > 0 && (
              <Button variant="outline" render={<Link href={`/practice/${specialty}/session?mode=retry`} />}>
                {t("retryWrong", { count: wrongCount })}
              </Button>
            )}

            {answeredCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="ghost" />}>
                  {t("resetAll")}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("resetConfirmTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("resetConfirmBody", { specialty: specialtyLabel })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAll}>
                      {t("resetAll")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-medium">{t("questions")}</h2>
        <div className="rounded-md border">
          {questions.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">
              {t("noQuestions")}
            </p>
          ) : (
            <ul className="divide-y">
              {questions.map((q) => {
                const ans = answerMap.get(q.id);
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => setReviewQuestion(q)}
                      className="hover:bg-accent flex w-full items-center justify-between gap-4 px-4 py-3 text-start transition-colors"
                    >
                      <span dir="ltr" className="line-clamp-1 flex-1 text-sm">
                        {q.stem}
                      </span>
                      {ans ? (
                        <Badge
                          variant={ans.isCorrect ? "default" : "destructive"}
                          className={cn(
                            "shrink-0",
                            ans.isCorrect &&
                              "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          )}
                        >
                          {ans.isCorrect ? "✓" : "✗"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground shrink-0 text-sm">
                          —
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <QuestionReviewModal
        question={reviewQuestion}
        answerState={
          reviewQuestion ? (answerMap.get(reviewQuestion.id) ?? null) : null
        }
        open={reviewQuestion !== null}
        onClose={() => setReviewQuestion(null)}
      />
    </div>
  );
}

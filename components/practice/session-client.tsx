"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionCard } from "@/components/practice/question-card";
import { useProfile } from "@/hooks/use-profile";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { pickNextQuestion, type QuestionRow } from "@/lib/questions";
import type { SpecialtyId } from "@/lib/specialties";

type Props = {
  specialty: SpecialtyId;
  mode: "new" | "retry";
};

type AnswerRecord = {
  id: string;
  selectedIndex: number;
  isCorrect: boolean;
  userId: string;
  question?: { id?: string; specialty?: string };
};

export function SessionClient({ specialty, mode }: Props) {
  const t = useTranslations("practice");
  const auth = db.useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const userId = auth.user?.id;

  const { isLoading: dataLoading, data, error } = db.useQuery(
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

  const pool = useMemo(() => {
    if (mode === "new") {
      const answeredIds = new Set(
        answers
          .filter((a) => a.question?.specialty === specialty)
          .map((a) => a.question?.id)
          .filter((id): id is string => Boolean(id))
      );
      return questions.filter((q) => !answeredIds.has(q.id));
    } else {
      const wrongIds = new Set(
        answers
          .filter((a) => a.question?.specialty === specialty && !a.isCorrect)
          .map((a) => a.question?.id)
          .filter((id): id is string => Boolean(id))
      );
      return questions.filter((q) => wrongIds.has(q.id));
    }
  }, [questions, answers, specialty, mode]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sessionAnsweredIds, setSessionAnsweredIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    if (dataLoading || profileLoading) return;
    if (currentId) return;
    const remaining = pool.filter((q) => !sessionAnsweredIds.has(q.id));
    const next = pickNextQuestion(remaining, new Set());
    if (next) {
      setCurrentId(next.id);
      setSelectedIndex(null);
      setSubmitted(false);
    }
  }, [dataLoading, profileLoading, currentId, pool, sessionAnsweredIds]);

  if (profileLoading || dataLoading || !profile) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState message={error.message} />;
  }

  if (!profile.isActive) {
    return <EmptyState message={t("accountDisabled")} />;
  }

  const remaining = pool.filter((q) => !sessionAnsweredIds.has(q.id));
  const current = questions.find((q) => q.id === currentId);

  if (!current && remaining.length === 0) {
    const doneMessage = mode === "new" ? t("allAnswered") : t("allRetried");
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <p className="text-lg font-medium">{doneMessage}</p>
          <Button asChild>
            <Link href={`/practice/${specialty}`}>{t("backToSpecialty")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!current) {
    return <LoadingState />;
  }

  const handleSubmit = async () => {
    if (selectedIndex === null || !userId) return;
    setSubmitting(true);
    try {
      const answerId = crypto.randomUUID();
      const isCorrect = selectedIndex === current.correctIndex;
      await db.transact(
        db.tx.answers[answerId]
          .update({
            selectedIndex,
            isCorrect,
            answeredAt: new Date().toISOString(),
            userId,
          })
          .link({ user: userId, question: current.id })
      );
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errorGeneric");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSessionAnsweredIds((prev) => new Set([...prev, current.id]));
    setCurrentId(null);
    setSelectedIndex(null);
    setSubmitted(false);
  };

  return (
    <QuestionCard
      question={current}
      selectedIndex={selectedIndex}
      submitted={submitted}
      onSelect={(i) => !submitted && setSelectedIndex(i)}
      onSubmit={() => !submitting && handleSubmit()}
      onNext={handleNext}
    />
  );
}

function LoadingState() {
  const t = useTranslations("practice");
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="flex flex-col gap-4 p-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <p className="text-muted-foreground text-center text-sm">
          {t("loading")}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="p-8">
        <p className="text-center text-base">{message}</p>
      </CardContent>
    </Card>
  );
}

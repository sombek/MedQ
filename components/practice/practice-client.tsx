"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionCard } from "@/components/practice/question-card";
import { useProfile } from "@/hooks/use-profile";
import { db } from "@/lib/db";
import { pickNextQuestion, type QuestionRow } from "@/lib/questions";

export function PracticeClient() {
  const t = useTranslations("practice");

  return (
    <>
      <db.SignedOut>
        <EmptyState message={t("notSignedIn")} />
      </db.SignedOut>
      <db.SignedIn>
        <SignedInPractice />
      </db.SignedIn>
    </>
  );
}

function SignedInPractice() {
  const t = useTranslations("practice");
  const auth = db.useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  const userId = auth.user?.id;

  const { isLoading: questionsLoading, data, error } = db.useQuery(
    userId
      ? {
          questions: {
            $: { where: { isPublished: true } },
          },
          answers: {
            $: { where: { "user.id": userId } },
            question: {},
          },
        }
      : null
  );

  const questions = (data?.questions ?? []) as QuestionRow[];
  const answeredIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of data?.answers ?? []) {
      const q = (a as { question?: { id?: string } }).question;
      if (q?.id) ids.add(q.id);
    }
    return ids;
  }, [data]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (questionsLoading || profileLoading) return;
    if (currentId) return;
    const next = pickNextQuestion(questions, answeredIds);
    if (next) {
      setCurrentId(next.id);
      setSelectedIndex(null);
      setSubmitted(false);
    }
  }, [questionsLoading, profileLoading, currentId, questions, answeredIds]);

  if (profileLoading || questionsLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState message={error.message} />;
  }

  if (!profile?.isActive) {
    return <EmptyState message={t("accountDisabled")} />;
  }

  const current = questions.find((q) => q.id === currentId);

  if (!current) {
    return <EmptyState message={t("noQuestions")} />;
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
          })
          .link({ user: userId, question: current.id })
      );
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const next = pickNextQuestion(questions, new Set([...answeredIds, current.id]));
    if (next) {
      setCurrentId(next.id);
      setSelectedIndex(null);
      setSubmitted(false);
    } else {
      setCurrentId(null);
    }
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
        <p className="text-muted-foreground text-center text-sm">{t("loading")}</p>
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

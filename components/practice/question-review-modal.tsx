"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { QuestionRow } from "@/lib/questions";

type AnswerState = {
  selectedIndex: number;
  isCorrect: boolean;
} | null;

type Props = {
  question: QuestionRow | null;
  answerState: AnswerState;
  open: boolean;
  onClose: () => void;
};

const CHOICE_LABELS = ["A", "B", "C", "D"];

export function QuestionReviewModal({
  question,
  answerState,
  open,
  onClose,
}: Props) {
  const t = useTranslations("practice");

  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{t("reviewClose")}</DialogTitle>
        </DialogHeader>
        <div dir="ltr" className="flex flex-col gap-6 pt-2">
          <p className="text-base leading-relaxed">{question.stem}</p>

          <div className="flex flex-col gap-3">
            {question.choices.map((choice, index) => {
              const isCorrect = index === question.correctIndex;
              const isUserChoice = answerState?.selectedIndex === index;
              const wasWrong = isUserChoice && !answerState?.isCorrect;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-4 py-3",
                    isCorrect &&
                      "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                    wasWrong &&
                      "border-rose-500 bg-rose-50 dark:bg-rose-950/30",
                    isUserChoice &&
                      !wasWrong &&
                      !isCorrect &&
                      "border-primary bg-primary/5"
                  )}
                >
                  <span className="text-muted-foreground font-mono text-sm">
                    {CHOICE_LABELS[index]}.
                  </span>
                  <span className="flex-1">{choice}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-muted rounded-md p-4">
            <p className="mb-1 text-sm font-medium">{t("explanation")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t("reviewClose")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

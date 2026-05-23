"use client";

import { useTranslations } from "next-intl";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuestionRow } from "@/lib/questions";

type Props = {
  question: QuestionRow;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
};

const CHOICE_LABELS = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  selectedIndex,
  submitted,
  onSelect,
  onSubmit,
  onNext,
}: Props) {
  const t = useTranslations("practice");
  const isCorrect = submitted && selectedIndex === question.correctIndex;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent dir="ltr" className="flex flex-col gap-6 p-6 sm:p-8">
        {submitted && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              isCorrect
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
            )}
          >
            {isCorrect ? (
              <CheckCircleIcon weight="fill" className="size-5" />
            ) : (
              <XCircleIcon weight="fill" className="size-5" />
            )}
            {isCorrect ? t("correct") : t("incorrect")}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-lg leading-relaxed">{question.stem}</p>

        <div className="flex flex-col gap-3">
          {question.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectChoice = index === question.correctIndex;

            const state = !submitted
              ? isSelected
                ? "selected"
                : "idle"
              : isCorrectChoice
                ? "correct"
                : isSelected
                  ? "incorrect"
                  : "idle";

            return (
              <button
                key={index}
                type="button"
                disabled={submitted}
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-start transition-colors",
                  state === "idle" && "hover:bg-accent",
                  state === "selected" && "border-primary bg-primary/5",
                  state === "correct" &&
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                  state === "incorrect" &&
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/30",
                  submitted && "cursor-default"
                )}
              >
                <span className="text-muted-foreground font-mono text-sm">
                  {CHOICE_LABELS[index]}.
                </span>
                <span className="flex-1">{choice}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="bg-muted rounded-md p-4">
            <p className="mb-1 text-sm font-medium">{t("explanation")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {submitted ? (
            <Button size="lg" onClick={onNext}>
              {t("next")}
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={selectedIndex === null}
              onClick={onSubmit}
            >
              {t("submit")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

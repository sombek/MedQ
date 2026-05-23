"use client";

import { useEffect, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  normalizeTags,
  questionFormSchema,
  type QuestionFormValues,
  type QuestionRow,
} from "@/lib/questions";

type Props = {
  trigger: ReactElement;
  initial?: QuestionRow;
  onSubmit: (data: {
    stem: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
    tags: string[];
    isPublished: boolean;
  }) => Promise<void>;
};

const CHOICE_LETTERS = ["A", "B", "C", "D"];

export function QuestionDialog({ trigger, initial, onSubmit }: Props) {
  const t = useTranslations("admin.questions");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema as any),
    defaultValues: {
      stem: initial?.stem ?? "",
      choices: initial?.choices ?? ["", "", "", ""],
      correctIndex: initial?.correctIndex ?? 0,
      explanation: initial?.explanation ?? "",
      tagsInput: initial?.tags?.join(", ") ?? "",
      isPublished: initial?.isPublished ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      stem: initial?.stem ?? "",
      choices: initial?.choices ?? ["", "", "", ""],
      correctIndex: initial?.correctIndex ?? 0,
      explanation: initial?.explanation ?? "",
      tagsInput: initial?.tags?.join(", ") ?? "",
      isPublished: initial?.isPublished ?? true,
    });
  }, [initial, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      stem: values.stem.trim(),
      choices: values.choices.map((c) => c.trim()),
      correctIndex: values.correctIndex,
      explanation: values.explanation.trim(),
      tags: normalizeTags(values.tagsInput),
      isPublished: values.isPublished,
    });
    form.reset();
  });

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? t("edit") : t("add")}</DialogTitle>
        </DialogHeader>

        <form
          dir="ltr"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="stem">{t("fields.stem")}</Label>
            <Textarea id="stem" rows={4} {...form.register("stem")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("fields.choices")}</Label>
            <RadioGroup
              value={String(form.watch("correctIndex"))}
              onValueChange={(v) => form.setValue("correctIndex", Number(v))}
              className="flex flex-col gap-3"
            >
              {CHOICE_LETTERS.map((letter, index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem value={String(index)} id={`choice-${index}`} />
                  <Label htmlFor={`choice-${index}`} className="w-6 font-mono">
                    {letter}
                  </Label>
                  <Input
                    placeholder={t("fields.choice", { letter })}
                    {...form.register(`choices.${index}` as const)}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="explanation">{t("fields.explanation")}</Label>
            <Textarea
              id="explanation"
              rows={4}
              {...form.register("explanation")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">{t("fields.tags")}</Label>
            <Input
              id="tags"
              placeholder="cardiology, acs"
              {...form.register("tagsInput")}
            />
            <p className="text-muted-foreground text-xs">
              {t("fields.tagsHelp")}
            </p>
            <TagPreview value={form.watch("tagsInput")} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isPublished">{t("fields.isPublished")}</Label>
            <Switch
              id="isPublished"
              checked={form.watch("isPublished")}
              onCheckedChange={(v) => form.setValue("isPublished", v)}
            />
          </div>

          {form.formState.errors && (
            <ul className="text-destructive text-xs">
              {form.formState.errors.stem && <li>{t("errors.required")}</li>}
              {form.formState.errors.choices && <li>{t("errors.fourChoices")}</li>}
              {form.formState.errors.correctIndex && <li>{t("errors.correctIndexRange")}</li>}
              {form.formState.errors.tagsInput && <li>{t("errors.tagsRequired")}</li>}
            </ul>
          )}

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TagPreview({ value }: { value: string }) {
  const tags = normalizeTags(value);
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {tags.map((tag) => (
        <span key={tag} className="bg-secondary rounded px-2 py-0.5 font-mono">
          {tag}
        </span>
      ))}
    </div>
  );
}

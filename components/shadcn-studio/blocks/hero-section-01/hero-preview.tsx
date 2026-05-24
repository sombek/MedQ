import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HeroPreviewProps = {
  stats: { value: string; label: string }[];
};

const CHOICE_LABELS = ["A", "B", "C", "D"];

export async function HeroPreview({ stats }: HeroPreviewProps) {
  const t = await getTranslations({ locale: "en", namespace: "hero" });

  const choices = [
    t("previewChoiceA"),
    t("previewChoiceB"),
    t("previewChoiceC"),
    t("previewChoiceD"),
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/20 via-primary/5 to-transparent blur-2xl"
      />
      <div className="relative flex flex-col gap-4">
        <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5">
          <CardContent dir="ltr" className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{t("previewTag")}</Badge>
                <Badge className="border-transparent bg-primary/10 text-primary">
                  {t("previewDifficulty")}
                </Badge>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("previewProgress")}
              </span>
            </div>

            <p className="text-start text-sm leading-relaxed font-medium sm:text-base">
              {t("previewQuestion")}
            </p>

            <div className="flex flex-col gap-2">
              {choices.map((choice, index) => {
                const isSelected = index === 1;
                const isCorrect = index === 1;

                return (
                  <div
                    key={choice}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-start text-sm transition-colors",
                      isSelected && isCorrect
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/60 bg-muted/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                        isSelected && isCorrect
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {CHOICE_LABELS[index]}
                    </span>
                    <span className="flex-1 pt-0.5">{choice}</span>
                    {isSelected && isCorrect && (
                      <CheckCircleIcon
                        weight="fill"
                        className="size-5 shrink-0 text-primary"
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <CheckCircleIcon weight="fill" className="size-5" aria-hidden />
              {t("previewCorrect")}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">{stat.value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ExamIcon,
  ChartLineUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import SpotlightCard from "./spotlight-card";

const steps = [
  { key: "step1", icon: BookOpenIcon, step: 1 },
  { key: "step2", icon: ExamIcon, step: 2 },
  { key: "step3", icon: ChartLineUpIcon, step: 3 },
] as const;

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Desktop connector line */}
          <div
            aria-hidden
            className="absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] hidden h-px bg-border md:block"
          />

          {steps.map(({ key, icon: Icon, step }) => (
            <SpotlightCard key={key} className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon size={24} weight="duotone" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{t(`${key}Title`)}</h3>
              <p className="text-muted-foreground">{t(`${key}Desc`)}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

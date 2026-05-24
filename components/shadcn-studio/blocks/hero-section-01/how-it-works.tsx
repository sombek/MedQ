import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ExamIcon,
  ChartLineUpIcon,
} from "@phosphor-icons/react/dist/ssr";

const steps = [
  { key: "step1", icon: BookOpenIcon },
  { key: "step2", icon: ExamIcon },
  { key: "step3", icon: ChartLineUpIcon },
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

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {steps.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="w-[80vw] flex-shrink-0 snap-center flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center md:w-auto"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                {t(`${key}Title`)}
              </h3>
              <p className="text-muted-foreground">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

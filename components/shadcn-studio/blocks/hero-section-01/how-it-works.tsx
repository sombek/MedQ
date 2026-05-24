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
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center"
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

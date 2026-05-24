import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ChartLineUpIcon,
  LightbulbIcon,
} from "@phosphor-icons/react/dist/ssr";

const cards = [
  { key: "card1", icon: BookOpenIcon },
  { key: "card2", icon: LightbulbIcon },
  { key: "card3", icon: ChartLineUpIcon },
] as const;

export default async function ValueProps() {
  const t = await getTranslations("valueProps");

  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:mb-12 sm:text-4xl">
          {t("title")}
        </h2>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {cards.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="w-[80vw] flex-shrink-0 snap-center flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center md:w-auto"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`${key}Title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

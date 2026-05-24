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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center"
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

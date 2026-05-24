import { getTranslations } from "next-intl/server";

export default async function FaqSection() {
  const t = await getTranslations("landingFaq");
  const items = ["q1", "q2", "q3", "q4"] as const;

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details key={item} className="bg-muted/40 rounded-xl border p-4">
              <summary className="cursor-pointer font-medium">
                {t(`${item}.question`)}
              </summary>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {t(`${item}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


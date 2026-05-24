import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = ["q1", "q2", "q3", "q4"] as const;

export default async function FaqSection() {
  const t = await getTranslations("landingFaq");

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Accordion className="space-y-3">
          {FAQ_KEYS.map((key) => (
            <AccordionItem
              key={key}
              value={key}
              className="rounded-xl border bg-muted/30 px-4 data-[state=open]:bg-muted/50"
            >
              <AccordionTrigger className="py-4 font-medium hover:no-underline">
                {t(`${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
                {t(`${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

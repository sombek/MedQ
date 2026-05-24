import { getTranslations } from "next-intl/server";

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step1Title")}</h3>
            <p className="text-muted-foreground">{t("step1Desc")}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step2Title")}</h3>
            <p className="text-muted-foreground">{t("step2Desc")}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step3Title")}</h3>
            <p className="text-muted-foreground">{t("step3Desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

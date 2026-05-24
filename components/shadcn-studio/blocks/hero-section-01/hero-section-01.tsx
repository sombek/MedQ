import { getTranslations } from "next-intl/server";
import { HeroContent } from "./hero-content";
import { SpotlightEffect } from "./spotlight-effect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HeroSection = async () => {
  const t = await getTranslations("hero");

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
      <SpotlightEffect />
      <HeroContent
        badge={t("badge")}
        subtitle={t("subtitle")}
        titleBefore={t("titleBefore")}
        titleHighlight={t("titleHighlight")}
        titleAfter={t("titleAfter")}
        descriptionLine1={t("descriptionLine1")}
        descriptionLine2={t("descriptionLine2")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Anatomy", desc: "Master human structure with high-yield questions." },
            { title: "Physiology", desc: "Understand body functions and mechanisms." },
            { title: "Pathology", desc: "Learn about diseases and their processes." },
          ].map((specialty, i) => (
            <div key={i} className="spotlight-card group bg-border relative overflow-hidden rounded-xl p-px transition-all duration-300 ease-in-out">
              <Card className="group-hover:bg-card/90 h-full ring-0 transition-all duration-300 ease-in-out group-hover:backdrop-blur-[20px]">
                <CardHeader>
                  <CardTitle>{specialty.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {specialty.desc}
                </CardContent>
              </Card>
              <div className="blob absolute top-0 left-0 size-32 rounded-full bg-primary/20 opacity-0 blur-3xl transition-all duration-300 ease-in-out" />
              <div className="fake-blob absolute top-0 left-0 size-32 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
        alt={t("imageAlt")}
        className="min-h-67 w-full object-cover mt-12"
      />
    </section>
  );
};

export default HeroSection;

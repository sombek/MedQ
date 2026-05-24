import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { HeroCta } from "@/components/auth/hero-cta";

import { HeroPreview } from "./hero-preview";
import { HeroSocialProof } from "./hero-social-proof";

const HeroSection = async () => {
  const t = await getTranslations("hero");

  const stats = [
    { value: t("statQuestions"), label: t("statQuestionsLabel") },
    { value: t("statSpecialties"), label: t("statSpecialtiesLabel") },
    { value: t("statFree"), label: t("statFreeLabel") },
  ];

  return (
    <section className="relative flex min-h-[70dvh] flex-1 flex-col justify-center overflow-x-hidden pt-6 sm:pt-16 lg:pt-24">
      {/* Background layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.15,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content column */}
          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-start">
            <div className="flex flex-col items-center gap-2.5 lg:items-start">
              <Badge className="rounded-full border-transparent bg-linear-to-r from-primary to-primary/70 px-4 py-1.5 text-sm text-primary-foreground shadow-sm">
                {t("badge")}
              </Badge>
              <span className="max-w-md text-sm text-muted-foreground">{t("subtitle")}</span>
            </div>

            <h1 className="text-3xl leading-[1.29167] font-bold text-balance sm:text-4xl lg:text-5xl">
              {t("titleBefore")}
              <br />
              <span className="relative inline-block">
                {t("titleHighlight")}
                <svg
                  width="223"
                  height="12"
                  viewBox="0 0 223 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden rtl:scale-x-[-1]"
                >
                  <path
                    d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
                    stroke="url(#paint0_linear_10365_68643)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_10365_68643"
                      x1="18.8541"
                      y1="3.72033"
                      x2="42.6487"
                      y2="66.6308"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--primary-foreground)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              {t("titleAfter")}
            </h1>

            <p className="max-w-lg text-muted-foreground">
              {t("descriptionLine1")}
              <br />
              {t("descriptionLine2")}
            </p>

            <HeroCta />
            <HeroSocialProof />
          </div>

          <HeroPreview stats={stats} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

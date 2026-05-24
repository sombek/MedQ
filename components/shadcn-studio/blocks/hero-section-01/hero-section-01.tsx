import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { HeroCta } from "@/components/auth/hero-cta";

const HeroSection = async () => {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex min-h-[50dvh] flex-1 flex-col justify-center gap-8 overflow-x-hidden bg-gradient-to-b from-primary/5 to-transparent pt-6 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <div className="bg-muted flex items-center gap-2.5 rounded-full border px-2 py-1 text-sm">
          <Badge>{t("badge")}</Badge>
          <span className="hidden text-muted-foreground sm:inline">{t("subtitle")}</span>
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

        <p className="text-muted-foreground">
          {t("descriptionLine1")}
          <br />
          {t("descriptionLine2")}
        </p>

        <HeroCta />
      </div>
    </section>
  );
};

export default HeroSection;

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header";
import ValueProps from "@/components/shadcn-studio/blocks/hero-section-01/value-props";
import PricingSection from "@/components/shadcn-studio/blocks/hero-section-01/pricing";
import HowItWorks from "@/components/shadcn-studio/blocks/hero-section-01/how-it-works";
import FaqSection from "@/components/shadcn-studio/blocks/hero-section-01/faq";
import CtaStrip from "@/components/shadcn-studio/blocks/hero-section-01/cta-strip";
import Footer from "@/components/shadcn-studio/blocks/hero-section-01/footer";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const tMeta = await getTranslations("metadata");

  const navigationData: NavigationSection[] = [
    { title: t("home"), href: "/" },
    { title: t("howItWorks"), href: "#how-it-works" },
    { title: t("pricing"), href: "#pricing" },
    { title: t("faq"), href: "#faq" },
    { title: t("practice"), href: "/practice" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MedQ",
    description: tMeta("description"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header navigationData={navigationData} signInLabel={t("signIn")} />
      <main className="flex flex-col">
        <HeroSection />
        <ValueProps />
        <HowItWorks />
        <PricingSection />
        <FaqSection />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

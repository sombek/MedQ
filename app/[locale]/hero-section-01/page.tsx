import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header";
import HowItWorks from "@/components/shadcn-studio/blocks/hero-section-01/how-it-works";
import Footer from "@/components/shadcn-studio/blocks/hero-section-01/footer";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HeroSectionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  const navigationData: NavigationSection[] = [
    { title: t("home"), href: "/" },
    { title: t("howItWorks"), href: "#how-it-works" },
    { title: t("practice"), href: "/practice" },
  ];

  return (
    <div className="relative">
      <Header navigationData={navigationData} signInLabel={t("signIn")} />
      <main className="flex flex-col">
        <HeroSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

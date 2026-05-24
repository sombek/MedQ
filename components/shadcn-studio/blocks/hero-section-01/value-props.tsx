import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ChartLineUpIcon,
  LightbulbIcon,
} from "@phosphor-icons/react/dist/ssr";
import Features from "@/components/shadcn-studio/blocks/features-section-01/features-section-01";

export default async function ValueProps() {
  const t = await getTranslations("valueProps");

  const featuresList = [
    {
      title: t("card1Title"),
      description: t("card1Desc"),
      icon: <BookOpenIcon size={24} />,
      cardBorderColor: "hover:border-blue-500/50",
      avatarBgColor: "bg-blue-500/10",
      avatarTextColor: "text-blue-600",
    },
    {
      title: t("card2Title"),
      description: t("card2Desc"),
      icon: <LightbulbIcon size={24} />,
      cardBorderColor: "hover:border-amber-500/50",
      avatarBgColor: "bg-amber-500/10",
      avatarTextColor: "text-amber-600",
    },
    {
      title: t("card3Title"),
      description: t("card3Desc"),
      icon: <ChartLineUpIcon size={24} />,
      cardBorderColor: "hover:border-emerald-500/50",
      avatarBgColor: "bg-emerald-500/10",
      avatarTextColor: "text-emerald-600",
    },
  ];

  return <Features featuresList={featuresList} />;
}

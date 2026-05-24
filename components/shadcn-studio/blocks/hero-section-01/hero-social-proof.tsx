"use client";

import { useTranslations } from "next-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

const avatars = [
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "SA",
    name: "Sarah Ahmed",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    fallback: "MK",
    name: "Mohammed Khan",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    fallback: "LN",
    name: "Layla Nasser",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    fallback: "FH",
    name: "Faisal Hassan",
  },
];

export function HeroSocialProof() {
  const t = useTranslations("hero");

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
      <AvatarGroup>
        {avatars.map((avatar) => (
          <Avatar key={avatar.name} size="sm">
            <AvatarImage src={avatar.src} alt={avatar.name} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <p className="text-sm text-muted-foreground">{t("socialProof")}</p>
    </div>
  );
}

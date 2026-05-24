import { getLocale, getTranslations } from "next-intl/server";

import { LanguageSwitcher } from "@/components/language-switcher";
import Logo from "@/components/shadcn-studio/logo";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const linkClassName =
  "text-sm text-muted-foreground transition-colors hover:text-primary w-fit";

type FooterLinkItem = {
  label: string;
  href: string;
};

function FooterNavLink({
  href,
  label,
  locale,
}: FooterLinkItem & { locale: string }) {
  if (href.startsWith("#")) {
    return (
      <a href={`/${locale}${href}`} className={linkClassName}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {label}
    </Link>
  );
}

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const productLinks: FooterLinkItem[] = [
    { label: tNav("howItWorks"), href: "#how-it-works" },
    { label: tNav("pricing"), href: "#pricing" },
    { label: tNav("faq"), href: "#faq" },
    { label: tNav("practice"), href: "/practice" },
  ];

  const accountLinks: FooterLinkItem[] = [
    { label: tNav("signIn"), href: "/login" },
    { label: t("billing"), href: "/billing" },
  ];

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="w-fit">
              <Logo className="gap-3" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold tracking-tight">
              {t("product")}
            </h4>
            <nav
              aria-label={t("product")}
              className="flex flex-col gap-2.5"
            >
              {productLinks.map((link) => (
                <FooterNavLink key={link.href} {...link} locale={locale} />
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold tracking-tight">
              {t("account")}
            </h4>
            <nav
              aria-label={t("account")}
              className="flex flex-col gap-2.5"
            >
              {accountLinks.map((link) => (
                <FooterNavLink key={link.href} {...link} locale={locale} />
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <p
          className={cn(
            "text-xs text-muted-foreground",
            "text-center sm:text-start"
          )}
        >
          &copy; {new Date().getFullYear()} MedQ. {t("allRightsReserved")}
        </p>
      </div>
    </footer>
  );
}

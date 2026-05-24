import { getTranslations } from "next-intl/server";
import Logo from "@/components/shadcn-studio/logo";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/">
              <Logo className="gap-3" />
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">{t("product")}</h4>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                {t("howItWorks")}
              </Link>
              <Link href="/practice" className="text-sm text-muted-foreground hover:text-primary">
                {t("practice")}
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">{t("legal")}</h4>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                {t("privacy")}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MedQ. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

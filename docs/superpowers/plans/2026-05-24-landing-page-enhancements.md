# Landing Page Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add value props, visual polish, a final CTA strip, and per-locale SEO metadata to the landing page while keeping it lean (no FAQ).

**Architecture:** Create two new server components (`value-props.tsx`, `cta-strip.tsx`), polish existing hero and how-it-works sections, add i18n keys for EN/AR, and wire per-locale `generateMetadata` plus JSON-LD in the page.

**Tech Stack:** Next.js App Router, next-intl, Tailwind CSS, Phosphor Icons, existing Shadcn UI components

---

### Task 1: Add i18n Keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ar.json`

- [ ] **Step 1: Add English translations**

Insert after the `"howItWorks"` block in `messages/en.json`:

```json
  "valueProps": {
    "title": "Why MedQ?",
    "card1Title": "High-Yield Questions",
    "card1Desc": "Practice questions designed to match real exam difficulty.",
    "card2Title": "Detailed Explanations",
    "card2Desc": "Understand the why behind every answer.",
    "card3Title": "Track Your Progress",
    "card3Desc": "See how you improve across specialties over time."
  },
  "ctaStrip": {
    "title": "Ready to start practicing?",
    "button": "Start Practicing"
  },
  "metadata": {
    "title": "MedQ | Medical Question Bank for Students",
    "description": "Master medical concepts and ace your exams. Practice high-yield questions with detailed explanations."
  },
```

- [ ] **Step 2: Add Arabic translations**

Insert after the `"howItWorks"` block in `messages/ar.json`:

```json
  "valueProps": {
    "title": "لماذا MedQ؟",
    "card1Title": "أسئلة عالية الأهمية",
    "card1Desc": "أسئلة مصممة لتطابق صعوبة الامتحانات الحقيقية.",
    "card2Title": "شروحات مفصلة",
    "card2Desc": "افهم السبب وراء كل إجابة.",
    "card3Title": "تتبع تقدمك",
    "card3Desc": "شاهد تحسنك عبر التخصصات بمرور الوقت."
  },
  "ctaStrip": {
    "title": "مستعد للبدء بالتدريب؟",
    "button": "ابدأ التدريب"
  },
  "metadata": {
    "title": "MedQ | بنك أسئلة طبية لطلاب الطب",
    "description": "أتقن المفاهيم الطبية وتفوق في امتحاناتك. تدرب على أسئلة عالية الأهمية مع شروحات مفصلة."
  },
```

- [ ] **Step 3: Commit**

```bash
git add messages/en.json messages/ar.json
git commit -m "i18n: add value props, cta strip, and metadata translations"
```

---

### Task 2: Create Value Props Section

**Files:**
- Create: `components/shadcn-studio/blocks/hero-section-01/value-props.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ChartLineUpIcon,
  LightbulbIcon,
} from "@phosphor-icons/react/dist/ssr";

const cards = [
  { key: "card1", icon: BookOpenIcon },
  { key: "card2", icon: LightbulbIcon },
  { key: "card3", icon: ChartLineUpIcon },
] as const;

export default async function ValueProps() {
  const t = await getTranslations("valueProps");

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`${key}Title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/value-props.tsx
git commit -m "feat: add value props section to landing page"
```

---

### Task 3: Create CTA Strip Section

**Files:**
- Create: `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx`

- [ ] **Step 1: Create the component**

Reuse the auth-aware CTA pattern from `HeroCta`:

```tsx
"use client";

import { useTranslations } from "next-intl";

import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export default function CtaStrip() {
  const auth = db.useAuth();
  const t = useTranslations("ctaStrip");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("button");

  return (
    <section className="bg-primary/5 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t("title")}</h2>
        <Link href={href}>
          <ShimmerButton className="px-8 py-3 text-base">{label}</ShimmerButton>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx
git commit -m "feat: add final cta strip to landing page"
```

---

### Task 4: Polish How It Works with Icons

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx`

- [ ] **Step 1: Replace number circles with icons**

Replace the entire file with:

```tsx
import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ExamIcon,
  ChartLineUpIcon,
} from "@phosphor-icons/react/dist/ssr";

const steps = [
  { key: "step1", icon: BookOpenIcon },
  { key: "step2", icon: ExamIcon },
  { key: "step3", icon: ChartLineUpIcon },
] as const;

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-muted/50 p-6 text-center"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon size={24} weight="duotone" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                {t(`${key}Title`)}
              </h3>
              <p className="text-muted-foreground">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx
git commit -m "feat: add icons to how it works section"
```

---

### Task 5: Add Hero Gradient Background

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx:10`

- [ ] **Step 1: Add subtle gradient to hero section**

Change the `<section>` opening tag class from:

```
className="flex min-h-[60dvh] flex-1 flex-col justify-center gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24"
```

to:

```
className="relative flex min-h-[60dvh] flex-1 flex-col justify-center gap-12 overflow-x-hidden bg-gradient-to-b from-primary/5 to-transparent pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24"
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx
git commit -m "feat: add subtle gradient to hero section"
```

---

### Task 6: Wire Sections + SEO Metadata

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Add generateMetadata, JSON-LD, and new sections**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header";
import ValueProps from "@/components/shadcn-studio/blocks/hero-section-01/value-props";
import HowItWorks from "@/components/shadcn-studio/blocks/hero-section-01/how-it-works";
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
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

- [ ] **Step 2: Remove static metadata from layout (avoid conflict)**

In `app/[locale]/layout.tsx`, change the static `metadata` export to only set a fallback title template:

```tsx
export const metadata: Metadata = {
  title: {
    template: "%s | MedQ",
    default: "MedQ",
  },
};
```

Remove the static `description` field so page-level metadata takes precedence.

- [ ] **Step 3: Commit**

```bash
git add app/\[locale\]/page.tsx app/\[locale\]/layout.tsx
git commit -m "feat: wire landing page sections and add per-locale seo metadata"
```

---

### Task 7: Verify

- [ ] **Step 1: Run dev server and check both locales**

```bash
npm run dev
```

Visit:
- `http://localhost:3000/en` — verify value props, icons, CTA strip, English metadata title
- `http://localhost:3000/ar` — verify RTL layout, Arabic translations, Arabic metadata title

- [ ] **Step 2: Inspect page source for JSON-LD**

View page source on `/en` and confirm `<script type="application/ld+json">` is present with `WebApplication` schema.

- [ ] **Step 3: Final commit if any fixups needed**

```bash
git add -A
git commit -m "fix: landing page enhancement fixups"
```

Only run this if fixups were needed during verification.

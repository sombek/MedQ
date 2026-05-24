# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely redesign the landing page to reflect MedQ's true purpose as a Medical Question Bank for students, replacing the incorrect "Medical Queue" content.

**Architecture:** We will update the existing Shadcn Studio hero block and header, add a new "How It Works" section, and update the internationalization JSON files for both English and Arabic.

**Tech Stack:** Next.js App Router, next-intl, Tailwind CSS, Shadcn UI

---

### Task 1: Update SEO Meta Tags

**Files:**
- Modify: `app/[locale]/layout.tsx:11-14`

- [ ] **Step 1: Update metadata in layout**

```tsx
export const metadata: Metadata = {
  title: "MedQ | Medical Question Bank for Students",
  description: "Master medical concepts and ace your exams with MedQ. Practice high-yield questions with detailed explanations.",
};
```

- [ ] **Step 2: Commit**

```bash
git add app/\[locale\]/layout.tsx
git commit -m "seo: update metadata for medical question bank"
```

### Task 2: Update Translations (English)

**Files:**
- Modify: `messages/en.json`

- [ ] **Step 1: Update English translations**
Replace the `nav` and `hero` sections, and add a new `howItWorks` section.

```json
  "nav": {
    "home": "Home",
    "howItWorks": "How It Works",
    "practice": "Practice",
    "contact": "Contact",
    "signIn": "Sign In",
    "admin": "Admin",
    "signOut": "Sign out"
  },
  "hero": {
    "badge": "For Medical Students",
    "subtitle": "The smartest question bank to test your knowledge, review detailed explanations, and prepare for clinical practice.",
    "titleBefore": "Master Medicine.",
    "titleHighlight": "Ace",
    "titleAfter": "Your Exams.",
    "descriptionLine1": "Practice with high-yield questions designed to challenge your understanding.",
    "descriptionLine2": "Track your progress and master every specialty.",
    "cta": "Start Practicing",
    "imageAlt": "Medical student studying on a laptop"
  },
  "howItWorks": {
    "title": "How MedQ Works",
    "step1Title": "Choose a Specialty",
    "step1Desc": "Select from various medical fields to focus your study session.",
    "step2Title": "Test Your Knowledge",
    "step2Desc": "Answer high-yield questions designed to challenge your understanding.",
    "step3Title": "Learn & Improve",
    "step3Desc": "Review detailed explanations for every answer and track your progress over time."
  },
```

- [ ] **Step 2: Commit**

```bash
git add messages/en.json
git commit -m "i18n: update english landing page translations"
```

### Task 3: Update Translations (Arabic)

**Files:**
- Modify: `messages/ar.json`

- [ ] **Step 1: Update Arabic translations**
Replace the `nav` and `hero` sections, and add a new `howItWorks` section.

```json
  "nav": {
    "home": "الرئيسية",
    "howItWorks": "كيف يعمل",
    "practice": "التدريب",
    "contact": "تواصل معنا",
    "signIn": "تسجيل الدخول",
    "admin": "الإدارة",
    "signOut": "تسجيل الخروج"
  },
  "hero": {
    "badge": "لطلاب الطب",
    "subtitle": "أذكى بنك أسئلة لاختبار معرفتك، ومراجعة الشروحات المفصلة، والتحضير للممارسة السريرية.",
    "titleBefore": "أتقن الطب.",
    "titleHighlight": "تفوق",
    "titleAfter": "في امتحاناتك.",
    "descriptionLine1": "تدرب على أسئلة عالية الأهمية مصممة لتحدي فهمك.",
    "descriptionLine2": "تتبع تقدمك وأتقن كل تخصص.",
    "cta": "ابدأ التدريب",
    "imageAlt": "طالب طب يدرس على حاسوب محمول"
  },
  "howItWorks": {
    "title": "كيف يعمل MedQ",
    "step1Title": "اختر التخصص",
    "step1Desc": "اختر من بين المجالات الطبية المختلفة لتركيز جلسة دراستك.",
    "step2Title": "اختبر معرفتك",
    "step2Desc": "أجب على أسئلة عالية الأهمية مصممة لتحدي فهمك.",
    "step3Title": "تعلم وتحسن",
    "step3Desc": "راجع الشروحات المفصلة لكل إجابة وتتبع تقدمك بمرور الوقت."
  },
```

- [ ] **Step 2: Commit**

```bash
git add messages/ar.json
git commit -m "i18n: update arabic landing page translations"
```

### Task 4: Create How It Works Section

**Files:**
- Create: `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { getTranslations } from "next-intl/server";

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step1Title")}</h3>
            <p className="text-muted-foreground">{t("step1Desc")}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step2Title")}</h3>
            <p className="text-muted-foreground">{t("step2Desc")}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("step3Title")}</h3>
            <p className="text-muted-foreground">{t("step3Desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx
git commit -m "feat: add how it works section"
```

### Task 5: Update Hero Section Image

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx:66-70`

- [ ] **Step 1: Update the image URL in HeroSection**
Change the image to something more appropriate for studying/medical students.

```tsx
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
        alt={t("imageAlt")}
        className="min-h-67 w-full object-cover"
      />
```

- [ ] **Step 2: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx
git commit -m "feat: update hero section image for medical students"
```

### Task 6: Assemble the Pages

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/hero-section-01/page.tsx`

- [ ] **Step 1: Update `app/[locale]/page.tsx`**
Update the navigation data and add the `HowItWorks` component.

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header";
import HowItWorks from "@/components/shadcn-studio/blocks/hero-section-01/how-it-works";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
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
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

- [ ] **Step 2: Update `app/[locale]/hero-section-01/page.tsx`**
Apply the exact same changes as in `app/[locale]/page.tsx` (just keep the component name `HeroSectionPage`).

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header";
import HowItWorks from "@/components/shadcn-studio/blocks/hero-section-01/how-it-works";
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
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\[locale\]/page.tsx app/\[locale\]/hero-section-01/page.tsx
git commit -m "feat: assemble new landing page with how it works section"
```

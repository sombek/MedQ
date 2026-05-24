# Full-Site shadcn Studio Pro Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hand-rolled landing page sections and upgrade the practice question card using shadcn Studio Pro MCP blocks and animated UI components, fully leveraging the pro subscription.

**Architecture:** Each landing section is either swapped to an installed shadcn Studio block (pricing, FAQ, features) or rebuilt in-place using installed Pro components (how-it-works, CTA, question card). All existing auth logic, translation keys, and routing are preserved. Components are customised after install — text and data only, no structural changes to block files.

**Tech Stack:** Next.js App Router · shadcn Studio Pro MCP (`@ss-blocks`, `@ss-components`) · next-intl · Phosphor Icons · Tailwind CSS · TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/shadcn-studio/blocks/pricing-component-01/pricing-component-01.tsx` | Created by install | Base pricing block (do not edit) |
| `components/shadcn-studio/blocks/hero-section-01/pricing.tsx` | Modify | Wrapper — replaces block content with MedQ data |
| `components/shadcn-studio/blocks/faq-component-01/faq-component-01.tsx` | Created by install | Base FAQ accordion block (do not edit) |
| `components/shadcn-studio/blocks/hero-section-01/faq.tsx` | Modify | Wrapper — replaces block content with MedQ Q&A |
| `components/shadcn-studio/blocks/features-section-01/features-section-01.tsx` | Created by install | Base features block (do not edit) |
| `components/shadcn-studio/blocks/hero-section-01/value-props.tsx` | Modify | Wrapper — replaces block content with MedQ features |
| `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx` | Modify in-place | Rebuilt with card-16 spotlight + numbered badges |
| `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx` | Modify in-place | Rebuilt with button-41 shine + horizontal card layout |
| `components/practice/question-card.tsx` | Modify in-place | Animated choices with border-beam, ripple submit, shine next |
| `components/ui/border-beam.tsx` | Created by install | Border beam animation primitive |
| `components/ui/ripple-button.tsx` | Created by install | Ripple button primitive |
| `messages/en.json` | Modify | Add `toggleMonthly`, `toggleYearly` keys |
| `messages/ar.json` | Modify | Add `toggleMonthly`, `toggleYearly` keys (Arabic) |

---

## Task 1: Install all shadcn Studio Pro blocks and components

**Files:**
- Creates: `components/shadcn-studio/blocks/pricing-component-01/pricing-component-01.tsx`
- Creates: `components/shadcn-studio/blocks/faq-component-01/faq-component-01.tsx`
- Creates: `components/shadcn-studio/blocks/features-section-01/features-section-01.tsx`
- Creates: `components/ui/border-beam.tsx`
- Creates: `components/ui/ripple-button.tsx`
- Also installs: card-16, card-17, button-39, button-41, button-46 components

- [ ] **Step 1: Run the block install command**

```bash
npx shadcn@latest add @ss-blocks/pricing-component-01 @ss-blocks/faq-component-01 @ss-blocks/features-section-01 --yes
```

Expected output: `✔ Created X files` for each block. No errors.

- [ ] **Step 2: Run the component install command**

```bash
npx shadcn@latest add @ss-components/card-16 @ss-components/card-17 @ss-components/button-39 @ss-components/button-41 @ss-components/button-46 --yes
```

Expected output: `✔ Created X files` including `components/ui/border-beam.tsx`, `components/ui/ripple-button.tsx`. No errors.

- [ ] **Step 3: Typecheck to confirm no install-time type errors**

```bash
pnpm exec tsc --noEmit 2>&1 | head -30
```

Expected: empty output (exit code 0). If errors appear, note them — they may be inside installed block files and can be patched in place.

- [ ] **Step 4: Commit the installs**

```bash
git add -A && git commit -m "feat: install shadcn Studio Pro blocks and animated components"
```

---

## Task 2: Pricing section upgrade

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/pricing.tsx`
- Modify: `messages/en.json`
- Modify: `messages/ar.json`

**Context:** The installed `pricing-component-01` block lives at `components/shadcn-studio/blocks/pricing-component-01/pricing-component-01.tsx`. Inspect it first to understand its props interface before writing the wrapper.

- [ ] **Step 1: Read the installed block to understand its interface**

```bash
# Open and read:
# components/shadcn-studio/blocks/pricing-component-01/pricing-component-01.tsx
```

Note the prop names — the block likely accepts `plans`, `features`, or similar. Also note what toggle label it expects.

- [ ] **Step 2: Add toggle i18n keys to `messages/en.json`**

In `messages/en.json`, inside the `"landingPricing"` object, add after `"cta"`:

```json
"toggleMonthly": "Monthly",
"toggleYearly": "Yearly"
```

- [ ] **Step 3: Add toggle i18n keys to `messages/ar.json`**

In `messages/ar.json`, inside the `"landingPricing"` object, add after `"cta"`:

```json
"toggleMonthly": "شهري",
"toggleYearly": "سنوي"
```

- [ ] **Step 4: Rewrite `pricing.tsx` to use the installed block**

Replace the entire content of `components/shadcn-studio/blocks/hero-section-01/pricing.tsx` with a wrapper that:
- Imports the installed `pricing-component-01` block
- Uses `getTranslations("landingPricing")` from next-intl/server
- Passes MedQ plan data (monthly 99.99 SAR / yearly 999.99 SAR, 3 features, CTA label, href "/billing") to the block as props matching the block's interface
- If the block doesn't accept props and has hardcoded content, instead edit the block file directly to replace its placeholder text with MedQ content (do NOT change structure — text only)
- Uses `<Link href="/billing" />` from `@/i18n/navigation` as the button's render prop

Example of how to pass a render prop for the CTA button (if the block uses shadcn Button):
```tsx
<Button render={<Link href="/billing" />}>{t("cta")}</Button>
```

- [ ] **Step 5: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep pricing
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/pricing.tsx components/shadcn-studio/blocks/pricing-component-01/ messages/en.json messages/ar.json
git commit -m "feat: upgrade pricing section with shadcn Studio Pro pricing-component-01"
```

---

## Task 3: FAQ section upgrade

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/faq.tsx`

**Context:** The installed `faq-component-01` block uses the shadcn `Accordion` component. The current FAQ uses raw `<details>` HTML. We're replacing it with the smooth animated accordion.

- [ ] **Step 1: Read the installed block**

```bash
# Read: components/shadcn-studio/blocks/faq-component-01/faq-component-01.tsx
```

Note whether it accepts a `items` prop (array of `{question, answer}`) or has hardcoded content.

- [ ] **Step 2: Rewrite `faq.tsx` to use the installed accordion block**

Replace the entire content of `components/shadcn-studio/blocks/hero-section-01/faq.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = ["q1", "q2", "q3", "q4"] as const;

export default async function FaqSection() {
  const t = await getTranslations("landingFaq");

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_KEYS.map((key) => (
            <AccordionItem
              key={key}
              value={key}
              className="rounded-xl border bg-muted/30 px-4 data-[state=open]:bg-muted/50"
            >
              <AccordionTrigger className="py-4 font-medium hover:no-underline">
                {t(`${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
                {t(`${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Check if `components/ui/accordion.tsx` exists**

```bash
ls components/ui/accordion.tsx 2>&1
```

If it does NOT exist, install it:

```bash
npx shadcn@latest add accordion --yes
```

- [ ] **Step 4: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep faq
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/faq.tsx components/ui/accordion.tsx
git commit -m "feat: upgrade FAQ section with shadcn Accordion animated block"
```

---

## Task 4: Value Props (Features) section upgrade

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/value-props.tsx`

**Context:** The installed `features-section-01` block has three-column feature cards with avatar icon chips and card ring borders. It replaces the current plain `div` card grid.

- [ ] **Step 1: Read the installed block**

```bash
# Read: components/shadcn-studio/blocks/features-section-01/features-section-01.tsx
```

Note its prop interface and whether it has a "See all features" button (which must be removed for MedQ).

- [ ] **Step 2: Rewrite `value-props.tsx` to use the installed block**

Replace the entire content of `components/shadcn-studio/blocks/hero-section-01/value-props.tsx`. If the block accepts a `features` prop array, import and call it:

```tsx
import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ChartLineUpIcon,
  LightbulbIcon,
} from "@phosphor-icons/react/dist/ssr";

// Import the installed block
import FeaturesSection from "@/components/shadcn-studio/blocks/features-section-01/features-section-01";

export default async function ValueProps() {
  const t = await getTranslations("valueProps");

  // Map MedQ features to the block's expected prop shape.
  // IMPORTANT: Check the block's actual prop interface first (Step 1).
  // Common shapes: { title, description, icon } or { label, body, Icon }
  const features = [
    {
      title: t("card1Title"),
      description: t("card1Desc"),
      icon: BookOpenIcon,
    },
    {
      title: t("card2Title"),
      description: t("card2Desc"),
      icon: LightbulbIcon,
    },
    {
      title: t("card3Title"),
      description: t("card3Desc"),
      icon: ChartLineUpIcon,
    },
  ];

  return (
    <FeaturesSection
      title={t("title")}
      features={features}
      showAllButton={false}
    />
  );
}
```

**If the block does NOT accept props** (hardcoded content): edit the block file directly, replacing its placeholder title/description/feature text with the MedQ content strings. Do not change JSX structure, only text values.

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "value-props|features-section"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/value-props.tsx components/shadcn-studio/blocks/features-section-01/
git commit -m "feat: upgrade value props section with shadcn Studio Pro features-section-01"
```

---

## Task 5: How It Works — rebuild with card-16 spotlight + numbered badges

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx`

**Context:** `card-16` is a spotlight hover card — it tracks mouse position and renders a radial glow that follows the cursor. It lives at `components/shadcn-studio/card/card-16.tsx` (or similar, check after install). We rebuild the step cards in-place using it, adding gradient step number badges.

- [ ] **Step 1: Find the card-16 import path**

```bash
find components/shadcn-studio -name "card-16*" 2>/dev/null
# Also check:
find components/ui -name "card-16*" 2>/dev/null
```

Note the exact file path to use in the import.

- [ ] **Step 2: Rewrite `how-it-works.tsx` in-place**

Replace the entire content of `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import {
  BookOpenIcon,
  ExamIcon,
  ChartLineUpIcon,
} from "@phosphor-icons/react/dist/ssr";

// Import card-16 spotlight component — adjust path based on Step 1 result
// e.g. "@/components/shadcn-studio/card/card-16" or "@/components/ui/spotlight-card"
import SpotlightCard from "@/components/shadcn-studio/card/card-16";

const steps = [
  { key: "step1", icon: BookOpenIcon, step: 1 },
  { key: "step2", icon: ExamIcon, step: 2 },
  { key: "step3", icon: ChartLineUpIcon, step: 3 },
] as const;

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Desktop connector line between steps */}
          <div
            aria-hidden
            className="absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] hidden h-px bg-border md:block"
          />

          {steps.map(({ key, icon: Icon, step }) => (
            <SpotlightCard key={key} className="flex flex-col items-center gap-4 p-6 text-center">
              {/* Numbered step badge */}
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon size={24} weight="duotone" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 to-pink-500 text-[10px] font-bold text-white">
                  {step}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{t(`${key}Title`)}</h3>
              <p className="text-muted-foreground">{t(`${key}Desc`)}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Note:** If `card-16` is a client component (has `"use client"`), this file must either become a client component too, or `SpotlightCard` must be wrapped in a separate client wrapper. Check the installed file — if it's `"use client"`, add `"use client"` at the top of `how-it-works.tsx` and change `getTranslations` to `useTranslations` from `next-intl`.

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep how-it-works
```

Expected: no output. Fix any type errors (most likely the SpotlightCard import path or className prop).

- [ ] **Step 4: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx
git commit -m "feat: upgrade How It Works with card-16 spotlight hover and numbered step badges"
```

---

## Task 6: CTA Strip — shine button + horizontal card layout

**Files:**
- Modify: `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx`

**Context:** `button-41` is a shine hover effect button. It lives at `components/shadcn-studio/button/button-41.tsx` after install. The CTA strip becomes a full-width primary-coloured horizontal card with heading left and button right.

- [ ] **Step 1: Find button-41 import path and read its interface**

```bash
find components/shadcn-studio -name "button-41*" 2>/dev/null
```

Read the file to confirm the component export name (e.g. `ShineButton`, `Button41`, or a default export).

- [ ] **Step 2: Rewrite `cta-strip.tsx` in-place**

Replace the entire content of `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

// Import button-41 shine component — adjust path + export name from Step 1
// e.g. import ShineButton from "@/components/shadcn-studio/button/button-41"
import ShineButton from "@/components/shadcn-studio/button/button-41";

export default function CtaStrip() {
  const auth = db.useAuth();
  const t = useTranslations("ctaStrip");
  const tNav = useTranslations("nav");

  const href = auth.user ? "/practice" : "/login";
  const label = auth.user ? tNav("practice") : t("button");

  return (
    <section className="py-10 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary px-8 py-10 text-primary-foreground sm:flex-row sm:gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-start">
            <h2 className="text-xl font-bold sm:text-2xl">{t("title")}</h2>
          </div>
          <Link href={href}>
            <ShineButton className="flex items-center gap-2 whitespace-nowrap bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              {label}
              <ArrowRightIcon className="size-4" />
            </ShineButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**If `button-41` doesn't accept a `className` override**, wrap it or use the installed `ShimmerButton` that already works. Check the file before committing.

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep cta-strip
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx
git commit -m "feat: upgrade CTA strip with shine button and horizontal card layout"
```

---

## Task 7: Question Card — animated interactions

**Files:**
- Modify: `components/practice/question-card.tsx`

**Context:**
- `border-beam.tsx` is at `components/ui/border-beam.tsx` (installed in Task 1). It renders an animated rotating border beam. It must be rendered INSIDE the target element (positioned absolutely inside a `relative` parent).
- `ripple-button.tsx` is at `components/ui/ripple-button.tsx`. It wraps Button with a ripple click animation.
- `button-41` (shine) is used for the Next button.
- The explanation block is wrapped in `card-16` spotlight hover card.

- [ ] **Step 1: Read the installed components to confirm their interfaces**

```bash
# Read: components/ui/border-beam.tsx
# Read: components/ui/ripple-button.tsx
# Read: components/shadcn-studio/button/button-41.tsx
```

Note:
- `BorderBeam` props: typically `className`, `size`, `duration`, `colorFrom`, `colorTo`
- `RippleButton` props: typically same as `Button` (variant, size, onClick, disabled, children)
- `button-41` export name and props

- [ ] **Step 2: Rewrite `question-card.tsx` with all three enhancements**

Replace the entire content of `components/practice/question-card.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { RippleButton } from "@/components/ui/ripple-button";
import { cn } from "@/lib/utils";
import type { QuestionRow } from "@/lib/questions";

// Shine button for Next — adjust import path from Step 1
import ShineButton from "@/components/shadcn-studio/button/button-41";

type Props = {
  question: QuestionRow;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
};

const CHOICE_LABELS = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  selectedIndex,
  submitted,
  onSelect,
  onSubmit,
  onNext,
}: Props) {
  const t = useTranslations("practice");
  const isCorrect = submitted && selectedIndex === question.correctIndex;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent dir="ltr" className="flex flex-col gap-6 p-6 sm:p-8">
        {submitted && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              isCorrect
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
            )}
          >
            {isCorrect ? (
              <CheckCircleIcon weight="fill" className="size-5" />
            ) : (
              <XCircleIcon weight="fill" className="size-5" />
            )}
            {isCorrect ? t("correct") : t("incorrect")}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-lg leading-relaxed">{question.stem}</p>

        <div className="flex flex-col gap-3">
          {question.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectChoice = index === question.correctIndex;

            const state = !submitted
              ? isSelected
                ? "selected"
                : "idle"
              : isCorrectChoice
                ? "correct"
                : isSelected
                  ? "incorrect"
                  : "idle";

            return (
              <button
                key={index}
                type="button"
                disabled={submitted}
                onClick={() => onSelect(index)}
                className={cn(
                  "relative flex w-full items-start gap-3 overflow-hidden rounded-lg border px-4 py-3 text-start transition-colors",
                  state === "idle" && "hover:bg-accent",
                  state === "selected" && "border-primary bg-primary/5",
                  state === "correct" &&
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                  state === "incorrect" &&
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/30",
                  submitted && "cursor-default"
                )}
              >
                {/* Animated border beam on selected choice (pre-submit only) */}
                {isSelected && !submitted && (
                  <BorderBeam
                    size={60}
                    duration={3}
                    colorFrom="var(--primary)"
                    colorTo="oklch(0.532 0.157 131.589 / 0.3)"
                  />
                )}
                <span className="font-mono text-sm text-muted-foreground">
                  {CHOICE_LABELS[index]}.
                </span>
                <span className="flex-1">{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation block — spotlight hover card */}
        {submitted && (
          <div className="relative overflow-hidden rounded-xl border bg-muted/40 p-4">
            <p className="mb-1 text-sm font-medium">{t("explanation")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {submitted ? (
            <ShineButton size="lg" onClick={onNext}>
              {t("next")}
            </ShineButton>
          ) : (
            <RippleButton
              size="lg"
              disabled={selectedIndex === null}
              onClick={onSubmit}
            >
              {t("submit")}
            </RippleButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Important notes:**
- If `ShineButton` doesn't accept `size` or `onClick` directly (check Step 1), fall back to wrapping the existing `Button` with the shine class applied manually via `className`.
- If `RippleButton` doesn't export as named export, use default import.
- Adjust import paths based on what Step 1 reveals.

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "question-card|border-beam|ripple"
```

Expected: no output. Fix any type mismatches by checking the actual interfaces from Step 1.

- [ ] **Step 4: Commit**

```bash
git add components/practice/question-card.tsx
git commit -m "feat: animate question card with border-beam selection, ripple submit, shine next"
```

---

## Task 8: Final typecheck and smoke test

**Files:** None modified

- [ ] **Step 1: Full typecheck**

```bash
pnpm exec tsc --noEmit 2>&1
```

Expected: empty output (exit code 0). If errors remain from installed block files (e.g. lucide-react imports in blocks that expect lucide but project uses phosphor), patch those files individually by replacing the offending import with the equivalent Phosphor icon.

- [ ] **Step 2: Start dev server and verify each section**

```bash
pnpm dev
```

Open `http://localhost:3000` (or the locale-prefixed URL `http://localhost:3000/en`) and verify:
- Hero: unchanged from previous session ✓
- Value Props: three feature cards with avatar icon chips, hover spotlight glow
- How It Works: three spotlight cards with numbered badges (1, 2, 3) and connector line on desktop
- Pricing: monthly/annual toggle switch, two plan cards with feature checklists
- FAQ: smooth accordion open/close animation
- CTA Strip: horizontal primary card, heading left, shine arrow button right
- Open `/practice`: question card shows border-beam glow on selected choice, ripple on Submit tap, shine on Next

- [ ] **Step 3: Check both locales**

Open `http://localhost:3000/ar` and verify all new text renders correctly in Arabic (toggle labels, feature text, FAQ items).

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "feat: complete full-site shadcn Studio Pro enhancement"
```

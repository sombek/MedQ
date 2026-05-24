# MedQ Landing Page Enhancements Design

## Overview

Enhance the existing landing page with a light mix of content, visual polish, and SEO improvements — without making the page feel heavy. This builds on the current Hero → How It Works → Footer structure.

## Scope

**In scope:**
- Value props section (3 cards)
- How It Works visual polish (icons)
- Final CTA strip
- Per-locale SEO metadata + JSON-LD structured data
- Hero subtle background gradient

**Out of scope:**
- FAQ section (dropped to keep page lean)
- Hero image (previously removed, stays removed)
- Testimonials, pricing, or blog content

## Page Structure

```
Header
  ↓
Hero (gradient background, existing copy)
  ↓
Value Props (3 icon cards — NEW)
  ↓
How It Works (icons replace numbers — POLISH)
  ↓
Final CTA Strip (one-liner + button — NEW)
  ↓
Footer
```

## Section Details

### 1. Hero — Visual Polish

- Add a subtle radial or linear gradient background behind the hero content
- Keep all existing copy and CTA unchanged
- No image

### 2. Value Props (New Section)

Three compact cards in a row (stack on mobile):

| Card | EN Title | EN Description |
|------|----------|----------------|
| 1 | High-Yield Questions | Practice questions designed to match real exam difficulty. |
| 2 | Detailed Explanations | Understand the why behind every answer. |
| 3 | Track Your Progress | See how you improve across specialties over time. |

- Each card: icon (Phosphor icons, matching existing header style), title, one-line description
- Background: `bg-muted/50 rounded-2xl` (consistent with How It Works cards)
- Placed directly below the hero section

### 3. How It Works — Visual Polish

Replace numbered circles with icons:

| Step | Icon | Existing Copy |
|------|------|---------------|
| 1 | BookOpen or Stethoscope | Choose a Specialty |
| 2 | Exam or Question | Test Your Knowledge |
| 3 | ChartLineUp or Lightbulb | Learn & Improve |

- Keep the same 3-column grid and card styling
- Icons inside the existing circular badge containers

### 4. Final CTA Strip (New Section)

- Full-width band with subtle primary-tinted background
- One headline: "Ready to start practicing?"
- One primary button: "Start Practicing" → `/login` (or `/practice` if authenticated — reuse existing `HeroCta` pattern)
- Placed between How It Works and Footer

### 5. SEO Enhancements

**Per-locale metadata** via `generateMetadata` in `app/[locale]/page.tsx`:

| Locale | Title | Description |
|--------|-------|-------------|
| EN | MedQ \| Medical Question Bank for Students | Master medical concepts and ace your exams. Practice high-yield questions with detailed explanations. |
| AR | MedQ \| بنك أسئلة طبية لطلاب الطب | أتقن المفاهيم الطبية وتفوق في امتحاناتك. تدرب على أسئلة عالية الأهمية مع شروحات مفصلة. |

**JSON-LD structured data** (`WebApplication` schema):
- name, description, applicationCategory: "EducationalApplication"
- Injected via a `<script type="application/ld+json">` in the page or layout

## Internationalization

New translation keys in `messages/en.json` and `messages/ar.json`:

```
valueProps.title
valueProps.card1Title / card1Desc
valueProps.card2Title / card2Desc
valueProps.card3Title / card3Desc
ctaStrip.title
ctaStrip.button
```

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `components/shadcn-studio/blocks/hero-section-01/value-props.tsx` |
| Create | `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx` |
| Modify | `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx` |
| Modify | `components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx` |
| Modify | `app/[locale]/page.tsx` |
| Modify | `messages/en.json` |
| Modify | `messages/ar.json` |

## Success Criteria

- Page at `/en` and `/ar` shows all 5 sections with correct translations
- RTL layout works for Arabic value props and CTA strip
- Page title and meta description are locale-specific
- JSON-LD validates in Google Rich Results Test
- No FAQ section present
- Page remains a single comfortable scroll on mobile

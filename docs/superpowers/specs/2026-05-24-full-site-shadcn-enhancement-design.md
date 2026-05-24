# Full-Site shadcn Studio Pro Enhancement

**Date:** 2026-05-24  
**Scope:** All landing page components — Pricing, FAQ, Value Props, How It Works, CTA Strip, Question Card  
**Tooling:** shadcn Studio Pro MCP (`user-shadcn-studio-mcp`) — blocks + components registry  

---

## Goal

Fully replace all hand-rolled landing page sections with shadcn Studio Pro blocks and animated components, maximizing the pro subscription. Every section gets a block-level upgrade; the practice question card gets animated choice interactions. All content/translations remain unchanged — only the UI layer is upgraded.

---

## Scope Map

### In scope

| File | What changes |
|---|---|
| `components/shadcn-studio/blocks/hero-section-01/pricing.tsx` | Full replacement with `pricing-component-01` block |
| `components/shadcn-studio/blocks/hero-section-01/faq.tsx` | Full replacement with `faq-component-01` block (Accordion) |
| `components/shadcn-studio/blocks/hero-section-01/value-props.tsx` | Full replacement with `features-section-01` block |
| `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx` | Rebuilt using `card-16` (spotlight hover) + numbered step badges |
| `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx` | Upgraded to `cta-section-10` horizontal card style + `button-41` shine |
| `components/practice/question-card.tsx` | Animated choices via `card-16`, ripple submit via `button-39`, shine next via `button-41` |
| `messages/en.json` + `messages/ar.json` | New keys for pricing toggle label only |

### Out of scope

- Header — already solid, no change
- Footer — already solid, no change
- Hero — already upgraded in the previous session
- Any backend / data / auth changes

---

## shadcn Studio Pro Blocks to Install

### Full blocks (via `@ss-blocks`)

| Block ID | Section |
|---|---|
| `pricing-component-01` | Pricing |
| `faq-component-01` | FAQ |
| `features-section-01` | Value Props |

### UI components (via `@ss-components`)

| Component ID | Used in |
|---|---|
| `card-16` | How It Works steps, Question Card explanation |
| `card-17` | How It Works (desktop hover 3D tilt, optional) |
| `button-39` | Question Card submit (ripple) |
| `button-41` | CTA Strip + Question Card next (shine) |
| `button-46` | CTA Strip heartbeat pulse primary CTA |

### Already installed (skip re-install)

- `badge-14` (gradient badge)
- `avatar-13` (avatar group)

---

## Component-Level Design

### 1. Pricing — `pricing-component-01`

**What it adds:** Monthly/annual toggle switch at the top. Two plan cards (Monthly 99.99 SAR, Yearly 999.99 SAR) with feature checklists. A "recommended" highlight ring on the Yearly plan.

**Integration:** The block is installed into a new file at `components/shadcn-studio/blocks/pricing-component-01/pricing-component-01.tsx`. The existing `pricing.tsx` wrapper is updated to import from this new location, passing MedQ plan data (names, prices, features, CTA label, billing link) as props. Toggle state is client-side only (no server state needed). The monthly/annual toggle label is added to `en.json`/`ar.json`.

**Constraint:** The block's internal pricing data must be replaced with the real MedQ plans. The CTA button must use `<Link href="/billing" />` as a render prop to respect next-intl navigation.

---

### 2. FAQ — `faq-component-01`

**What it adds:** shadcn `Accordion` with smooth open/close animation. Single-column, clean header. Replaces the raw `<details>` HTML.

**Integration:** The block is installed into `components/shadcn-studio/blocks/faq-component-01/faq-component-01.tsx`. The existing `faq.tsx` wrapper imports and calls it, passing the 4 Q&A items via the translation keys. No new i18n strings needed.

**Constraint:** The accordion must be `type="single"` with `collapsible` so only one item is open at a time.

---

### 3. Value Props (Features) — `features-section-01`

**What it adds:** Three-column grid with shadcn Avatar icon chips per feature card, card ring borders, and a section header. Cards are richer than the current plain `div`s.

**Integration:** The block is installed into `components/shadcn-studio/blocks/features-section-01/features-section-01.tsx`. The existing `value-props.tsx` wrapper imports it and passes the 3 feature items (title, description, Phosphor icon). The "See all features" button from the block template is removed (not applicable to MedQ). Avatar icon chips use the existing Phosphor icons mapped to the block's avatar slot.

---

### 4. How It Works

**What it adds:** Numbered step badges (1, 2, 3) above each card. `card-16` spotlight glow on hover. A horizontal connector line between steps on desktop. Removes the plain `muted/50` background cards.

**Integration:** No external block is installed. `how-it-works.tsx` is rewritten in-place to use the already-installed `card-16` spotlight card component, with a numbered badge (`badge-14` gradient) for the step number. The connector line is a pure CSS `after:` pseudo-element on the grid container, hidden on mobile.

**Constraint:** The step connector must be decorative only — hidden on mobile, rendered only when all 3 cards are on one row.

---

### 5. CTA Strip — `cta-section-10` style + `button-41`

**What it adds:** Horizontal primary-colored card layout. Heading left, arrow-button right. `button-41` shine hover effect on the CTA button. Replaces the centered text + shimmer button.

**Integration:** `cta-strip.tsx` is rewritten in-place using the `button-41` component (installed). No external block file needed — the layout is simple enough to inline. The auth-aware href logic (practice vs. login) is preserved via `db.useAuth()`.

---

### 6. Question Card — animated interactions

**What it adds:**
- **Selected choice:** `border-beam` animated border ring on the selected option (from `button-54`'s `border-beam.tsx` UI component)
- **Submit button:** `button-39` ripple effect when tapping Submit
- **Next button:** `button-41` shine hover effect
- **Explanation block:** wrapped in `card-16` spotlight hover card

**Integration:** `question-card.tsx` is updated in-place. The existing `<button>` choice elements adopt the `border-beam` component for the selected state. Submit/Next are swapped to `RippleButton` and shine-`Button` respectively. The explanation `<div>` is wrapped in `Card` using `card-16` (spotlight). All existing state logic (`selectedIndex`, `submitted`, `isCorrect`) is unchanged.

**Constraint:** `border-beam` must be conditionally rendered only when `isSelected` is true. It must not animate when `submitted` (to avoid flicker on correct/incorrect states).

---

## i18n Changes

Only one new key pair needed:

```json
// en.json
"landingPricing": {
  "toggleMonthly": "Monthly",
  "toggleYearly": "Yearly"
}

// ar.json
"landingPricing": {
  "toggleMonthly": "شهري",
  "toggleYearly": "سنوي"
}
```

All other text comes from existing keys.

---

## Installation Commands

```bash
# Blocks
npx shadcn@latest add @ss-blocks/pricing-component-01 @ss-blocks/faq-component-01 @ss-blocks/features-section-01

# Components
npx shadcn@latest add @ss-components/card-16 @ss-components/card-17 @ss-components/button-39 @ss-components/button-41 @ss-components/button-46
```

---

## Execution Order

1. Run batch install commands
2. Pricing — wire `pricing-component-01` with MedQ plan data
3. FAQ — wire `faq-component-01` with existing Q&A keys
4. Value Props — wire `features-section-01` with feature data
5. How It Works — rewrite in-place with `card-16` + numbered badges
6. CTA Strip — rewrite in-place with `button-41`
7. Question Card — add `border-beam`, ripple submit, shine next, spotlight explanation

---

## Success Criteria

- All 6 sections visually upgraded with shadcn Studio Pro components
- No regressions in auth-aware behavior (CTA, hero button)
- All text renders correctly in both `en` and `ar` locales
- TypeScript compile passes (`pnpm exec tsc --noEmit`)
- No console errors in dev mode

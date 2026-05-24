# MedQ Mobile View Enhancement Design

## Overview

Fix all identified mobile UX issues on the landing page (`/en`, `/ar`). Desktop layout is unchanged. Changes are scoped to responsive classes and mobile-specific layout behaviour.

## Issues Being Fixed

| Issue | Component |
|-------|-----------|
| Header cramped with 4 items | `header.tsx` |
| Badge pill subtitle overflows on narrow screens | `hero-section-01.tsx` |
| Excessive hero vertical whitespace | `hero-section-01.tsx` |
| Value props and How It Works cards cut off horizontally | `value-props.tsx`, `how-it-works.tsx` |
| CTA strip too tall on mobile | `cta-strip.tsx` |

## Component Designs

### 1. Header

**Mobile (`< md`):** Show Logo + hamburger only. Move language switcher and sign-in into the dropdown menu items.

**Desktop (`≥ md`):** Unchanged.

Changes to `header.tsx`:
- The `md:hidden` mobile row currently shows: language switcher + `HeaderAuthActions` + hamburger. Remove `HeaderAuthActions` and language switcher from the inline row.
- Add the sign-in / auth action and language switcher as items inside `DropdownMenuContent`.

### 2. Hero Section

**Badge pill:** The subtitle span (`text-muted-foreground`) that contains the long subtitle text is hidden on mobile — `<span className="hidden sm:block ...">`. The badge chip alone is shown on mobile.

**Vertical spacing:** Change `min-h-[60dvh]` to `min-h-[50dvh]` and tighten top padding to `pt-6 sm:pt-16`.

**Gap:** Reduce gap from `gap-12` to `gap-8 sm:gap-12`.

### 3. Value Props

**Mobile:** Replace `grid grid-cols-1 gap-8 md:grid-cols-3` with a horizontal scroll snap layout:

```
flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0
```

Each card gets `snap-center flex-shrink-0 w-[80vw] md:w-auto`.

This shows one card at a time with a peek of the next — natural swipe UX.

**Desktop:** Unchanged 3-column grid.

### 4. How It Works

Same scroll snap treatment as Value Props on mobile. Same class changes applied to section grid and individual step cards.

### 5. CTA Strip

Reduce vertical padding on mobile: `py-10 sm:py-16 sm:py-20`. Tighten heading: `text-xl sm:text-2xl sm:text-3xl`.

## Files Modified

| File | Change |
|------|--------|
| `components/shadcn-studio/blocks/hero-section-01/header.tsx` | Simplify mobile nav to logo + hamburger; move auth + lang into dropdown |
| `components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx` | Hide badge subtitle on mobile; reduce padding/min-h |
| `components/shadcn-studio/blocks/hero-section-01/value-props.tsx` | Horizontal scroll snap on mobile |
| `components/shadcn-studio/blocks/hero-section-01/how-it-works.tsx` | Horizontal scroll snap on mobile |
| `components/shadcn-studio/blocks/hero-section-01/cta-strip.tsx` | Tighter padding + heading size on mobile |

## Success Criteria

- Header on mobile shows only Logo + hamburger; language + sign-in accessible inside hamburger menu
- Badge pill does not overflow on 390px viewport
- No large whitespace gap in hero on mobile
- Value props and How It Works cards scroll horizontally on mobile with snap; all cards reachable
- Desktop layout at `≥ md` is pixel-identical to current state
- RTL Arabic layout works correctly on all changed components

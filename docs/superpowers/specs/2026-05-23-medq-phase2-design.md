# MedQ Phase 2 — Design Spec

**Date:** 2026-05-23
**Status:** Approved by user (brainstorming phase)
**Scope:** Specialty-based user journey + admin dual-persona toggle

---

## 1. Goal

Give users a structured entry point into the question bank (specialty picker → specialty home → session) and give admins a seamless toggle between admin and practice modes without changing any auth or permission architecture.

---

## 2. Confirmed product decisions

| Decision | Choice | Rationale |
|---|---|---|
| Specialty storage | Hardcoded constant in `lib/specialties.ts` | No DB needed; enabling a specialty = flip `enabled: true` + add questions |
| Locked specialty UX | Grayed-out cards with "Coming Soon" badge | Communicates roadmap without implying paywall |
| Post-picker destination | Specialty home screen | Shows progress before committing to a session |
| Home screen stats | Progress only (`X of Y answered`) | Simplest, most motivating metric for MVP |
| Retake scope | Both "Retry Wrong" and "Reset All" | Gives users full control |
| Question list item | Stem + ✓/✗/— badge | Enough to identify + review without cluttering |
| Question list interaction | Read-only modal | Separates review from active practice |
| Admin persona switch | Header mode toggle (Practice / Admin) | Always visible to admins, no hunting in menus |

---

## 3. Routes

```
/[locale]/practice                           # Specialty picker (replaces current practice page)
/[locale]/practice/[specialty]               # Specialty home: progress + actions + question list
/[locale]/practice/[specialty]/session       # Active question session (current PracticeClient logic)
```

| Route | Access | Purpose |
|---|---|---|
| `/practice` | Active signed-in user | Grid of specialty cards |
| `/practice/[specialty]` | Active signed-in user | Progress, Start/Retry/Reset, question list |
| `/practice/[specialty]/session` | Active signed-in user | One question at a time with feedback |
| `/admin/questions` | `isAdmin` | Unchanged |
| `/admin/users` | `isAdmin` | Unchanged |

**Specialty slug validation:** If `params.specialty` is not in the `SPECIALTIES` constant or is disabled, redirect to `/practice`.

---

## 4. Data model

### 4.1 Schema change — `questions.specialty`

```ts
// instant.schema.ts
questions: i.entity({
  specialty: i.string().indexed(),   // e.g. "internal-medicine"
  stem: i.string(),
  choices: i.json<string[]>(),
  correctIndex: i.number(),
  explanation: i.string(),
  tags: i.json<string[]>().indexed(),
  isPublished: i.boolean().indexed(),
  createdAt: i.date().indexed(),
}),
```

### 4.2 Specialty constant

```ts
// lib/specialties.ts
export const SPECIALTIES = [
  { id: "internal-medicine", label: { en: "Internal Medicine", ar: "الباطنية" },         enabled: true  },
  { id: "psychiatry",        label: { en: "Psychiatry",        ar: "الطب النفسي" },       enabled: false },
  { id: "surgery",           label: { en: "Surgery",           ar: "الجراحة" },           enabled: false },
  { id: "pediatrics",        label: { en: "Pediatrics",        ar: "طب الأطفال" },        enabled: false },
  { id: "obstetrics",        label: { en: "Obstetrics & Gynecology", ar: "النساء والتوليد" }, enabled: false },
] as const;

export type SpecialtyId = typeof SPECIALTIES[number]["id"];
```

Enabling a new specialty in the future requires only:
1. Flip `enabled: true` in the constant
2. Add published questions with that `specialty` value

### 4.3 Permission change — `answers.delete`

```ts
// instant.perms.ts
answers: {
  allow: {
    delete: "isAdmin || isOwner",   // was: "isAdmin"
  },
  bind: {
    isOwner: "auth.id == data.userId",
    // ...rest unchanged
  }
}
```

This enables the "Reset All" flow where a user deletes their own answers for a specialty.

### 4.4 Migration for existing questions

No scripted migration. The 3 existing questions have no `specialty` field — they will surface as unfiltered until an admin edits each one via the updated question form and sets `specialty = "internal-medicine"`. The specialty home screen filters by `specialty`, so untagged questions won't appear until fixed.

---

## 5. Components

### 5.1 `lib/specialties.ts` (new)
Pure constant file. No imports, no side effects.

### 5.2 `components/practice/specialty-picker.tsx` (new)
Client component. Replaces the current `PracticeClient` as the entry point for `/practice`.

- Queries `questions` (count per specialty) and `answers` (count per user per specialty) to compute progress
- Renders a 2-col grid (1-col mobile) of `SpecialtyCard` sub-components
- Enabled card: full color, clickable, links to `/practice/[specialty]`
- Disabled card: `opacity-50`, "Coming Soon" badge, `pointer-events-none`

### 5.3 `components/practice/specialty-home.tsx` (new)
Client component. Renders `/practice/[specialty]`.

**Header card:**
- Specialty name (translated via `SPECIALTIES` constant + `useLocale()`)
- Progress bar + `X / Y answered` label
- Action buttons (left to right):
  - **Start Practicing** — links to `/practice/[specialty]/session?mode=new` — hidden when all answered
  - **Retry Wrong** — links to `/practice/[specialty]/session?mode=retry` — hidden when no wrong answers
  - **Reset All** — opens `AlertDialog` for confirmation, then `db.transact` deletes all user answers for this specialty

**Question list:**
- Sorted by `createdAt` ascending
- Each row: truncated stem (max 80 chars) + badge
  - `✓ Correct` (green) — user answered, `isCorrect === true`
  - `✗ Wrong` (red) — user answered, `isCorrect === false`
  - `—` (neutral) — not yet answered
- Clicking a row opens `QuestionReviewModal`

### 5.4 `components/practice/question-review-modal.tsx` (new)
Client component. Read-only dialog.

- Full question stem
- 4 choices, each highlighted:
  - User's selected choice: blue border
  - Correct choice: green background
  - If user was wrong: their wrong choice gets red background
- Explanation text below choices
- No submit button — close button only

### 5.5 `components/practice/session-client.tsx` (new, replaces `practice-client.tsx`)
Accepts `specialty: SpecialtyId` and `mode: "new" | "retry"` as props (from URL search params).

- `mode=new` — filters to unanswered questions for the specialty
- `mode=retry` — filters to questions the user answered incorrectly for the specialty
- Session completion:
  - `new`: "You've answered all questions in this specialty!" + "Back to [specialty name]" button
  - `retry`: "All wrong answers retried!" + "Back to [specialty name]" button
- Back button in header → `/practice/[specialty]`

Current `practice-client.tsx` is deleted and replaced by this component.

### 5.6 `components/admin/mode-toggle.tsx` (new)
Client component. Visible only when `profile.isAdmin === true`.

- Two pill buttons: **Practice** and **Admin**
- Active pill: filled/primary style. Inactive: outlined/ghost style.
- Uses `usePathname()` to determine active mode:
  - Any path starting with `/practice` or `/` (root) → Practice active
  - Any path starting with `/admin` → Admin active
- Clicking Practice → `router.push("/practice")`
- Clicking Admin → `router.push("/admin/questions")`
- Slots into the locale layout header, between the language switcher and user menu

### 5.7 Modified components

| Component | Change |
|---|---|
| `app/[locale]/practice/page.tsx` | Render `SpecialtyPicker` instead of old `PracticeClient` |
| `app/[locale]/practice/[specialty]/page.tsx` | New server shell, renders `SpecialtyHome` |
| `app/[locale]/practice/[specialty]/session/page.tsx` | New server shell, renders `SessionClient` |
| `components/admin/question-dialog.tsx` | Add `specialty` select field (enabled specialties only, required, defaults to `"internal-medicine"`) |
| `components/admin/questions-table.tsx` | Add `Specialty` column |
| `components/auth/user-menu.tsx` | Remove Admin link (replaced by mode toggle) |
| `app/[locale]/layout.tsx` | Mount `ModeToggle` in header |

---

## 6. UX details

### 6.1 Specialty picker card layout

```
┌──────────────────────┐  ┌──────────────────────┐
│  Internal Medicine   │  │  Psychiatry           │
│  الباطنية            │  │  الطب النفسي          │
│  ████░░░░░  12/40    │  │  [Coming Soon]        │
│  → Start             │  │                       │
└──────────────────────┘  └──────────────────────┘
```

### 6.2 Specialty home layout

```
┌────────────────────────────────────────────┐
│ Internal Medicine · الباطنية               │
│ ████████░░░░░░░░░░░░  12 of 40 answered   │
│                                            │
│ [Start Practicing]  [Retry Wrong (5)]      │
│                     [Reset All]            │
└────────────────────────────────────────────┘

Questions
─────────────────────────────────────────────
A 58-year-old man with chest pain...   ✓ Correct
Which finding is consistent with...    ✗ Wrong
A patient with type 2 diabetes...      —
```

### 6.3 Mode toggle placement

```
[ MedQ logo ]  ·····  [ Practice | Admin ]  [ EN / عربي ]  [ ⚙ user ]
```

Admins see the toggle on every page. Regular users never see it.

### 6.4 Reset All flow

1. User clicks "Reset All"
2. `AlertDialog`: "This will delete all your answers for Internal Medicine. You'll start from scratch. Are you sure?"
3. On confirm: `db.transact` deletes all `answers` where `userId === auth.user.id` and the linked question has `specialty === "internal-medicine"`
4. Progress bar resets to 0, question list badges all become `—`, Start button reappears

---

## 7. i18n keys needed

```json
// messages/en.json additions
"practice": {
  "comingSoon": "Coming Soon",
  "answered": "{answered} of {total} answered",
  "startPracticing": "Start Practicing",
  "retryWrong": "Retry Wrong ({count})",
  "resetAll": "Reset All",
  "resetConfirmTitle": "Reset all progress?",
  "resetConfirmBody": "This will delete all your answers for {specialty}. You'll start from scratch.",
  "resetSuccess": "Progress reset.",
  "allAnswered": "You've answered all questions in this specialty!",
  "allRetried": "All wrong answers retried!",
  "backToSpecialty": "Back to {specialty}",
  "correct": "Correct",
  "wrong": "Wrong",
  "unanswered": "—",
  "questions": "Questions"
}
```

---

## 8. Out of scope (deferred to Phase 3+)

- Accuracy stats (% correct) on the specialty home or picker
- Weak tag analysis
- Full exam / timed mode
- Multiple simultaneous specialty sessions
- Admin per-specialty analytics
- Question difficulty field
- Search / filter within the question list

---

## 9. Open assumptions

- **`specialty` field is required** on questions going forward. Existing questions without it won't appear in any specialty until an admin edits them.
- **Reset All deletes answers, not sessions** — there is no session entity; deleting answers is the full reset.
- **`session?mode=retry` with zero wrong answers** redirects immediately to `/practice/[specialty]` with a toast: "No wrong answers to retry."
- **Specialty label translation** is handled entirely client-side via the `SPECIALTIES` constant + `useLocale()` — no i18n message keys for specialty names.

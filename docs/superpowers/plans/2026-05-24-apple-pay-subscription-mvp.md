# Apple Pay Subscription MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a minimal manual-renew subscription system using Moyasar Apple Pay, with plan pricing (monthly/yearly), free quota (10 questions/day), and server-authoritative access control.

**Architecture:** Add new billing/usage entities in InstantDB, integrate Moyasar checkout + webhook processing, enforce quota gating in question submission flow, and expose subscription/usage status in UI.

**Tech Stack:** Next.js 16 App Router, InstantDB schema/perms, next-intl, Moyasar API + webhook, shadcn-studio/shadcn MCP UI workflows

---

### Task 1: Add Billing + Usage Entities to Instant Schema

**Files:**
- Modify: `instant.schema.ts`

- [ ] **Step 1: Add `subscriptions`, `payments`, and `dailyUsage` entities**

Add these entities with indexed fields:
- `subscriptions`: `userId`, `planId`, `status`, `startsAt`, `endsAt`, `lastPaymentId`, `createdAt`, `updatedAt`
- `payments`: `userId`, `planId`, `moyasarPaymentId`, `amount`, `currency`, `status`, `paidAt?`, `sourceType?`, `sourceCompany?`, `sourceLast4?`, `tokenId?`, `rawMeta?`, `createdAt`
- `dailyUsage`: `userId`, `dateKey`, `questionsCount`, `updatedAt`

Keep existing entities/links unchanged unless needed for access queries.

- [ ] **Step 2: Push schema**

```bash
npx instant-cli@latest push schema
```

- [ ] **Step 3: Commit**

```bash
git add instant.schema.ts
git commit -m "schema: add subscriptions payments and daily usage entities"
```

---

### Task 2: Add Permissions for New Entities

**Files:**
- Modify: `instant.perms.ts`

- [ ] **Step 1: Add rules for `subscriptions`, `payments`, `dailyUsage`**

Rules intent:
- User can view own subscription/payment/usage rows
- User can create/update only through safe ownership constraints
- Admin can view/update/delete as needed
- Do not allow privilege escalation via user-controlled fields

Suggested policy shape:
- `subscriptions`: user views own, create/update controlled by owner/admin
- `payments`: user views own, writes only for own rows, status updates allowed for trusted backend flow
- `dailyUsage`: user views own, create/update own row for current usage path

- [ ] **Step 2: Push perms**

```bash
npx instant-cli@latest push perms
```

- [ ] **Step 3: Commit**

```bash
git add instant.perms.ts
git commit -m "perms: add access rules for billing and usage entities"
```

---

### Task 3: Add Billing Domain Utilities (Server-Only Logic)

**Files:**
- Create: `lib/billing/plans.ts`
- Create: `lib/billing/subscription.ts`
- Create: `lib/billing/quota.ts`
- Create: `lib/billing/types.ts`

- [ ] **Step 1: Define plans and canonical pricing**

In `plans.ts` define server-side plan map:
- `monthly` => `9999` halalas, duration `1 month`
- `yearly` => `99999` halalas, duration `1 year`
- currency fixed to `SAR`

Provide safe resolver `getPlan(planId)` that throws on invalid IDs.

- [ ] **Step 2: Implement stack renewal math**

In `subscription.ts` implement:
- `computeNewPeriod({ now, currentEndsAt, duration })`
  - stack if active (`currentEndsAt > now`)
  - otherwise start from `now`

- [ ] **Step 3: Implement Riyadh date-key + quota helpers**

In `quota.ts` implement:
- `getRiyadhDateKey(date)` => `YYYY-MM-DD`
- `isQuotaExceeded(count, limit = 10)`

- [ ] **Step 4: Add tests for pure helpers**

Create/extend test files to cover:
- stack vs restart period logic
- Riyadh midnight boundary date key behavior
- quota limit transitions (9/10/11)

- [ ] **Step 5: Commit**

```bash
git add lib/billing/
git commit -m "feat: add billing and quota domain helpers"
```

---

### Task 4: Implement Moyasar Checkout Creation Endpoint

**Files:**
- Create: `app/api/billing/checkout/route.ts`
- Create: `lib/moyasar/client.ts`
- Create: `lib/moyasar/types.ts`
- Modify: `.env.example` (if present)

- [ ] **Step 1: Add Moyasar config and API client**

Required env vars:
- `MOYASAR_SECRET_KEY`
- `MOYASAR_PUBLISHABLE_KEY`
- `MOYASAR_WEBHOOK_SECRET`
- `APP_BASE_URL` (for callback URLs)

Implement minimal API caller for `POST /v1/payments`.

- [ ] **Step 2: Add authenticated checkout route**

`POST /api/billing/checkout`:
- require authenticated user
- parse `planId`
- resolve amount from server plan config
- create Moyasar payment request (`source.type = applepay`)
- include metadata: `userId`, `planId`, `renewalType=manual`
- set `save_card: true` where supported (non-blocking for MVP)
- return payment/session payload needed by frontend

- [ ] **Step 3: Commit**

```bash
git add app/api/billing/checkout/route.ts lib/moyasar/
git commit -m "feat: add moyasar apple pay checkout endpoint"
```

---

### Task 5: Implement Webhook Processing (Idempotent + Authoritative)

**Files:**
- Create: `app/api/billing/webhook/moyasar/route.ts`
- Create: `lib/billing/webhook.ts`

- [ ] **Step 1: Verify webhook authenticity**

Validate incoming webhook with configured secret/signature mechanism from Moyasar docs.
Reject unverified events.

- [ ] **Step 2: Process payment events idempotently**

Handle at least:
- `payment_paid`
- `payment_failed`

Idempotency strategy:
- guard by unique `moyasarPaymentId` in `payments`
- if already processed as paid, no-op

- [ ] **Step 3: Apply subscription mutation on `payment_paid`**

On paid event:
- persist/update `payments` row
- upsert subscription for user:
  - active + stack logic from current `endsAt`
  - set `lastPaymentId`, `updatedAt`

On failed:
- persist failed status only; no subscription grant.

- [ ] **Step 4: Commit**

```bash
git add app/api/billing/webhook/moyasar/route.ts lib/billing/webhook.ts
git commit -m "feat: add idempotent moyasar webhook subscription handling"
```

---

### Task 6: Enforce Question Quota in Ask/Answer Flow

**Files (identify actual path before editing):**
- Modify likely: question submission server action/route under `app/` or `lib/`
- Modify: any current answer creation path using `answers` entity

- [ ] **Step 1: Locate server-authoritative question submit path**

Identify the single write path for answer/question attempts and insert gating there.

- [ ] **Step 2: Add access check before allowing answer creation**

Flow:
- read active subscription for user
- if active => allow
- else read/increment `dailyUsage` for Riyadh date key
- block if already at 10

Return clear structured error for quota exceeded to drive UI paywall.

- [ ] **Step 3: Ensure atomicity/race safety**

For concurrent requests, avoid exceeding limit due to race:
- use transaction/conditional update semantics where possible
- if unavailable, implement conservative retry/compare-check sequence

- [ ] **Step 4: Commit**

```bash
git add <modified files>
git commit -m "feat: enforce free-tier daily question quota with subscription bypass"
```

---

### Task 7: Build Subscription UI (shadcn MCP-first)

**Files (create/modify as needed):**
- Create/Modify: billing/pricing section component(s)
- Modify: relevant page(s) where paywall/usage status appears
- Modify: translation files (`messages/en.json`, `messages/ar.json`)

- [ ] **Step 1: Use shadcn-studio/shadcn MCP workflow for components**

Hard constraint:
- Use shadcn-studio and shadcn MCP generated/composed components.
- Do not improvise ad-hoc component design outside project conventions.

UI requirements:
- monthly/yearly pricing cards
- Apple Pay renew/subscribe CTA
- current plan + expiry display
- free-tier usage indicator (`X/10 today`)
- quota-exceeded paywall prompt

- [ ] **Step 2: Wire UI to checkout endpoint and status data**

Integrate:
- call to `/api/billing/checkout`
- pending/success/failure states
- bilingual copy via `next-intl`

- [ ] **Step 3: Commit**

```bash
git add <ui files> messages/en.json messages/ar.json
git commit -m "feat: add subscription pricing and usage/paywall ui with apple pay checkout"
```

---

### Task 8: Add Tests for Webhook + Quota Integration

**Files:**
- Create/Modify: relevant test files under project test layout

- [ ] **Step 1: Webhook integration tests**

Cover:
- valid `payment_paid` creates/extends subscription
- duplicate paid webhook does not double-extend
- failed payment does not grant access

- [ ] **Step 2: Quota integration tests**

Cover:
- free user blocked on 11th question in same Riyadh day
- subscribed user unlimited
- expired subscription returns to capped behavior

- [ ] **Step 3: Commit**

```bash
git add <test files>
git commit -m "test: cover webhook idempotency and quota enforcement"
```

---

### Task 9: Verification and Manual QA

- [ ] **Step 1: Run checks**

```bash
pnpm lint
pnpm test
```

- [ ] **Step 2: Manual QA checklist**

- free user can submit 10 questions, 11th blocked
- Apple Pay checkout success grants unlimited
- renewal before expiry stacks correctly
- expiry returns to free cap
- webhook replay no-ops safely
- EN/AR copy displays correctly

- [ ] **Step 3: Final fixups commit (if needed)**

```bash
git add -A
git commit -m "fix: billing mvp verification fixups"
```

Only run if fixups were needed.

---

## Notes

- Keep this MVP manual-renew only; do not build auto-recurring scheduler in this plan.
- Persist token-related fields if Moyasar returns them; do not require token presence for success.
- Backend webhook confirmation is the only authority for granting paid access.

# MedQ Apple Pay Subscription MVP Design

## Overview

Add a minimal subscription system to MedQ using Moyasar Apple Pay, with manual renewal only.
The goal is to keep implementation simple while supporting paid unlimited usage and a free-tier cap.

## Decisions Locked During Brainstorming

- Renewal model: **manual renew**
- Renewal behavior: **stack** (`endsAt` extends from current active `endsAt`)
- Free quota reset timezone: **Asia/Riyadh**
- MVP payment method: **Apple Pay**
- MVP approach: **direct Apple Pay payment per renewal** (no auto-recurring engine yet)

## Scope

**In scope:**
- Monthly and yearly paid plans
- Manual Apple Pay checkout with Moyasar
- Webhook-based subscription activation/extension
- Free-tier cap: 10 questions/day
- Active subscription: unlimited questions
- Token-related fields persisted if returned (future-proofing only)

**Out of scope (MVP):**
- Auto-recurring renewals
- Dunning/retry logic for failed renewals
- Mid-cycle proration, downgrades, upgrade credits
- Multi-gateway billing abstraction

## Pricing

- Monthly: `99.99 SAR` (`9999` halalas)
- Yearly: `999.99 SAR` (`99999` halalas)

Server owns plan-to-amount mapping. Client never supplies trusted amount.

## Architecture

### Billing Model

Each renewal is a new Apple Pay payment.
On confirmed successful payment, backend activates or extends subscription:

- If no active subscription: `startsAt = now`, `endsAt = now + planDuration`
- If active subscription: `startsAt` unchanged, `endsAt = currentEndsAt + planDuration`

### Access Model

- If user has active subscription (`now < endsAt`): unlimited questions
- Otherwise: maximum 10 questions/day
- Free quota day key is computed in `Asia/Riyadh`

## Data Model Changes (InstantDB)

Add entities:

### `subscriptions`
- `userId: string` (indexed)
- `planId: string` (`monthly` | `yearly`)
- `status: string` (`active` | `expired`)
- `startsAt: date` (indexed)
- `endsAt: date` (indexed)
- `lastPaymentId: string` (indexed)
- `createdAt: date` (indexed)
- `updatedAt: date` (indexed)

### `payments`
- `userId: string` (indexed)
- `planId: string` (indexed)
- `moyasarPaymentId: string` (unique/indexed)
- `amount: number`
- `currency: string`
- `status: string` (`paid` | `failed` | `pending`)
- `paidAt: date` (optional, indexed)
- `sourceType: string` (optional; e.g. `applepay`)
- `sourceCompany: string` (optional)
- `sourceLast4: string` (optional)
- `tokenId: string` (optional)
- `rawMeta: json` (optional)
- `createdAt: date` (indexed)

### `dailyUsage`
- `userId: string` (indexed)
- `dateKey: string` (indexed; `YYYY-MM-DD` in Riyadh timezone)
- `questionsCount: number`
- `updatedAt: date`

Suggested uniqueness constraints at app logic level:
- `payments.moyasarPaymentId` unique
- (`userId`, `dateKey`) unique for `dailyUsage`

## Component and Data Flow

### UI

- Pricing section with two plans (monthly/yearly)
- CTA button: `Subscribe with Apple Pay` / `Renew with Apple Pay`
- Usage banner:
  - Free users: `X/10 used today`
  - Active users: `Unlimited until <date>`
- Paywall prompt when free user reaches 10/day

### Server Actions / Routes

1. `createCheckout(planId)`
   - Validate authenticated user
   - Validate `planId` against server config
   - Resolve amount/currency server-side
   - Create Moyasar payment with Apple Pay source
   - Include metadata: `userId`, `planId`, `renewalType=manual`

2. `moyasarWebhook`
   - Verify webhook authenticity
   - Handle at least `payment_paid` and `payment_failed`
   - Process idempotently by `moyasarPaymentId`
   - On `payment_paid`, create/extend subscription using stack rule

3. `canAskQuestion(userId, now)`
   - Check active subscription first
   - Else check/increment `dailyUsage` for Riyadh dateKey
   - Deny at >10

## Moyasar Integration Notes (MVP)

- Use Apple Pay flow supported by Moyasar for web checkout.
- Webhook event is authoritative for subscription mutation.
- Request `save_card: true` where applicable, but token return is optional.
- Persist token details if present; do not block success if token is absent.

## Error Handling and Reliability

- **Idempotency:** repeated webhook deliveries must not double-extend subscription.
- **Trust boundary:** frontend callback does not grant access; webhook does.
- **Integrity:** server computes amount by plan ID; reject mismatches.
- **Failure path:** failed/cancelled payment never mutates subscription.
- **Retry safety:** webhook handler remains safe under retries.

## Security

- Validate webhook signature/secret before processing.
- Store amounts in integer halalas only.
- Enforce question limits server-side at question submission endpoint.
- Avoid storing sensitive card payloads; keep minimal metadata.

## Testing Strategy

### Unit Tests
- `computeNewEndAt` with:
  - no previous subscription
  - expired subscription
  - active subscription (stack behavior)
- Riyadh day-key generation around midnight boundaries
- `canAskQuestion` for active and free users

### Integration Tests
- `payment_paid` webhook creates subscription
- duplicate `payment_paid` webhook is idempotent
- early renewal stacks from existing `endsAt`
- expiry returns user to 10/day logic

### E2E Smoke
- Free user reaches cap at 10/day and is blocked on next question
- Successful Apple Pay purchase grants unlimited access
- After expiration, free cap applies again

## Implementation Constraints

- Use existing code patterns in this repository (`InstantDB`, `next-intl`, current auth/profile flow).
- Keep changes surgical; no unrelated refactors.
- For UI components, use **shadcn-studio and shadcn MCP-driven workflows**; do not invent ad-hoc component patterns outside project conventions.

## Success Criteria

- User without active subscription is limited to 10 questions/day (Riyadh reset).
- User can purchase monthly/yearly via Apple Pay and gains immediate unlimited access after confirmed payment.
- Renewing while active extends from current `endsAt` (stack behavior).
- Replayed webhook events never duplicate payment effects.
- Subscription expiry automatically returns user to free quota behavior.

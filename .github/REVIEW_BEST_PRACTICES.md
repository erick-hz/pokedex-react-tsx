# Review Best Practices

Use this document as the source of truth for code reviews in this repository.

## Review Priorities (highest first)

1. Correctness and regressions

- Verify behavior against expected user flows.
- Flag edge cases, null/undefined handling, and race conditions.

2. Security and safety

- Reject unsafe input handling.
- Reject secret leakage in code, logs, or tests.

3. Performance and scalability

- Identify unnecessary renders, expensive loops in UI paths, and avoidable network calls.
- Prefer memoization only when measurable and justified.

4. Maintainability

- Keep logic modular and naming clear.
- Avoid duplicated business rules.

5. Testing

- Require tests for non-trivial behavior changes.
- Ensure existing tests still validate key paths.

## React + TypeScript Rules

- Keep components focused and small; move heavy logic to hooks or utilities.
- Prefer explicit types for public interfaces and exported functions.
- Do not use `any` unless unavoidable and documented.
- Prefer strict TypeScript settings for app code (`strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`) unless there is a documented exception.
- Validate route/search params and external API data.
- Keep side effects inside hooks with correct dependency arrays.
- Avoid synchronous `setState` calls inside `useEffect` unless a strong synchronization reason is documented.
- Avoid state derived from props unless there is a clear synchronization strategy.

## TanStack Router Rules

- Keep route registration centralized and typed.
- Every route that consumes search params must define and test `validateSearch` behavior.
- Reject changes that read unvalidated search params directly from URL state.
- For route-level navigation behavior, require tests for invalid/missing params and fallback handling.

## TanStack Query Rules

- Query keys must be deterministic and include all cache-relevant dimensions (for example, language and pokemon name).
- Do not duplicate `staleTime`/`gcTime` values in many places without constants or shared helpers.
- For prefetch flows, verify cancellation and overfetch risk (especially large fan-out patterns).
- Require explicit handling for loading/empty/error states in consuming UI.
- Prefer invalidation and cache updates over ad-hoc refetch patterns when state changes.

## API and Data Rules

- Handle loading, empty, success, and error states explicitly.
- Surface user-friendly errors; do not swallow exceptions silently.
- Keep query keys stable and deterministic.
- Do not change API contracts without updating call sites and tests.

## Internationalization and Accessibility

- New user-facing text must be translatable.
- Ensure semantic HTML and keyboard-accessible interactions.

## Tooling and Package Rules

- `npm run lint`, `npm run test`, and `npm run build` must pass before merge.
- Keep Vite and Vitest config types aligned (for example, avoid using a `test` block with an incompatible Vite-only config type).
- Pre-commit hooks should enforce formatting and avoid introducing lint/build regressions.
- Keep dependency updates focused and justified; call out breaking changes in PR description.

## Documentation Rules

- README must document architecture and usage of TanStack Router and TanStack Query, not only list them in the stack.
- Document cache behavior (persistence, stale times, invalidation strategy) and route validation conventions.
- Non-trivial behavior changes require docs updates alongside tests.

## Review Output Format

For every finding, use this structure:

- Severity: Critical | High | Medium | Low
- File and location
- Risk summary
- Why it matters
- Minimal fix recommendation

If no issues are found, state: "No findings." and list residual risks or missing tests.

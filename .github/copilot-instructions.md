# Copilot Review Instructions

When reviewing pull requests in this repository, apply the standards in `.github/REVIEW_BEST_PRACTICES.md`.

## Primary Goal

Find defects, regressions, and missing tests before style-level feedback.

## Review Behavior

- Prioritize findings by severity: Critical, High, Medium, Low.
- Focus first on correctness, security, performance, and API contract changes.
- Highlight likely user-visible regressions.
- Keep feedback actionable and specific.
- Avoid low-value style comments unless they affect readability or maintainability.

## Repository Context

- Stack: React + TypeScript + Vite.
- Validate route/search param handling and API integration points.
- Pay attention to hooks dependencies and render performance.
- Require tests for non-trivial behavior changes.

## Output Requirements

For each finding include:

- Severity
- File path and line reference
- Problem
- Impact
- Recommended fix

If no findings exist, return "No findings" and mention remaining risks or test coverage gaps.

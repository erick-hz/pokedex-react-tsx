# Pokedex React + TypeScript

Pokedex web app built with React, TypeScript, and Vite, using PokeAPI as the data source.

## Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- i18next + react-i18next
- ESLint

## Requirements

- Node.js 20+
- npm 10+

## Quick Start

```bash
npm install
npm run dev
```

App URL: http://localhost:5173

## Scripts

- npm run dev: start development server
- npm run build: production build
- npm run preview: preview build
- npm run test: run test suite once
- npm run test:watch: run tests in watch mode
- npm run test:coverage: run tests with coverage report
- npm run lint: run ESLint
- npm run lint:fix: run ESLint with auto-fixes
- npm run format: format files with Prettier
- npm run format:check: verify formatting without changing files

## Project Structure

```text
src/
  app/        # App bootstrap, router, routes, and global styles
  features/   # Feature modules (pokemon, public-apis, theme-toggle, language-switcher)
  shared/     # Shared UI components, config, and locales
```

## TanStack Router Conventions

- Route registration is centralized in src/app/router.tsx.
- Search params are validated through dedicated validators in src/app/routes/searchValidators.ts.
- Route pages should consume validated search state and avoid reading raw URL params directly.
- New routes that depend on search params should include validator tests.

## TanStack Query Conventions

- Query keys are defined by feature modules and must include all cache dimensions (for example language and pokemon name).
- Global query defaults are configured in src/app/main.tsx.
- Query cache is persisted in localStorage through PersistQueryClientProvider.
- Current defaults:
  - staleTime: 5 minutes for core pokemon queries
  - gcTime: 30 minutes for core pokemon queries
  - retry: 1
  - refetchOnWindowFocus: false
- Feature-level prefetching runs in src/app/providers/AppPrefetch.tsx.
- UI components should always account for loading, empty, success, and error states when consuming queries.

## Quality Gates

- Required before opening a PR: npm run lint, npm run test, npm run build.
- Pre-commit currently formats staged files through lint-staged.
- Review standards are defined in .github/REVIEW_BEST_PRACTICES.md and loaded by .github/copilot-instructions.md.

## Contributing

If you want to contribute, open your PR using this template:

docs/PULL_REQUEST_TEMPLATE.md

Please complete the checklist and run `npm run lint`, `npm run test`, and `npm run build` before submitting.

For style consistency across the team:

- Use the recommended VS Code extensions from `.vscode/extensions.json`
- Keep `editor.formatOnSave` enabled
- Run `npm run format:check` before opening a PR

## External API

- https://pokeapi.co/
- https://api.github.com/repos/erick-hz/pokedex-react-tsx

## License

MIT

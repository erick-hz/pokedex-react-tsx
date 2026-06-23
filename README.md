# Pokedex React + TypeScript

A modern web application to explore Pokemon using the public PokeAPI. This project is built with React, TypeScript, and Vite, with a strong focus on maintainability, scalability, and frontend engineering best practices.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Query
- i18next + react-i18next
- ESLint

## Architecture

The project follows a layered, feature-first architecture:

- src/app: global app composition (entry point, global styles, bootstrap).
- src/features: business modules isolated by functionality.
- src/shared: reusable building blocks (base UI, configuration, shared resources).

### Current Structure

```text
src/                              # Main source code
  app/                            # Global app composition
    App.tsx                       # Root UI component
    main.tsx                      # Entry point and DOM mounting
    styles/                       # Global/base styles
  features/                       # Business modules by functionality
    language-switcher/            # Language switching feature
    theme-toggle/                 # Theme toggling feature
    pokemon/                      # Main Pokedex feature
      api/                        # External service calls (PokeAPI)
      model/                      # Hooks, types, and state logic
      ui/                         # Feature UI components
  shared/                         # Shared reusable resources
    config/                       # Shared global configuration
    locales/                      # Translation files
    ui/                           # Reusable UI components
```

## Import Aliases

To avoid long relative paths, the project uses path aliases:

- @/_ -> src/_
- @app/_ -> src/app/_
- @features/_ -> src/features/_
- @shared/_ -> src/shared/_

Example:

```ts
import { PokemonList } from "@features/pokemon";
import { SectionCard } from "@shared/ui";
```

## Quick Start

### Requirements

- Node.js 20+
- npm 10+

### Install Dependencies

```bash
npm install
```

### Run In Development

```bash
npm run dev
```

Application URL: http://localhost:5173

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Engineering Best Practices

### 1) Separation Of Concerns

- Do not mix UI rendering with data-fetching logic.
- Keep HTTP/API calls inside api/.
- Keep query hooks and state logic inside model/.
- Keep ui/ components focused on presentation.

### 2) Strong Typing

- Define data contracts in model/types.ts.
- Avoid any; prefer explicit types and interfaces.
- Keep API responses typed to reduce runtime issues.

### 3) Public API Per Feature

- Export only what other modules need through index.ts.
- Avoid deep imports from outside the feature boundary.

### 4) Import Conventions

- Prefer aliases (@features, @shared) over deep relative imports.
- Keep imports ordered: external libraries, internal aliases, local relatives.

### 5) Continuous Quality

- Run npm run lint before every commit.
- Run npm run build to validate typing and production readiness.
- Remove debug-only console logs from final code.

### 6) Scalability Pattern

When adding a new feature:

1. Create a folder in src/features/new-feature.
2. Split code into ui, model, and api when needed.
3. Expose the feature public API through index.ts.
4. Consume the feature from app or other features through aliases.

## Data And State Management

- Server state: TanStack Query for caching, retries, and loading/error states.
- Client/UI state: local React state and hooks.
- i18n: configured in shared/config/i18n.ts with locale files in shared/locales.

## Available Scripts

- npm run dev: start development server.
- npm run build: run TypeScript build and Vite production bundle.
- npm run preview: preview production build locally.
- npm run lint: run ESLint checks.

## Contributing

If you want to contribute:

1. Create a working branch (feature/... or fix/...).
2. Keep commits small and descriptive.
3. Run lint and build before opening a PR.
4. Document architecture-impacting changes in this README.

## External API

This project consumes data from:

- https://pokeapi.co/

## License

MIT

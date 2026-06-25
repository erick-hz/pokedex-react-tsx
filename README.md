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

## Contributing

If you want to contribute, open your PR using this template:

docs/PULL_REQUEST_TEMPLATE.md

Please complete the checklist and run `npm run lint` and `npm run build` before submitting.

For style consistency across the team:

- Use the recommended VS Code extensions from `.vscode/extensions.json`
- Keep `editor.formatOnSave` enabled
- Run `npm run format:check` before opening a PR

## External API

- https://pokeapi.co/
- https://api.github.com/repos/erick-hz/pokedex-react-tsx

## License

MIT

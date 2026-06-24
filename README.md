# Pokedex React + TypeScript

Pokedex web app built with React, TypeScript, and Vite, using PokeAPI as the data source.

## Stack

- React 19
- TypeScript
- Vite
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

## Project Structure

```text
src/
  app/        # App bootstrap and global styles
  features/   # Feature modules (pokemon, theme-toggle, language-switcher)
  shared/     # Shared UI, config, and locales
```

## Contributing

If you want to contribute, open your PR using this template:

docs/PULL_REQUEST_TEMPLATE.md

Please complete the checklist and run `npm run lint` and `npm run build` before submitting.

## External API

- https://pokeapi.co/
- https://api.github.com/repos/erick-hz/pokedex-react-tsx

## License

MIT

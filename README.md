# WeTEE Website (Vue 3 + Vite)

The WeTEE frontend website, built with Vue 3, TypeScript and Vite.

## Requirements

- Node.js (LTS recommended)
- npm

## Quick start

```sh
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Scripts

- **dev**: start local development server

```sh
npm run dev
```

- **build**: type-check and build for production

```sh
npm run build
```

- **preview**: preview the production build locally

```sh
npm run preview
```

- **lint**: run ESLint

```sh
npm run lint
```

- **test:unit**: run unit tests (Vitest)

```sh
npm run test:unit
```

## Project structure

- `src/`: app source code
  - `pages/`: route pages (e.g. `src/pages/Chain/Pods.vue`)
  - `components/`: shared UI components
  - `router/`: Vue Router routes
  - `apis/`: chain / backend API wrappers (e.g. `src/apis/main-chain.ts`)
  - `providers/`: chain providers (Ink / Substrate, etc.)
  - `assets/`: global styles and assets
- `public/`: static assets served as-is
  - `public/contract/`: contract ABIs (`cloud.json`, `subnet.json`)
  - `public/config/`: runtime configs

## Chain / contracts

This site talks to the WeTEE contracts via the ABI files in `public/contract/` and the chain provider in `src/providers/`.

If you update contract addresses or endpoints, check:

- `src/config.ts` (contract addresses)
- `src/plugins/chain.ts` (chain endpoints / current node selection)
- `public/contract/*.json` (ABIs)

## IDE setup

Recommended:

- VS Code
- Volar (`Vue.volar`)

## Docker (optional)

There are helper scripts in `hacks/` for building/running via Docker:

- `hacks/build.sh`
- `hacks/docker.sh`

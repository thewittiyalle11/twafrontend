# TWA Fashion Ecommerce

This repository contains a monorepo for the TWA fashion ecommerce storefront.

## Prerequisites

- Node.js 18 or newer
- pnpm installed globally

## Install dependencies

From the repository root:

```bash
pnpm install
```

## Run the storefront locally

From the repository root:

```bash
pnpm dev:storefront
```

This launches the storefront on `http://localhost:3000`.

## Mock API

The storefront uses MSW for mock APIs in development. The mock service worker file is served from `apps/storefront/public/mockServiceWorker.js`.

If you need to disable the mock API, set the environment variable:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
```

## Build for production

From the repository root:

```bash
pnpm --filter @twa/storefront build
```

Then start the built storefront:

```bash
pnpm --filter @twa/storefront start
```

## Notes

- The storefront is located in `apps/storefront`
- Shared packages are in `packages/*`

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
cp apps/storefront/.env.example apps/storefront/.env.local
pnpm dev:storefront
```

This launches the storefront on `http://localhost:3001`.

## Storefront environment

The storefront loads environment variables from `apps/storefront/.env.local`. Start from the checked-in template at `apps/storefront/.env.example`; `.env.local` is ignored by Git.

- `NEXT_PUBLIC_USE_MOCK_API=true` enables the local MSW mock API. Set it to `false` to send requests to the real API.
- `NEXT_PUBLIC_API_BASE_URL` is the API base URL used when mocks are disabled. For local development, the user service is mounted at `http://localhost:8081/api`.

These `NEXT_PUBLIC_` values are bundled for browser use and must not contain secrets. Restart the storefront after changing them. The mock service worker file is served from `apps/storefront/public/mockServiceWorker.js`.

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

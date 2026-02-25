# Prisma v7 Setup (Kos Putra Friendly Management System)

This project uses Prisma v7 with a configuration-based datasource URL management.

## Requirements
- **Node.js**: v20 LTS is recommended. Node 24+ may cause `UV_HANDLE_CLOSING` assertions or ESM loader flakiness on Windows.
- **Environment**: A `.env` file with `DATABASE_URL` is required.

## Configuration Files
- **prisma/schema.prisma**: Defines models and provider (`postgresql`). Does NOT contain the connection URL.
- **prisma.config.ts**: The central configuration that loads `DATABASE_URL` and defines the seed command.

## Essential Commands

### 1. Migrations
To update the database schema based on `schema.prisma`:
```powershell
pnpm dlx prisma migrate dev --name init
```

### 2. Generate Client
To update the Prisma Client types:
```powershell
pnpm dlx prisma generate
```

### 3. Seeding
To initialize the database with default roles and users:
```powershell
pnpm prisma db seed
```
*Note: If seeding fails due to ESM loader issues on Node 24, try running it directly with tsx:*
```powershell
pnpm tsx prisma/seed.ts
```

## Troubleshooting
- **Missing URL Error**: Ensure `DATABASE_URL` is set in `.env` and `prisma.config.ts` is loading it via `env("DATABASE_URL")`.
- **ESM Loader Error**: Prisma v7 in Config Mode requires an ESM-compatible loader for seeding. `ts-node/esm` or `tsx` are typically used.

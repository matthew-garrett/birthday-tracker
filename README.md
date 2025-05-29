## Tech stack details

## Backend

- tRPC, Prisma, SQLite, zod

## Frontend

- Next.js, shadcn ui, tailwind

## DESIGN DECISIONS REASONING

## Backend:

- tRPC enabled end-to-end type safety with minimal boilerplate
- Prisma provided a type-safe ORM with easy schema migrations
- SQLite offered zero-config, file-based persistence ideal for local development
- Zod ensured runtime input validation directly within API procedures

## Frontend:

- Next.js App Router enabled server components, layouts, and co-located API handling
- Tailwind CSS allowed for rapid, utility-first styling
- ShadCN UI provided accessible, headless components for rapid development

## AI tool usage notes

- Used ChatGPT for backend tech research
- Used Cursor during development

## Getting Started

First, run npm install then npm run dev.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

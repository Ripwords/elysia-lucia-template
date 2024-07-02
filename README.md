# Maid-in-X

![example workflow](https://github.com/Ripwords/maidx/actions/workflows/test.yml/badge.svg)

## Project Setup

1. Install Bun

```bash
npm install -g bun
```

2. Install dependencies

```bash
bun install
```

3. Start the project

```bash
bun dev
```

## Project Tech Stack

- Backend

  - [Elysiajs](https://elysiajs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Prisma](https://www.prisma.io/)
  - [Lucia](https://lucia-auth.com/)
  - [Bun](https://bunjs.com/)

- Frontend
  - [React](https://reactjs.org/)
  - [Tauri](https://v2.tauri.app/)

## Project Structure

- Backend
  - DB Schema: prisma/schema.prisma
  - Libraries and Utilities for Backend: src/lib
  - Plugins that extend the functionality of Elysia: src/plugins
  - Routes: src/routes
  - Middleware: src/middleware

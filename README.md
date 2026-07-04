            # Logist Backend

Backend API for **Tourland** — a CRM and logistics platform for managing tours, clients, employees, warehouse operations, and internal workflows.

Built with [NestJS](https://nestjs.com/), TypeScript, PostgreSQL, and Redis.

## Features

- **Authentication** — JWT-based auth with refresh tokens and PIN-based password recovery
- **Users & roles** — Director and Employee roles with module-level access control
- **Departments** — Organize teams and structure
- **Clients** — Client management with notes, payments, and real-time updates via WebSocket
- **Tours** — Create and manage tour packages
- **Tasks** — Task templates, recurring instances, status tracking, and scheduled jobs
- **Attendance** — Employee check-in/check-out with automated cron processing
- **Warehouses** — Warehouse inventory with kirim (incoming) and chiqim (outgoing) records
- **Forms** — Dynamic form templates and submissions
- **Notifications** — In-app notifications, Web Push, and background processing via BullMQ
- **Telegram** — Bot integration for client messaging and broadcasts
- **Archive** — Activity logging and audit trail
- **File uploads** — Static serving from `/uploads`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL (TypeORM) |
| Cache / queues | Redis, BullMQ |
| Real-time | Socket.IO with Redis adapter |
| API docs | Swagger UI at `/docs` |
| Scheduling | `@nestjs/schedule` |
| Timezone | Asia/Tashkent (UTC+5) |

## Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and adjust values for your local setup:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `3001`) |
| `DATABASE_*` | PostgreSQL connection settings |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | Access token lifetime (e.g. `7D`) |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection |
| `RESET_PINCODE` | PIN used for password reset flow |

### 3. Run the server

```bash
# development (watch mode)
npm run dev

# production build
npm run build
npm run prod
```

The API is served under the `/api` prefix.

- **API:** `http://localhost:3001/api`
- **Swagger:** `http://localhost:3001/docs`

## Project Structure

```
src/
├── adapters/          # Redis Socket.IO adapter
├── common/            # Guards, decorators, shared types
└── modules/
    ├── auth/          # Login, refresh, password recovery
    ├── users/         # Employees and directors
    ├── departments/
    ├── clients/       # CRM clients, payments, WebSocket gateway
    ├── tours/
    ├── tasks/         # Task templates, instances, cron jobs
    ├── attendance/
    ├── warehouses/    # Kirim / chiqim logistics
    ├── forms/
    ├── notifications/ # Push & real-time notifications
    ├── telegram/
    ├── archive/       # Activity logs
    └── health/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start in watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run prod` | Run compiled production build |
| `npm run lint` | Lint and auto-fix |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Test coverage report |

## License

UNLICENSED — private project.

# JobBoard

A dynamic job marketplace split into a Next.js frontend and an Express/MongoDB backend.

```text
frontend/  Next.js 16 and Redux Toolkit
backend/   Express MVC API and MongoDB
```

## Features

- MongoDB-backed government and private job listings
- Express MVC backend with models, controllers, routes, and middleware
- Search and filters for keywords, location, category, and organization type
- Persisted administrator account with scrypt password hashing
- Signed admin sessions and protected job CRUD endpoints
- Professional responsive homepage, listings, details, login, and dashboard
- Automatic first-run seed data for the admin account and starter jobs
- Dedicated featured-jobs collection with automatic deadline expiration

## Local setup

1. Start MongoDB locally, or create a MongoDB Atlas database.
2. Add `MONGODB_URI` and a strong `SESSION_SECRET` to `backend/.env`.
3. Start the API:

```bash
cd backend
npm install
npm run dev
```

4. In another terminal, start Next.js:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend development script uses webpack because the project was moved into
`frontend/` and Turbopack's persisted Windows cache can retain invalid paths.
Use `npm run dev:turbo` only when you specifically want to retry Turbopack.

## Seeded admin

The backend creates this account when the configured database has no matching admin:

```text
Email: admin@jobalert.com
Password: admin123
```

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before the first startup for a production deployment.

## API

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/featured-jobs`
- `POST /api/jobs` (admin)
- `PUT /api/jobs/:id` (admin)
- `DELETE /api/jobs/:id` (admin)

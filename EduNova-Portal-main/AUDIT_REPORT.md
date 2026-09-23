# EduNova Portal Audit Report

Date: 2026-09-24
Scope: `D:\EduNova-Portal-main\EduNova-Portal-main`

## Current State

- Frontend and backend terminals were stopped.
- No remaining Node.js processes were found after shutdown.
- The frontend production build passes.
- The backend starts after Prisma client generation, but database-backed requests fail because `DATABASE_URL` is missing.
- Prisma validation fails before database setup.
- Backend Jest exits with `No tests found`.
- Editor diagnostics report no errors, but this does not replace runtime and integration testing.
- PostgreSQL schema validation and Prisma Client generation pass after the database alignment changes.
- `prisma migrate dev --name sync_postgres_architecture` reaches `localhost:5432/edunova_db` but currently fails with `P1000` because `backend/.env` still contains the intentional `YOUR_PASSWORD` placeholder.

## Documentation Alignment

The supplied [EduNova project documentation](C:/Users/CHAITANYA/Downloads/EduNova_Project_Documentation.md) is now treated as the target specification. It requires PostgreSQL, Prisma, backend-owned AI credentials, centralized API access, secure sessions, RBAC, real database data, parent-child isolation, and the learning feature set described in that document.

Changes completed in this review:

- Prisma datasource changed from SQLite to PostgreSQL to match the documented architecture and existing PostgreSQL migrations.
- Backend startup now loads `.env` before Prisma and fails clearly when `DATABASE_URL`, `JWT_SECRET`, or `FRONTEND_URL` is missing.
- CORS now uses an explicit local/frontend allowlist instead of mirroring every development origin.
- Frontend token refresh now sends `POST /api/auth/refresh` with `{ refreshToken }` and retries with the new access token.
- Backend startup output and README now describe PostgreSQL/Prisma instead of SQLite/MongoDB.

These changes were validated with a successful frontend production build, `node --check server.js`, Prisma validation using a temporary PostgreSQL URL, and clean editor diagnostics.

The documentation describes a much larger product than the currently active implementation. The remaining feature list below is therefore a delivery backlog, not a claim that the whole specification is already implemented.

## Fix Order

Complete these in order. Do not begin UI polish until the database and authentication path work.

1. Choose and configure one database architecture.
2. Create a real local environment file and validate Prisma migrations.
3. Add startup validation for required environment variables.
4. Fix authentication refresh and verify login, refresh, logout, and protected requests.
5. Remove browser-exposed secrets and route AI calls through the backend.
6. Decide which source tree is canonical: root `src`/`backend`, or `apps/web`/`apps/api`.
7. Implement or remove unfinished routes and demo fallbacks.
8. Add real automated tests and run full API checks.
9. Remediate dependency vulnerabilities without blindly using `npm audit fix --force`.
10. Update documentation and complete deployment checks.

## P0: Blocking Issues and Resolutions

### 1. Database configuration was inconsistent; environment setup remains pending

Before this review, the files and runtime showed:

- [backend/prisma/schema.prisma](backend/prisma/schema.prisma#L12) used SQLite.
- [backend/.env.example](backend/.env.example#L8) provides a PostgreSQL URL.
- [backend/prisma/schema.prisma](backend/prisma/schema.prisma#L2) comments describe PostgreSQL.
- The migration lock and migration SQL are PostgreSQL-oriented, including PostgreSQL enum and array syntax.
- The backend startup log showed: `Environment variable not found: DATABASE_URL`.
- `npx prisma validate` failed with Prisma error `P1012` for the same missing variable.

Completed and still pending:

- The provider is now PostgreSQL, matching the supplied specification and existing migrations.
- The backend README and startup log now describe PostgreSQL.
- The orphaned `apps/` source tree is scheduled for removal after confirming there are no active script or import references.
- Create a local `backend/.env` with a valid `DATABASE_URL`. Do not commit it.
- Run `npx prisma validate`, `npx prisma generate`, and `npx prisma migrate status`.
- Apply migrations against a real PostgreSQL instance and confirm seed scripts work.

Files to inspect:

- [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- [backend/prisma/migrations](backend/prisma/migrations)
- [backend/.env.example](backend/.env.example)
- [backend/config/db.js](backend/config/db.js)
- [backend/prisma/seed.js](backend/prisma/seed.js)
- [backend/prisma/seed_rich_data.js](backend/prisma/seed_rich_data.js)
- [backend/README.md](backend/README.md)

### 2. Authentication refresh was broken; fixed in the active frontend

The root application uses [src/lib/apiClient.js](src/lib/apiClient.js). It now sends `POST /api/auth/refresh` with a refresh token body and retries with the new access token.

What to change:

- Fix the root API client to send the required method, headers, and refresh token body.
- Consolidate the duplicate API clients so only the active application contains the behavior.
- Test expired access token, successful refresh, failed refresh, logout, and retry behavior.

Files:

- [src/lib/apiClient.js](src/lib/apiClient.js)
- [backend/routes/auth.js](backend/routes/auth.js)
- [backend/controllers/authController.js](backend/controllers/authController.js)

### 3. Required environment variables were not validated; fixed at startup

The backend now fails before opening its port when `DATABASE_URL`, `JWT_SECRET`, or `FRONTEND_URL` is absent. JWT signing still depends on `JWT_SECRET`.

What to change:

- Validate `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and required provider credentials during startup.
- Reject placeholder values in production.
- Fail with a clear message before opening the server port.

Files:

- [backend/server.js](backend/server.js)
- [backend/.env.example](backend/.env.example)
- [backend/services/authService.js](backend/services/authService.js)

## P1: Security and Production Risks

### 4. Gemini key is exposed to browsers

[.env.example](.env.example) defines `REACT_APP_GEMINI_API_KEY`, and [src/services/providers/geminiProvider.js](src/services/providers/geminiProvider.js) sends it from browser code. Any `REACT_APP_*` value is bundled into public JavaScript and is not secret.

Fix: send AI requests to the backend and keep `GEMINI_API_KEY` server-side. Remove the frontend key from the environment template.

### 5. CORS is too permissive in development

[backend/server.js](backend/server.js) allows arbitrary origins in development while credentials are enabled. A deployment accidentally left in development mode could accept credentialed cross-origin requests.

Fix: use an explicit origin allowlist in every environment and fail closed when the production frontend URL is absent.

### 6. Seed data contains reusable passwords

[backend/prisma/seed.js](backend/prisma/seed.js) and [backend/prisma/seed_rich_data.js](backend/prisma/seed_rich_data.js) contain predictable demo passwords.

Fix: block demo seeding in production, obtain seed credentials from environment variables, and document that demo credentials must never be deployed.

### 7. Dependency vulnerabilities exist

The checks reported:

- Frontend: 28 vulnerabilities, including 14 high severity. Many come through legacy `react-scripts` dependencies.
- Backend: 3 high severity vulnerabilities through Prisma configuration dependencies.

Fix carefully:

- Review `npm audit` output in each package root.
- Upgrade or replace legacy tooling in a dedicated change.
- Do not run `npm audit fix --force` blindly because the frontend report indicates a breaking replacement for `react-scripts`.
- Remove the unnecessary `crypto` npm dependency; Node provides the built-in module.
- Check `multer` 1.x and other direct dependencies for supported versions.

Files:

- [package.json](package.json)
- [backend/package.json](backend/package.json)

## P1: Incomplete or Misleading Features

### 8. Skills endpoint is unfinished

[backend/routes/skills.js](backend/routes/skills.js) returns `Skills route - to be implemented`. The frontend contains skill exchange UI and uses exchange-related APIs, so this can create a false-success screen.

Fix: implement the intended API contract and persistence, or remove the unused route and update callers. Add success, empty, unauthorized, validation, and server-error tests.

### 9. Duplicate application tree was present; removal is in progress

The root scripts use `src/` and `backend/`. The separate `apps/web/src` and `apps/api/src` tree has no package manifest, build entry point, or active import from the root application.

The root `src/` and `backend/` tree is canonical. The orphaned `apps/` tree is being removed after its complete deletion manifest was reviewed.

### 10. Demo and local-storage fallbacks can hide failures

Examples include:

- [src/services/providers/aiProvider.js](src/services/providers/aiProvider.js)
- [src/data/analyticsDemoData.js](src/data/analyticsDemoData.js)
- [src/data/mockSkillExchange.js](src/data/mockSkillExchange.js)
- [src/services/visionService.js](src/services/visionService.js)
- [src/services/skillExchangeService.js](src/services/skillExchangeService.js)

Fix: make demo mode explicit, disable it by default in production, and show clear loading, empty, offline, and server-error states.

### 11. OTP delivery is not production-ready

[backend/services/otpService.js](backend/services/otpService.js) logs OTP values and indicates that an SMS gateway is still needed.

Fix: integrate a real provider, remove OTP logging, rate-limit requests, expire codes, hash stored codes where practical, and make development OTP behavior impossible in production.

### 12. Backend documentation is stale

[backend/README.md](backend/README.md) describes MongoDB/Mongoose while the implementation uses Prisma and currently declares SQLite in the schema.

Fix: rewrite setup, database, migrations, environment variables, seed behavior, routes, and test commands after the database decision.

## Testing Gaps

### 13. Backend test script does not discover the existing tests

[backend/package.json](backend/package.json) runs Jest, but existing files are named like `test_auth.js` and use standalone scripts. Jest found zero tests and exited with code 1.

Fix one of these approaches:

- Convert/rename tests to Jest naming and assertions.
- Or change scripts to explicit commands such as `node test_auth.js` and document that the server and database must be running.

The root frontend has no meaningful automated test suite. Add tests for routing, authentication, API error states, and the highest-risk user flows.

Existing checks to review:

- [backend/test_auth.js](backend/test_auth.js)
- [backend/test_comprehensive_api_check.js](backend/test_comprehensive_api_check.js)
- [backend/test_fullstack_refactor.js](backend/test_fullstack_refactor.js)
- [backend/test_quiz_analytics.js](backend/test_quiz_analytics.js)
- [backend/test_realtime.js](backend/test_realtime.js)
- [backend/test_sage_ai.js](backend/test_sage_ai.js)
- [backend/test_sage_engine.js](backend/test_sage_engine.js)
- [backend/test_step3.js](backend/test_step3.js)

## Confirmed Validation Results

| Check | Result |
|---|---|
| `npm start` from outer `D:\EduNova-Portal-main` | Fails because that directory has no `package.json` |
| Frontend start from nested project root | Passes on port 3000 |
| Backend start after `prisma generate` | Starts on port 5000 |
| Frontend HTTP check | HTTP 200 |
| Backend `/` check | HTTP 404; no root route, not necessarily a bug |
| Backend `/api/health` check | HTTP 200, but database-backed calls still fail |
| Frontend `npm run build` | Passes; bundle is 546.81 kB gzip before compression details |
| `npx prisma validate` | Fails: missing `DATABASE_URL` |
| Backend `npm test -- --runInBand` | Fails: no tests found |
| Editor diagnostics | No errors reported |
| Frontend `npm audit --audit-level=high` | 28 vulnerabilities, 14 high |
| Backend `npm audit --audit-level=high` | 3 high vulnerabilities |

## Recommended Completion Gate

Call the application stable only after all of the following pass:

```powershell
Set-Location D:\EduNova-Portal-main\EduNova-Portal-main
npm ci
npm run build

Set-Location D:\EduNova-Portal-main\EduNova-Portal-main\backend
npm ci
npx prisma validate
npx prisma generate
npx prisma migrate status
npm test
```

Then run the API with a valid environment and database, and execute the existing integration checks. Verify at minimum:

- registration, login, refresh, logout, and protected routes
- Google authentication failure and success paths
- course, quiz, progress, notes, analytics, and gamification persistence
- parent/learner authorization boundaries
- file upload validation
- Socket.IO authentication and reconnect behavior
- AI provider unavailable/error behavior
- OTP expiry, retry limits, and production logging
- mobile and desktop frontend flows

## Important Scope Note

This is a prioritized engineering audit, not a guarantee that every visual or business rule is correct. The build passing proves compilation, not feature correctness. The next implementation milestone should be database/environment repair followed by authentication tests; those two areas currently affect the largest part of the application.

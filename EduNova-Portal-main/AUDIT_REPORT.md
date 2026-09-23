# EduNova Portal Current Audit

Date: 2026-09-24
Scope: `D:\EduNova-Portal-main\EduNova-Portal-main`
Source of truth: `EduNova_Project_Documentation.md` supplied by the user.

## Executive Status

EduNova is operational for the repaired core, but the entire product specification is not complete. PostgreSQL is connected, migrations are applied, authentication works, the frontend builds, and the core AI, skills, gamification, course, subject, notes, and zero-state paths are wired. Several secondary screens still use demo data or localStorage because their complete backend contracts do not yet exist.

**Overall implementation estimate: 72%**

This is an engineering estimate of documented capability coverage, not a test pass percentage.

## Percentage Scorecard

| Area | Status | Estimated completion | What is included |
|---|---:|---:|---|
| Repository structure | Complete | 100% | Root `src/` and `backend/` are canonical; `apps/` removed; redundant `crypto` dependency removed. |
| PostgreSQL and Prisma foundation | Complete | 95% | PostgreSQL datasource, boot `SELECT 1`, three applied migrations, schema reconciliation, generated client. Remaining risk is legacy schema history outside the three local migrations. |
| Authentication and sessions | Complete | 90% | Password, OTP, Google route, HTTP-only cookies, refresh rotation, queue/retry client, logout cleanup, RBAC. Live Google-provider success and refresh with a real account still need separate production credentials testing. |
| Zero-state onboarding | Complete | 90% | New learner state starts at XP 0, level 1, streak 0, empty goals/weak topics; legacy browser keys are purged. Legitimate server progress is still hydrated for returning users. |
| Backend API architecture | Strong | 85% | Route → middleware → controller → service → Prisma pattern exists for major domains. Some response shapes and older controllers still need contract normalization. |
| AI/Sage security and persistence | Strong | 85% | Gemini is backend-only, learner context is injected, chat/history are authenticated, `AiConversation` and `AiMessage` persistence exists. Live Gemini response requires a valid backend key and provider test. |
| Courses, subjects, progress, gamification | Strong | 85% | Live course/subject APIs, progress updates, module completion, XP transactions, summaries, and migrations exist. Broader UI adoption is incomplete. |
| Skill DNA and Skill Exchange | Partial | 75% | Skill DNA aggregates quiz attempts/modules; marketplace and exchange APIs are connected. Some exchange UI actions still depend on legacy screen assumptions. |
| Notes | Strong | 85% | Missing `notes` table was repaired additively; Prisma note queries now work. Full UI CRUD and error-state coverage still need broader testing. |
| Study planner | Partial | 45% | Existing UI/service is still localStorage/demo oriented; persistent study-session API wiring is incomplete. |
| Community/chat/notifications | Partial | 45% | Some backend conversation/socket routes exist, but community and notification screens still contain local/demo state. |
| Exam analytics and dashboards | Partial | 40% | Several dashboard and exam intelligence modules use static datasets or localStorage. |
| Labs, games, XR progress | Partial | 40% | Backend support is incomplete; some progress and simulation data remains client-side. |
| Automated testing | Partial | 60% | Auth integration command runs and passes exercised checks; many standalone scripts remain, and frontend automated coverage is limited. |
| Dependency/deployment hardening | Partial | 55% | Secrets are server-side and CORS is restricted. Frontend has legacy `react-scripts` vulnerabilities and the bundle is about 529 kB gzip. |

## Completed Changes

### Structure and dependencies

- Deleted the orphaned `apps/api` and `apps/web` tree after confirming no active root/backend script depended on it.
- Removed the npm `crypto` package from [backend/package.json](backend/package.json).
- Root scripts use `src/`; backend scripts use `backend/`.

### Database

- [backend/prisma/schema.prisma](backend/prisma/schema.prisma) uses PostgreSQL.
- Learner goals, weak topics, completed modules, note tags, and attachments use PostgreSQL arrays where appropriate.
- Existing lowercase live learner columns are mapped with Prisma `@map` rather than destructively renaming data.
- Added additive migration [20260924000000_reconcile_live_schema](backend/prisma/migrations/20260924000000_reconcile_live_schema/migration.sql) for missing notes and subject metadata.
- Added additive migration [20260924001000_add_ai_messages](backend/prisma/migrations/20260924001000_add_ai_messages/migration.sql).
- Existing database was backed up to `backend/edunova_backup.dump`.
- No `prisma migrate reset` was used.

### Authentication and security

- [backend/server.js](backend/server.js) validates required environment variables before opening a port and verifies PostgreSQL with `SELECT 1`.
- CORS uses an explicit localhost/frontend allowlist with credentials enabled.
- [backend/controllers/authController.js](backend/controllers/authController.js) accepts refresh tokens from the body or `refresh_token` cookie, rotates tokens, sets HTTP-only cookies, and clears both cookies on logout.
- [src/lib/apiClient.js](src/lib/apiClient.js) queues concurrent 401 requests, refreshes once, retries with the new token, and redirects only after refresh failure.
- Browser Gemini API access was removed. No `REACT_APP_GEMINI_API_KEY` remains in frontend source.

### AI

- [backend/services/aiService.js](backend/services/aiService.js) reads `GEMINI_API_KEY` only on the server, loads learner context, calls the backend Gemini provider, and persists user/model messages.
- [backend/routes/ai.js](backend/routes/ai.js) protects and validates chat/history routes.
- [src/context/AIContext.jsx](src/context/AIContext.jsx) and [src/services/ai/aiService.js](src/services/ai/aiService.js) use backend APIs.
- The root dependency tree contains no Google Gemini package.

### Live application data

- [backend/controllers/skillController.js](backend/controllers/skillController.js) implements Skill DNA aggregation and marketplace reads.
- [src/services/skillDNAService.js](src/services/skillDNAService.js) uses `/api/skills/dna` and renders a zero-evidence state.
- [src/services/skillExchangeService.js](src/services/skillExchangeService.js) uses backend exchange/conversation APIs instead of localStorage for its replacement paths.
- [src/services/userService.js](src/services/userService.js) sends XP to `/api/gamification/xp`.
- [src/context/LearnerContext.jsx](src/context/LearnerContext.jsx) starts from a clean profile and no longer falls back to named demo learners.
- [src/App.js](src/App.js) removes legacy identity, mission, and XP keys on mount.

## Pending Work

### P0: Before claiming full product completion

1. **Study planner persistence, estimated 45%**
   - Replace generated default plans and localStorage sessions in [src/services/studyPlannerService.js](src/services/studyPlannerService.js).
   - Wire create/list/complete operations to backend study-session routes.
   - Add `StudyPlan`, `StudyGoal`, and `StudyTask` persistence if the current schema does not cover the UI contract.

2. **Static dashboard and exam data, estimated 40%**
   - Replace [src/data/analyticsDemoData.js](src/data/analyticsDemoData.js), [src/services/examTrackService.js](src/services/examTrackService.js), and related dashboard calculations with API responses.
   - Render empty states instead of invented scores when no evidence exists.

3. **Community, notifications, games, labs, and XR persistence, estimated 40-45%**
   - Map each UI workflow to a Prisma model and authenticated route.
   - Remove localStorage-backed progress once server CRUD exists.
   - Add ownership and role tests.

### P1: Security and release quality

- Replace predictable demo seed passwords in [backend/prisma/seed.js](backend/prisma/seed.js) and [backend/prisma/seed_rich_data.js](backend/prisma/seed_rich_data.js) with environment-provided development credentials and block demo seeding in production.
- Remove OTP logging and connect a real SMS provider in [backend/services/otpService.js](backend/services/otpService.js).
- Upgrade or replace legacy `react-scripts` dependencies. Previous audits reported 28 frontend vulnerabilities and 3 high backend transitive vulnerabilities.
- Add production startup rejection for placeholder JWT/Gemini values, not only missing values.
- Add rate-limit and abuse tests for AI, login, OTP, file upload, and exchange endpoints.

### P2: Testing and architecture

- Convert standalone `backend/test_*.js` scripts into real Jest suites or keep explicit integration scripts and return nonzero on assertion failures.
- Add frontend tests for authentication hydration, zero-state onboarding, API error states, and protected routing.
- Decide whether the long-term target is Next.js. The active application is Create React App, which is consistent with the current scripts but differs from the supplied documentation.
- Reduce the production bundle from approximately 529 kB gzip through code splitting and dependency modernization.

## Verified Commands

Run from the nested project root:

```powershell
Set-Location D:\EduNova-Portal-main\EduNova-Portal-main
npm run build
```

Run from the backend root:

```powershell
Set-Location D:\EduNova-Portal-main\EduNova-Portal-main\backend
npm test
npx prisma validate
npx prisma migrate status
node server.js
```

## Latest Validation Results

| Check | Result |
|---|---|
| Root production build | PASS |
| Backend `npm test` / auth integration | PASS for exercised checks |
| Backend syntax checks | PASS |
| Prisma validation | PASS |
| Prisma migration status | PASS; 3 migrations applied |
| PostgreSQL boot query | PASS |
| `/api/health` | HTTP 200; database connected |
| Notes count query | PASS after reconciliation migration |
| Subject metadata query | PASS after reconciliation migration |
| Skills routes unauthenticated | Correctly return 401 |
| Frontend Gemini key scan | No browser key or direct Google URL found |
| Editor diagnostics on touched files | No errors |

## Operational Notes

- Start backend from `D:\EduNova-Portal-main\EduNova-Portal-main\backend`, not the outer directory.
- Start frontend from `D:\EduNova-Portal-main\EduNova-Portal-main`.
- Do not run `npx prisma migrate reset` against the existing database.
- Keep `backend/.env` private. The frontend must contain only a public API URL.
- A passing build proves compilation, not full feature parity with the product documentation.

## Final Assessment

The repaired core is stable enough for continued development and local integration testing. The platform is not yet a complete zero-mock implementation because the secondary planner, dashboard, community, exam, lab, game, notification, and XR workflows still need backend contracts and API migration. The next highest-value work is study-planner persistence, dashboard/exam data replacement, and full end-to-end frontend coverage.

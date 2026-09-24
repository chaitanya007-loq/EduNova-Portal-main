# EduNova Portal

EduNova is a full-stack learning platform for school students, college students,
competitive-exam learners, skill learners, parents, instructors, and platform
administrators.

The repository contains:

- A React 19 frontend with React Router, Framer Motion, Recharts, and Lucide icons.
- A Node.js and Express API.
- A PostgreSQL database accessed through Prisma ORM.
- JWT authentication with HTTP-only cookies, refresh tokens, role-based access
  control, Argon2id password hashing, and server-side session revocation.
- Admin-managed courses, modules, subjects, topics, users, and audit activity.
- Sage AI features powered by Google Gemini when a Gemini API key is configured.
- Email OTP password recovery through an SMTP provider such as Gmail.

## Project status

### Implemented

- Email/password registration and login.
- Google sign-in integration.
- Parent accounts and parent-to-student linking.
- Password reset using a one-time code sent to the registered email.
- Learner onboarding, profile, goals, and learner tracks.
- Course catalog, enrollment, modules, and completion tracking.
- Subject and topic curriculum management.
- Subject and course progress tracking.
- Quizzes, attempts, accuracy, time spent, and quiz analytics.
- Study sessions and progress analytics.
- Missions, XP, streaks, achievements, and leaderboards.
- Sage AI chat, quiz generation, weak-topic plans, and persistent AI history.
- Real-time conversations, messages, files, and skill exchanges.
- Notes and note-related AI tools.
- Parent dashboards and learner performance views.
- Admin dashboard with metrics, user role management, course/module CRUD,
  subject/topic CRUD, content moderation, and audit logging.
- PostgreSQL Prisma migrations and seed data.
- Production frontend build.

### Important current limitations

- Some older learner-facing screens still contain local-storage or presentation
  fallback data. Admin-created courses and subjects use the PostgreSQL API, but
  not every legacy screen has been migrated to the backend yet.
- Sage AI requires a valid `GEMINI_API_KEY`.
- Email password recovery requires SMTP credentials.
- Google login requires a valid Google Identity Services client configuration.
- The development database and seed data are intended for local development,
  not production deployment.

## Architecture

```text
React frontend
  ├── pages/
  ├── components/
  ├── context/
  ├── services/
  └── lib/apiClient.js
          │ HTTP/JSON + cookies
          ▼
Express API
  ├── routes/
  ├── middleware/
  ├── controllers/
  ├── services/
  └── config/db.js
          │ Prisma Client
          ▼
PostgreSQL
```

The backend follows:

```text
Route → middleware → controller → service → Prisma Client → PostgreSQL
```

The root `src/` and `backend/` directories are the active application trees.
There is no active `apps/` duplicate tree.

## Repository structure

```text
EduNova-Portal-main/
├── public/                    # Public images and video assets
├── src/
│   ├── components/            # Reusable UI and feature components
│   ├── context/               # Auth, learner, theme, AI, notifications
│   ├── data/                  # Legacy UI/curriculum fallback data
│   ├── hooks/                 # Reusable React hooks
│   ├── lib/                   # API clients
│   ├── pages/                 # Route-level screens
│   ├── services/              # Frontend domain services
│   └── styles/                # Global and feature styles
├── backend/
│   ├── config/                # Database configuration
│   ├── controllers/           # HTTP request handlers
│   ├── middleware/            # Auth, validation, rate limiting
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL data model
│   │   ├── migrations/        # Versioned database changes
│   │   └── seed.js            # Local development seed
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── .env.example           # Backend environment template
│   └── server.js              # API entry point
├── package.json               # Frontend scripts and dependencies
└── README.md
```

## Requirements

- Node.js 18 or newer.
- npm.
- PostgreSQL 18 or a compatible PostgreSQL release.
- A local database named `edunova_db`.
- Optional:
  - Google Gemini API key for Sage AI.
  - Gmail App Password or another SMTP provider for password recovery.
  - Google OAuth client ID for Google login.

## Local setup

### 1. Install frontend dependencies

From the repository root:

```powershell
npm install
```

### 2. Configure the frontend

The frontend needs its own environment file for the API URL:

```powershell
Copy-Item .env.example .env
```

The committed root `.env.example` contains:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install backend dependencies

```powershell
cd backend
npm install
```

### 4. Create the backend environment file

```powershell
Copy-Item .env.example .env
```

Edit `backend/.env` and set real local values:

```env
PORT=5000
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/edunova_db?schema=public"

JWT_SECRET="replace_with_a_long_random_secret"
JWT_REFRESH_SECRET="replace_with_a_different_long_random_secret"
JWT_EXPIRES_IN=7d

FRONTEND_URL="http://localhost:3000"

GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL=gemini-2.5-flash
GOOGLE_CLIENT_ID="your_google_oauth_web_client_id"

# Gmail App Password or another SMTP provider
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="sender@gmail.com"
SMTP_PASS="gmail_app_password"
MAIL_FROM="EduNova <sender@gmail.com>"
```

Never commit `backend/.env`, SMTP passwords, JWT secrets, or API keys.

### 5. Prepare PostgreSQL and Prisma

Create the local database once if it does not already exist:

```powershell
createdb -U postgres edunova_db
```

If `createdb` is not on `PATH`, create a database named `edunova_db` using
pgAdmin or the PostgreSQL SQL Shell instead.

```powershell
cd backend
npx prisma generate
npm run db:setup
```

`npm run db:setup` applies all committed migrations and seeds local demo data.
It is intended for a new local database. For an existing database where the
schema is already migrated, use:

```powershell
npx prisma migrate deploy
npx prisma generate
```

`prisma migrate reset` deletes local database data. Use it only when the
development database can be safely recreated.

## Running the application

Open two terminals from the repository root.

### Terminal 1: backend

```powershell
cd backend
npm run dev
```

The API runs at `http://localhost:5000`.

### Terminal 2: frontend

```powershell
npm start
```

The frontend runs at `http://localhost:3000`.

The frontend API client uses `REACT_APP_API_URL` when provided, then falls back
to `http://localhost:5000/api` and `http://localhost:5001/api`.

## Demo accounts

The development seed creates these local accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@edunova.in` | `admin123` |
| Instructor | `instructor@edunova.in` | `instructor123` |
| Student | `student@edunova.in` | `student123` |
| Parent | `parent@edunova.in` | `parent123` |

Use these accounts only in a local development database. Change or remove them
before deploying anywhere accessible to other users.

## Authentication and security

Authentication is server-controlled. Client-provided roles are not trusted for
authorization.

- Passwords are hashed with Argon2id.
- Legacy bcrypt hashes are upgraded on successful login.
- Access and refresh JWTs are algorithm-pinned to HS256.
- Tokens carry a database-backed `tokenVersion`.
- Logout and password reset increment `tokenVersion`, invalidating existing
  sessions.
- Authentication uses secure HTTP-only cookies.
- Production cookies use `Secure` and `SameSite=Strict`.
- Express uses Helmet, CORS, request validation, and rate limiting.
- Admin routes require both authentication and the `ADMIN` role.
- Password reset codes expire after 10 minutes and allow at most five attempts.
- Password reset responses do not reveal whether an email exists.

### Admin access

The admin workspace is deliberately accessed at:

```text
http://localhost:3000/admin
```

It is protected by the authenticated backend role. A user must have
`role = ADMIN` in PostgreSQL; changing client-side storage or navigating to the
route does not grant admin access.

Admin capabilities include:

- Platform metrics.
- User search and role management.
- Course creation, editing, publishing, and deletion.
- Course module management.
- Subject creation, editing, and deletion.
- Topic management.
- Administrative audit activity.

## Password recovery email OTP

Email OTP is used only for forgotten-password recovery. It is not used for
normal login.

1. Open `/login`.
2. Select **Forgot password?**
3. Enter the registered email.
4. Enter the six-digit code received by email.
5. Set a new password.

For Gmail, enable 2-Step Verification and create a Google App Password. Use
that App Password as `SMTP_PASS`; do not use the normal Gmail password.

## Sage AI configuration

Sage AI endpoints are available under `/api/ai`. Configure:

```env
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL=gemini-2.5-flash
```

Without a Gemini key, AI requests return a configuration error rather than
pretending that a live model response was generated.

## Main API areas

All API routes are prefixed with `/api`.

| Area | Base route | Purpose |
|---|---|---|
| Authentication | `/auth` | Registration, login, Google login, password reset, sessions |
| Users | `/users` | User profile and account operations |
| Learners | `/learners` | Onboarding, goals, learner type, learner profile |
| Courses | `/courses` | Course catalog, enrollment, modules, completion |
| Subjects | `/subjects` | Curriculum, subjects, topics, enrollment, progress |
| Progress | `/progress` | Dashboard, subject, and course progress |
| Quizzes | `/quizzes` | Quiz questions, attempts, and analytics |
| AI | `/ai` | Sage chat, history, generated quizzes, weak-topic plans |
| Analytics | `/analytics` | Study sessions and analytics summaries |
| Gamification | `/gamification` | Missions, XP, streaks, achievements, leaderboards |
| Conversations | `/conversations` | Chat conversations, messages, and files |
| Exchanges | `/exchanges` | Skill exchange requests and statuses |
| Parents | `/parents` | Child overview and parent views |
| Admin | `/admin` | Metrics, users, courses, subjects, and audit operations |
| Notes | `/notes` | User notes, tags, summaries, and AI note tools |

## Database model

The PostgreSQL Prisma schema includes:

- `User`, `LearnerProfile`, and `PasswordResetCode`.
- `Subject`, `Topic`, and student subject progress.
- `Course`, `CourseModule`, and course progress.
- `Quiz`, `QuizQuestion`, and `QuizAttempt`.
- `StudySession`, `Mission`, `UserMission`, and `XpTransaction`.
- `Conversation`, `ConversationMember`, and `ChatMessage`.
- `SkillExchange`.
- `AiConversation` and `AiMessage`.
- `Note`.
- `AdminAuditLog`.

The schema is in `backend/prisma/schema.prisma`. Migrations are in
`backend/prisma/migrations/`.

## Useful commands

### Root frontend

```powershell
npm start                 # Start React development server
npm run build             # Create production build
npm test                  # Run React test runner
npm run backend           # Start backend from the root
```

### Backend

```powershell
npm run dev               # Start Express with nodemon
npm start                 # Start Express
npm run test:auth         # Authentication integration checks
npm run test:api          # Comprehensive API checks
npm run test:quiz         # Quiz analytics checks
npm run test:realtime     # Realtime checks
npm run test:jest         # Jest suite
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Create/apply a development migration
npm run prisma:migrate:prod
npm run prisma:studio
npm run prisma:seed
npm run db:setup
```

### Validation used for the current codebase

```powershell
npm run build
cd backend
npx prisma validate
node --check server.js
```

## Troubleshooting

### `401 Unauthorized` for `/api/auth/me`

This is expected once during startup when no user session exists. After login,
the backend sets HTTP-only cookies and the client stores the token needed for
authenticated API calls.

### Fresh clone checklist

If a friend downloads or clones the repository, they must not copy your local
`node_modules`, `.env`, PostgreSQL data, or build folder. They should:

1. Install Node.js and PostgreSQL.
2. Run `npm install` in the root.
3. Run `npm install` in `backend/`.
4. Copy the root `.env.example` to root `.env`.
5. Copy `backend/.env.example` to `backend/.env`.
6. Create the `edunova_db` PostgreSQL database.
7. Set the PostgreSQL password and JWT secrets in `backend/.env`.
8. Run `cd backend; npm run db:setup`.
9. Start the backend and frontend in separate terminals.

The repository intentionally ignores `.env`, `node_modules`, and `build`, so
each developer generates those locally.

### `401 Unauthorized` for `/api/ai/history`

AI history requires authentication. The frontend waits for session hydration
before requesting history. Confirm that the user is logged in and the backend
is running on port 5000.

### Password reset email is not sent

Check all SMTP values in `backend/.env`. For Gmail:

- 2-Step Verification must be enabled.
- `SMTP_PASS` must be a Google App Password.
- `SMTP_USER` and `MAIL_FROM` should use the sending Gmail account.
- Restart the backend after changing `.env`.

### Prisma cannot connect

Confirm that PostgreSQL is running and that `DATABASE_URL` contains the correct
password, host, port, database name, and `schema=public` query parameter.

### Admin page returns forbidden

The logged-in database user must have `ADMIN` role. The URL alone does not grant
privileges.

## Contributing

1. Create a feature branch.
2. Keep frontend code under `src/` and backend code under `backend/`.
3. Add or update Prisma migrations for schema changes.
4. Do not commit `.env` files or credentials.
5. Run the frontend build, Prisma validation, and backend syntax checks before
   opening a pull request.
6. Describe any remaining static fallback or incomplete feature honestly in the
   pull request.

## License

No project license has been declared yet. Add a `LICENSE` file before
redistributing the project publicly.

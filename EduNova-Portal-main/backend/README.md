# EduNova Backend API

Express.js + Prisma + PostgreSQL backend for the EduNova learning platform.

## 📁 Folder Structure

```
backend/
├── config/          # Database & app configuration
│   └── db.js
├── controllers/     # Route handler logic
│   ├── authController.js
│   ├── courseController.js
│   ├── progressController.js
│   └── userController.js
├── middleware/       # Custom middleware
│   ├── auth.js      # JWT authentication & role authorization
│   └── validate.js  # Request validation
├── prisma/          # Prisma schema, migrations, and seed scripts
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── routes/          # API route definitions
│   ├── ai.js
│   ├── analytics.js
│   ├── auth.js
│   ├── courses.js
│   ├── gamification.js
│   ├── progress.js
│   ├── skills.js
│   ├── subjects.js
│   └── users.js
├── .env.example     # Environment variables template
├── package.json
├── README.md
└── server.js        # Entry point
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Set DATABASE_URL to a PostgreSQL database and replace all placeholders.
   ```

3. **Prepare Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Run the server:**
   ```bash
   npm run dev    # Development (with hot reload)
   npm start      # Production
   ```

5. Server runs on `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint                  | Access  | Description              |
|--------|---------------------------|---------|--------------------------|
| POST   | `/api/auth/register`      | Public  | Register new user        |
| POST   | `/api/auth/login`         | Public  | Login user               |
| GET    | `/api/auth/me`            | Private | Get current user         |
| GET    | `/api/users/profile`      | Private | Get user profile         |
| PUT    | `/api/users/profile`      | Private | Update user profile      |
| GET    | `/api/courses`            | Public  | List all courses         |
| GET    | `/api/courses/:id`        | Public  | Get course details       |
| POST   | `/api/courses/:id/enroll` | Private | Enroll in a course       |
| GET    | `/api/progress`           | Private | Get user's progress      |
| PUT    | `/api/progress/:courseId`  | Private | Update course progress   |
| GET    | `/api/health`             | Public  | API health check         |

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Argon2/bcrypt
- **Validation:** Zod and express-validator where configured
- **Security:** Helmet, CORS

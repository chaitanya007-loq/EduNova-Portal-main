# EduNova Backend Ideation Context

This document captures the current frontend application structure, entities, flows, and simulated data so it can be used as input for a backend design or AI implementation plan.

## 1. Project Overview

EduNova is a learning platform for:
- School students (CBSE / board-level learning)
- College students (degree programs, labs, project work)
- Exam aspirants
- Skill-based learners / career-oriented users

The app includes:
- Authentication and role-based access
- Personalized dashboard and learner profile
- Course browsing and subject tracking
- AI learning assistant and study planner
- Immersive / XR / lab simulation
- Skill exchange and peer messaging
- Gamification with XP, streaks, achievements, missions
- Parent companion experience
- Analytics and progress monitoring

## 2. Current Tech Stack

Frontend:
- React 19
- React Router DOM
- Framer Motion
- Recharts
- Lucide React
- canvas-confetti

Build tools:
- CRA / react-scripts 5

State / app structure:
- Context API providers:
  - AuthContext
  - ThemeContext
  - LearningContext
  - LearnerContext
  - AIContext
  - NotificationContext

Storage pattern:
- LocalStorage is used as the simulated backend for user state and learner profile data.
- The app currently behaves like a full frontend demo with mocked services and static JSON datasets.

## 3. Main Application Architecture

### App shell
File: `src/App.js`

Main route structure:
- Public pages:
  - `/`
  - `/explore`
  - `/marketplace`
  - `/skill-exchange`
  - `/about`
- Authenticated pages:
  - `/dashboard`
  - `/my-subjects`
  - `/subjects/:subjectId`
  - `/ai-assistant`
  - `/learning-path`
  - `/study-planner`
  - `/immersive-lab`
  - `/labs`
  - `/xr-studio`
  - `/ar-vr`
  - `/ar-vr-studio`
  - `/immersive-studio`
  - `/constellation`
  - `/skill-dna`
  - `/skill-marketplace`
  - `/messages`
  - `/messages/:conversationId`
  - `/exchanges/:exchangeId/chat`
  - `/skill-swap-match`
  - `/courses`
  - `/courses/:id`
  - `/courses/:id/lesson`
  - `/analytics`
  - `/community`
  - `/community/:channelId`
  - `/achievements`
  - `/challenges`
  - `/profile`
  - `/settings`
  - `/parent-dashboard`
- Auth pages:
  - `/login`
  - `/parent-login`
  - `/parent-register`
  - `/register`

Protected route behavior:
- `ProtectedRoute` checks authentication and redirects when needed.

## 4. Authentication and User Model

### Auth data
File: `src/services/authService.js`

Current simulation behavior:
- Login success if email and password exist.
- Register creates a new user object and stores it in localStorage under `edunova_user`.
- Parent login uses `studentUsername` + parent password.
- Parent registration stores a `role: 'parent'` user with linked student username.

### Current user defaults
File: `src/data/users.js`

Representative user:
- id: `usr_101`
- name: `Alex Mercer`
- email: `alex.mercer@edunova.io`
- title: `Full Stack & AI Enthusiast`
- level: 7
- xp: 2840
- streakDays: 12
- weeklyGoalHours: 8
- weeklyHoursLogged: 6.5
- skillsOffered: `["React.js", "JavaScript", "CSS Architecture"]`
- skillsWanted: `["UI/UX Design", "Python Machine Learning", "3D WebGL"]`

### Auth context
File: `src/context/AuthContext.jsx`

Available auth values:
- user
- isAuthenticated
- isParent
- loading
- login
- loginParent
- registerParent
- register
- logout
- updateUser

## 5. Learner Profile Model

File: `src/data/learners.js`

Supported learner types:
- school
- college
- skills
- exam

Example school learner:
- name: `Aarav Sharma`
- username: `aarav_sharma`
- learnerType: `school`
- education.board: `CBSE`
- education.class: `Class 10`
- goals: `["Score 95%+ in Board Exams", "Master Physics Formulas"]`
- weakTopics: `["Quadratic Equations", "Chemical Reactions & Equations", "Electric Current Effects"]`

Example college learner:
- name: `Kavya Shah`
- username: `kavyashah_dev`
- learnerType: `college`
- education.degree: `B.Tech`
- education.branch: `Computer Science & Engineering`
- careerGoal: `Full Stack Software Engineer`

Profile storage:
- localStorage key: `edunova_active_learner_profile`

### LearnerService responsibilities
File: `src/services/learnerService.js`

Features:
- getProfile()
- setProfile()
- calculateProfileCompletion()
- getLearningGoals()
- addLearningGoal()
- updateLearningGoal()
- deleteLearningGoal()
- getLearningTimeline()
- checkUsernameAvailability()
- switchDemoProfile()
- updateLearningType()
- updateParentCompanion()
- resetPersonalization()
- exportUserData()
- getSetupHealthScore()
- subscribe() / notifyListeners()

## 6. Learning and Gamification Model

### Learning context
File: `src/context/LearningContext.jsx`

State includes:
- xp
- streakDays
- bestStreak
- weeklyConsistency
- streakShields
- achievements
- dailyMissions
- weeklyChallenge
- xpTransactions
- milestones
- levelUpData

Key methods:
- earnXp(amount, sourceTitle, category)
- completeMission(missionId)
- useStreakShield()
- closeLevelUpModal()

### Achievement engine
Files:
- `src/data/achievements.js`
- `src/data/missions.js`
- `src/utils/achievementEngine.js`
- `src/utils/levelCalculator.js`

Game elements:
- XP points
- daily missions
- weekly challenge
- streaks
- badges / achievements
- level progression
- confetti celebration events

### Mission example data
From `src/data/missions.js`:
- Complete 2 lessons
- Finish a quiz
- Improve study streak
- Explore a subject

### Typical XP transaction example
- `Interactive Lesson Completed`: +100 XP
- `100% Score in Physics Quiz`: +150 XP
- `12-Day Active Learning Streak`: +50 XP
- `Skill Node Unlocked in Constellation`: +120 XP

## 7. Course and Subject Data Model

### Course dataset
File: `src/data/courses.js`

The app defines multiple course catalog groups:
- school
- college
- skills
- exam

Each course includes:
- id
- title
- category
- instructor
- rating
- studentsEnrolled
- duration
- difficulty
- thumbnail
- description
- progress
- modules[]
- prerequisites[]

Example fields:
- `id`: `sch_1`
- `title`: `Class 10 Mathematics: Quadratic Equations & Trigonometry`
- `category`: `Mathematics`
- `duration`: `16 Hours`
- `difficulty`: `Class 10 CBSE`
- `progress`: 78
- `modules`: array of module objects with completed flags

### Course service
File: `src/services/courseService.js`

Functions:
- getCourses(learnerType, categoryFilter, searchQuery)
- getCourseById(id)
- updateModuleProgress(courseId, moduleId, completedStatus)

### Subject dataset
File: `src/data/subjects.js`

This file contains a broader educational subject model and includes many fields such as:
- id
- name
- category
- educationType
- class
- board
- medium
- description
- shortDescription
- icon
- image
- color
- chaptersCount
- questionsCount
- flashcardsCount
- notesCount
- videosCount
- quizzesCount
- interactiveCount
- progress
- targetScore
- difficulty
- priority
- syllabusCoverage
- hasInteractiveLab
- labType
- aiEnabled
- favorite
- currentTopic
- weakTopic
- nextActivity
- prerequisites
- nextRecommendedTopic

This indicates a strong subject-centric backend model for a learning platform.

## 8. AI, Study, and Analytics Features

### AI assistant context and service
Files:
- `src/context/AIContext.jsx`
- `src/services/aiService.js`
- `src/services/chatService.js`
- `src/services/chatFileService.js`
- `src/services/skillDNAService.js`

Features represented in the codebase:
- AI tutor/chat assistant
- skill DNA analysis
- learning recommendations
- personalized roadmap generation
- adaptive learning suggestions
- explanation generation
- weak-topic targeting

### Analytics service
File: `src/services/analyticsService.js`

Likely supports:
- learner performance tracking
- subject mastery analytics
- progress trends
- exam preparation metrics
- dashboard widgets

### Study planner service
File: `src/services/studyPlannerService.js`

This likely manages:
- sessions
- daily plan scheduling
- lesson tasks
- revision cycles

## 9. Marketplace, Skills, Community, and Messaging

The app includes a social-learning and exchange layer.

### Skill exchange and collaboration data
Files:
- `src/data/skillExchanges.js`
- `src/data/mockSkillExchange.js`
- `src/data/skillExchangeUsers.js`
- `src/services/skillExchangeService.js`
- `src/services/exchangeGoalService.js`
- `src/services/messageService.js`
- `src/services/meetingService.js`

Likely domain entities:
- skill exchange offers
- user profiles for exchange network
- peer messaging
- conversation threads
- meeting scheduling and sessions
- goals / matching logic

### Community model
Files:
- `src/data/community.js`
- `src/pages/Community/CommunityPage.jsx`

Likely includes:
- channels / groups
- posts / conversations
- community engagement data

## 10. Immersive Lab / XR / Simulation Domain

Files:
- `src/data/xrModels.js`
- `src/data/arObjects.js`
- `src/services/xrService.js`
- `src/services/xrSessionService.js`
- `src/services/labService.js`
- `src/services/labSimulationService.js`
- `src/services/imageTo3DService.js`
- `src/services/labProgressService.js`
- `src/services/labReportService.js`
- `src/services/xrProgressService.js`
- `src/services/xrCapabilityService.js`

Data represented:
- XR objects / 3D models
- lab simulations
- assessments / reports
- learner progress inside labs
- interactive educational scenes

Example entity in `src/data/xrModels.js`:
- `api-gateway`, `database`, `load balancer`, `microservice topology` etc.

This indicates a backend-friendly domain with:
- immersive learning assets
- experiments and tasks
- skill graph or concept graph

## 11. User Roles and Profiles

The code models at least these user roles:
- Student / Learner
- Parent / Guardian
- Teacher / Instructor (implied by course data, not full auth flow yet)
- Community peer / exchange partner

Role-specific flows:
- parent login and parent dashboard
- learner dashboard
- skill marketplace messaging

## 12. Mock Backend Pattern Observed in the App

The current implementation is not connected to a real backend. Instead, it behaves like a frontend-only product with simulated services.

Common patterns:
- async functions with `setTimeout(..., 300)` or `500`
- saving to localStorage as placeholder persistence
- static JSON objects in `src/data`
- service classes that fake CRUD operations and subscription notifications

This is ideal for a backend design because the client already defines realistic business domains.

## 13. Data Entities to Model in the Real Backend

### User
Required fields or expected fields:
- id
- name
- email
- username
- avatar
- title
- bio
- role
- learnerType
- phone
- isParent
- studentUsername
- studentName

### LearnerProfile
- id
- name
- username
- learnerType
- education
- goals
- preferences
- weakTopics
- upcomingTests
- todayLessons
- skills
- learningGoalsList
- learningTimeline
- parentCompanion
- sageAISettings

### Course
- id
- title
- category
- instructor
- rating
- studentsEnrolled
- duration
- difficulty
- thumbnail
- description
- progress
- modules[]
- prerequisites[]

### Module
- id
- title
- duration
- completed

### Subject
- id
- name
- educationType
- class
- board
- medium
- description
- progress
- targetScore
- difficulty
- syllabusCoverage
- hasInteractiveLab
- aiEnabled

### Achievement / Mission / XP
- id
- title
- rewardXp
- progress
- completed
- category
- source

### SkillExchange
- id
- userId
- skillOffered
- skillWanted
- status
- message
- matchedUserId

### Conversation / Message
- id
- conversationId
- senderId
- receiverId
- text
- timestamp
- seen

### ParentCompanion
- parentName
- email
- studentUsername
- studentName
- notifications
- progressSummary

## 14. Suggested Backend Domain Structure

A future backend can be organized into modules like:

1. Auth Module
   - register
   - login
   - parent registration
   - session management
   - JWT / refresh token flow

2. User & Learner Module
   - update learner profile
   - switch profile type
   - learning goals CRUD
   - preferences and onboarding

3. Course Module
   - list courses by learner type
   - course details
   - module completion tracking
   - topic progress

4. Subject Module
   - curriculum topics
   - weak-topic tracking
   - AI recommended next topics

5. AI Tutor Module
   - chat sessions
   - prompt history
   - recommendations and study guidance
   - personalization context

6. Gamification Module
   - daily missions
   - points and streaks
   - achievements
   - level progression

7. Skill Exchange Module
   - offers / wants
   - matches
   - messages
   - meetings

8. Lab / XR Module
   - lab sessions
   - XR model assignments
   - progress and reports

9. Analytics Module
   - dashboard stats
   - learning trend analytics
   - subject performance summaries

## 15. Example API Endpoint Ideas

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/parent/register`
- POST `/api/auth/parent/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Learners
- GET `/api/learners/:id`
- PATCH `/api/learners/:id/profile`
- GET `/api/learners/:id/goals`
- POST `/api/learners/:id/goals`
- PATCH `/api/learners/:id/goals/:goalId`
- DELETE `/api/learners/:id/goals/:goalId`
- GET `/api/learners/:id/analytics`

### Courses
- GET `/api/courses?learnerType=college&category=All`
- GET `/api/courses/:id`
- PATCH `/api/courses/:id/modules/:moduleId/progress`

### Subjects
- GET `/api/subjects?educationType=school`
- GET `/api/subjects/:id`
- PATCH `/api/subjects/:id/progress`

### AI
- GET `/api/ai/chat/sessions`
- POST `/api/ai/chat/sessions`
- POST `/api/ai/chat/:sessionId/messages`
- GET `/api/ai/recommendations/:learnerId`

### Gamification
- GET `/api/gamification/:learnerId/summary`
- GET `/api/gamification/:learnerId/missions`
- POST `/api/gamification/:learnerId/missions/:missionId/complete`
- GET `/api/gamification/:learnerId/achievements`

### Skill Exchange
- GET `/api/exchanges?userId=:id`
- POST `/api/exchanges`
- GET `/api/exchanges/:id/messages`
- POST `/api/exchanges/:id/messages`
- POST `/api/exchanges/:id/match`

### Parent
- GET `/api/parents/:studentUsername/summary`
- PATCH `/api/parents/:studentUsername/preferences`

## 16. Database Design Recommendations

Suggested database choices:
- PostgreSQL for relational data
- Redis for sessions / caching / leaderboard / token store
- Optional object storage for uploads, avatars, lab assets

Suggested tables:
- users
- learners
- learner_profiles
- education_records
- subjects
- courses
- course_modules
- learner_course_progress
- learner_subject_progress
- achievements
- missions
- learner_xp_events
- skill_exchange_offers
- conversations
- messages
- parent_companion_profiles
- ai_chat_sessions
- ai_messages
- xr_lab_sessions
- lab_reports

## 17. Business Logic Observations from the Code

From the app, the backend should support:
- tracking course/module completion
- calculating learner level and XP from activities
- recognizing achievements based on thresholds
- scheduling study plans and reminders
- storing parent-child learning progress
- recommending next best actions based on weak topics
- supporting peer skill matches and messages
- storing lab simulation results and progress
- personalizing AI tutor responses using learner profile + weak topics + goals

## 18. Summary

This project is essentially a learning platform MVP with a rich educational domain model and a full UX specification already designed on the frontend. The backend should be built around:
- user identity and role management
- learner profile personalization
- course and subject progression
- AI tutor and recommendation engine
- achievements and XP economy
- peer exchange and messaging
- parent dashboards and tracking
- XR/lab progress data

This file is intended to be passed to another AI or backend planning agent to generate a production-ready backend architecture, API design, and database schema.

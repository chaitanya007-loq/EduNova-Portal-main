const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnvironment = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (missingEnvironment.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvironment.join(', ')}`);
  process.exit(1);
}

const prisma = require('./config/db');
const { initSocket } = require('./socket/socketServer');

const app = express();
const server = http.createServer(app);

// --------------- Socket.IO Setup ---------------
const io = initSocket(server);

// --------------- Middleware ---------------
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = new Set([
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]);

    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin is not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------- Security Rate Limiting ---------------
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/otp', authLimiter);

// --------------- API Routes ---------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/exchanges', require('./routes/exchanges'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/learners', require('./routes/learners'));
app.use('/api/notes', require('./routes/notes'));

// --------------- Health Check ---------------
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
  }

  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'EduNova API is running',
    data: {
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    },
  });
});

// --------------- Error Handling ---------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// --------------- Graceful Shutdown ---------------
const gracefulShutdown = async () => {
  console.log('\n🔌 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// --------------- Start Server ---------------
let PORT = parseInt(process.env.PORT, 10) || 5000;

async function startServer(portToTry) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL connection verified');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }

  server.removeAllListeners('error');

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (portToTry === 5000) {
        console.warn(`⚠️ Port 5000 is in use. Retrying on port 5001...`);
        startServer(5001);
      } else {
        console.error(`❌ Error: Port ${portToTry} is already in use by another process.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  server.listen(portToTry, () => {
    console.log(`🚀 EduNova Backend running on port ${portToTry}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: PostgreSQL via Prisma`);
    console.log(`⚡ Socket.IO initialized for real-time messaging and peer exchange`);
  });
}

startServer(PORT);

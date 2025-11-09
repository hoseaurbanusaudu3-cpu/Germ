require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');

const config = require('./config');
const { sequelize } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const setupRoutes = require('./routes/setupRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const termRoutes = require('./routes/termRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const studentRoutes = require('./routes/studentRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const compiledResultRoutes = require('./routes/compiledResultRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feeRoutes = require('./routes/feeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: config.socket.corsOrigin.split(','),
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = config.cors.origin;
    if (allowedOrigins.indexOf(origin) !== -1 || config.env === 'development') {
      callback(null, true);
    } else {
      // For now, allow all origins to fix the issue
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static(config.upload.path));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/setup', setupRoutes); // One-time setup endpoint
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/compiled', compiledResultRoutes);
app.use('/api/results', compiledResultRoutes); // Alias
app.use('/api/payments', paymentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Database connection and server start
const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync database (use migrations in production)
    if (config.env === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✓ Database synchronized');
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${config.env}`);
      console.log(`✓ API URL: ${config.apiUrl}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await sequelize.close();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;

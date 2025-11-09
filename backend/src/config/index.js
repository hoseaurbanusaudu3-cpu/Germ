require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  apiUrl: process.env.API_URL || 'http://localhost:8080',
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'graceland_db'
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
    expire: process.env.JWT_EXPIRE || '24h',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  
  // File Upload
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
      'http://localhost:3000',
      'https://gra-gm.vercel.app'
    ]
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // School Info
  school: {
    name: process.env.SCHOOL_NAME || 'Graceland Royal Academy Gombe',
    motto: process.env.SCHOOL_MOTTO || 'Wisdom & Illumination',
    principalName: process.env.PRINCIPAL_NAME || 'Mrs. Grace Okoro'
  },
  
  // Socket.io
  socket: {
    corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000,https://gra-gm.vercel.app'
  }
};

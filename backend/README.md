# Graceland Royal Academy - Backend API

Production-ready Node.js + Express backend for the Graceland Royal Academy School Management System.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **User Management**: Admin, Teacher, Class Teacher, Accountant, and Parent roles
- **Academic Management**: Classes, subjects, students, and teacher assignments
- **Score Entry & Compilation**: CA1, CA2, Exam scores with automatic grade calculation
- **Result Management**: Compiled results with approval workflow
- **Payment Processing**: Fee management and payment verification
- **Real-time Notifications**: Socket.io for instant updates
- **CSV Import/Export**: Bulk operations for scores and data
- **PDF Generation**: Professional result cards using Puppeteer
- **Activity Logging**: Comprehensive audit trail
- **File Uploads**: Student photos and payment proofs

## 📋 Prerequisites

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=graceland_user
DB_PASS=your_secure_password
DB_NAME=graceland_db

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production

# CORS
CORS_ORIGIN=http://localhost:3000,https://gra-gm.top
```

### 3. Database Setup

Create MySQL database and user:

```sql
CREATE DATABASE graceland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'graceland_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON graceland_db.* TO 'graceland_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Admin user (email: admin@gra.edu.ng, password: admin123)
- Sample teachers, classes, subjects, students
- Sample academic session and terms

### 6. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   └── index.js          # Application entry point
├── uploads/              # File uploads directory
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔐 API Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gra.edu.ng",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Sessions & Terms
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id/activate` - Activate session
- `GET /api/terms` - List terms
- `POST /api/terms` - Create term
- `PUT /api/terms/:id/activate` - Activate term

### Classes & Subjects
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject
- `POST /api/class-subjects` - Assign teacher to subject

### Students
- `GET /api/students` - List students (with filters)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/:id/photo` - Upload student photo
- `POST /api/students/:id/link-parent` - Link parent to student

### Scores
- `GET /api/scores` - Get scores (with filters)
- `GET /api/scores/class/:classId/students` - Get class students for score entry
- `POST /api/scores/bulk` - Bulk save scores
- `POST /api/scores/submit` - Submit scores (lock for editing)
- `GET /api/scores/export` - Export scores to CSV
- `POST /api/scores/import` - Import scores from CSV

### Compiled Results
- `GET /api/compiled/:classId` - Get compiled results for class
- `POST /api/compiled/:classId/save` - Save compiled result
- `POST /api/compiled/:classId/submit` - Submit for approval
- `GET /api/results/pending` - Get pending approvals (Admin)
- `POST /api/results/:id/approve` - Approve result (Admin)
- `POST /api/results/:id/reject` - Reject result (Admin)
- `GET /api/results/student/:studentId` - Get student result
- `GET /api/results/student/:studentId/pdf` - Download result as PDF

### Payments
- `GET /api/fees` - Get fee structures
- `POST /api/fees` - Create fee structure
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment
- `GET /api/payments/pending` - Get pending payments
- `POST /api/payments/:id/verify` - Verify payment
- `POST /api/payments/:id/reject` - Reject payment

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/send` - Send notification (Admin)
- `PUT /api/notifications/:id/read` - Mark as read

### Reports
- `GET /api/reports/payments` - Payment reports
- `GET /api/reports/class-performance` - Class performance report
- `GET /api/activity-logs` - Activity logs (Admin)

## 🔒 Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, approvals |
| **Teacher** | Score entry for assigned subjects |
| **Class Teacher** | Score compilation, class management |
| **Accountant** | Payment processing, fee management |
| **Parent** | View children's results and payments |

## 📊 Score Validation Rules

- **CA1**: 0-20 marks
- **CA2**: 0-20 marks
- **Exam**: 0-60 marks
- **Total**: Auto-calculated (CA1 + CA2 + Exam)
- **Grade**: Auto-assigned based on total
  - A: 80-100
  - B: 70-79
  - C: 60-69
  - D: 50-59
  - E: 40-49
  - F: 0-39

## 🔄 Workflow

### Score Entry Workflow
1. Teacher enters scores (draft status)
2. Teacher submits scores (locked for editing)
3. Class teacher compiles all subject scores
4. Class teacher submits for approval
5. Admin reviews and approves/rejects
6. Parent can view approved results

### Payment Workflow
1. Parent/Accountant records payment
2. Payment pending verification
3. Accountant verifies payment
4. Balance automatically updated

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t graceland-backend .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name graceland-api \
  graceland-backend
```

## 🚀 Deployment

### Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add all .env variables
4. Add MySQL database (or use external)
5. Deploy

### Railway.app

1. Create new project
2. Add MySQL database
3. Add Node.js service
4. Connect repository
5. Configure environment variables
6. Deploy

### DigitalOcean VPS

```bash
# SSH into server
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install mysql-server

# Clone repository
git clone https://github.com/yourusername/graceland-backend.git
cd graceland-backend/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env

# Install PM2
npm install -g pm2

# Start application
pm2 start src/index.js --name graceland-api

# Setup PM2 startup
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure Nginx (see DEPLOYMENT.md)

# Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.gra-gm.top
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USER` | Database user | - |
| `DB_PASS` | Database password | - |
| `DB_NAME` | Database name | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_EXPIRE` | Access token expiry | 24h |
| `CORS_ORIGIN` | Allowed origins | * |

## 🔧 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and credentials are correct in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill process using port 5000

### Puppeteer Issues
```
Error: Failed to launch the browser process
```
**Solution**: Install Chromium dependencies:
```bash
sudo apt-get install -y chromium-browser
```

## 📞 Support

For issues and questions:
- Email: support@gra-gm.top
- Documentation: See DEPLOYMENT.md and API_MAPPING.md

## 📄 License

MIT License - Graceland Royal Academy Gombe

## 👥 Credits

Developed for Graceland Royal Academy Gombe

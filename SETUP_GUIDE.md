# 🚀 Quick Setup Guide
**Graceland Royal Academy - School Management System**

## ✅ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL or PostgreSQL database
- Git

---

## 📦 Installation Steps

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend (.env.local) - Already Created ✅
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

#### Backend (backend/.env) - Update These Values
```env
# Database Configuration
DB_DIALECT=mysql                    # or 'postgres' for PostgreSQL
DB_HOST=localhost
DB_PORT=3306                        # or 5432 for PostgreSQL
DB_USER=your_database_user          # ⚠️ CHANGE THIS
DB_PASS=your_database_password      # ⚠️ CHANGE THIS
DB_NAME=graceland_db

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production  # ⚠️ CHANGE THIS
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production  # ⚠️ CHANGE THIS
```

### 3. Setup Database

#### Option A: MySQL
```bash
# Create database
mysql -u root -p
CREATE DATABASE graceland_db;
CREATE USER 'graceland_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON graceland_db.* TO 'graceland_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE graceland_db;
CREATE USER graceland_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE graceland_db TO graceland_user;
\q
```

### 4. Initialize Database

```bash
cd backend

# Sync database (creates tables)
npm run dev
# Wait for "✓ Database synchronized" message
# Press Ctrl+C to stop

# Create initial admin user
npm run setup-admin
# Follow the prompts to create admin account
```

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Expected Output:**
```
✓ Database connection established successfully
✓ Database synchronized
✓ Server running on port 8080
✓ Environment: development
✓ API URL: http://localhost:8080
```

#### Terminal 2 - Frontend
```bash
npm run dev
```
**Expected Output:**
```
VITE v6.3.5  ready in 1685 ms
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

---

## 🎯 First Login

1. Open browser to http://localhost:3000
2. Click "Portal Login"
3. Use the admin credentials you created with `npm run setup-admin`
4. Default role: **Admin**

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
1. Check if MySQL/PostgreSQL is running
2. Verify database credentials in `backend/.env`
3. Ensure database exists

### Issue: "Port 8080 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Issue: "Port 3000 already in use"
**Solution:**
Change port in `vite.config.ts`:
```ts
server: {
  port: 3001,  // Change to any available port
}
```

### Issue: "No admin user found"
**Solution:**
```bash
cd backend
npm run setup-admin
```

### Issue: "CORS error"
**Solution:**
Add your frontend URL to `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

## 📚 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run tsc          # TypeScript type checking
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run setup-admin  # Create/reset admin user
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm test             # Run tests
```

---

## 🎓 User Roles & Access

### Admin
- Full system access
- User management
- Class & subject management
- Fee management
- Result approval
- System settings

### Teacher
- Score entry
- Result compilation
- Class management
- Student records (assigned classes)

### Accountant
- Fee management
- Payment processing
- Financial reports
- Receipt verification

### Parent
- View student results
- Payment history
- Fee payment
- Notifications

---

## 🔐 Default Admin Credentials

**Created during setup:**
- Email: As specified during `npm run setup-admin`
- Password: As specified during `npm run setup-admin`
- Role: Admin

**⚠️ Important:** Change default credentials after first login!

---

## 📱 Testing the System

### 1. Test Authentication
- [ ] Login with admin credentials
- [ ] Logout
- [ ] Change password

### 2. Test Admin Functions
- [ ] Create a teacher user
- [ ] Create a class
- [ ] Create a subject
- [ ] Create a student

### 3. Test Teacher Functions
- [ ] Login as teacher
- [ ] Enter scores
- [ ] Compile results

### 4. Test Accountant Functions
- [ ] Login as accountant
- [ ] Set fees
- [ ] Record payment

### 5. Test Parent Functions
- [ ] Login as parent
- [ ] View student results
- [ ] View payment history

---

## 🌐 Production Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_SOCKET_URL=https://your-backend-url.com
   ```

### Backend (Render/Railway/Heroku)
1. Push to Git repository
2. Connect to deployment platform
3. Set environment variables (all from backend/.env)
4. Deploy
5. Run migrations: `npm run migrate`
6. Create admin: `npm run setup-admin`

---

## 📞 Support

### Documentation
- `README.md` - Overview
- `QUICK_REFERENCE.md` - Quick commands
- `API_ENDPOINTS_REFERENCE.md` - API documentation
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full system audit
- `PROJECT_RECOVERY_SUMMARY.md` - Recent fixes

### Need Help?
Check the documentation files above or review the code comments.

---

## ✅ Setup Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed (frontend & backend)
- [ ] Database created
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] Admin user created
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Successfully logged in as admin
- [ ] Tested basic functionality

---

**Setup Time:** ~15-20 minutes  
**Status:** Ready for development! 🎉

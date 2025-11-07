# 🚀 Graceland Backend - Quick Start Guide

## Get Running in 5 Minutes!

### Step 1: Install (1 minute)
```bash
cd backend
npm install
```

### Step 2: Configure (1 minute)
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=graceland_db
JWT_SECRET=change_this_secret
JWT_REFRESH_SECRET=change_this_too
```

### Step 3: Database (2 minutes)
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE graceland_db"

# Or import schema
mysql -u root -p graceland_db < graceland_schema.sql

# Seed data
npm run seed
```

### Step 4: Start (1 minute)
```bash
npm run dev
```

✅ **Server running on http://localhost:5000**

### Step 5: Test
**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gra.edu.ng","password":"admin123"}'
```

**Or use Postman:**
1. Import `Graceland_API.postman_collection.json`
2. Login with: admin@gra.edu.ng / admin123
3. Test endpoints!

---

## 🎯 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gra.edu.ng | admin123 |
| Teacher | john.okafor@gra.edu.ng | admin123 |
| Accountant | ahmed.bello@gra.edu.ng | admin123 |
| Parent | grace.adeyemi@gmail.com | admin123 |

---

## 📚 Key Endpoints

```bash
# Health check
GET /health

# Login
POST /api/auth/login

# Get students
GET /api/students

# Create student
POST /api/students

# Upload photo
POST /api/students/:id/photo

# Bulk save scores
POST /api/scores/bulk

# Download result PDF
GET /api/results/student/:studentId/pdf
```

---

## 🐳 Docker Quick Start

```bash
docker-compose up -d
```

That's it! Everything runs in containers.

---

## 🌐 Deploy to Render (10 minutes)

1. Push to GitHub
2. Go to render.com
3. New Web Service → Connect repo
4. Add environment variables from `.env`
5. Deploy!

**Done!** Your API is live.

---

## 📖 Full Documentation

- **README.md** - Complete guide
- **DEPLOYMENT.md** - Deployment options
- **SETUP_INSTRUCTIONS.md** - Detailed setup
- **IMPLEMENTATION_COMPLETE.md** - Full feature list

---

## 🆘 Quick Troubleshooting

**Can't connect to database?**
```bash
sudo systemctl start mysql
```

**Port 5000 in use?**
```bash
# Change PORT in .env
PORT=3000
```

**Module not found?**
```bash
npm install
```

---

## ✅ You're Ready!

The backend is **100% complete** with:
- ✅ 76 API endpoints
- ✅ JWT authentication
- ✅ Role-based access
- ✅ PDF generation
- ✅ CSV import/export
- ✅ Real-time notifications
- ✅ Complete documentation

**Just deploy and go live!** 🚀

---

*Need help? Check the full documentation in README.md*

# 🎓 Graceland Royal Academy - School Management System

A comprehensive school management system with frontend (React + Vite) and backend (Node.js + Express + MySQL).

## 🚀 Quick Start

### Development Mode

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and update database credentials
npm install
npm run dev
# Runs on http://localhost:8080
```

**Frontend:**
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

### Docker Mode

```bash
docker-compose -f docker-compose.frontend.yml up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## 📋 Configuration

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
REACT_APP_SOCKET_URL=http://localhost:8080
```

**Backend (.env):**
```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=graceland_db
JWT_SECRET=your_secret_key
```

## 📚 Documentation

- **[Quick Reference](QUICK_REFERENCE.md)** - Quick start and troubleshooting
- **[API Reference](API_ENDPOINTS_REFERENCE.md)** - Complete API endpoint list

## ✅ System Status

- ✅ Port: 8080 (unified)
- ✅ CORS: Configured
- ✅ Socket.io: Ready
- ✅ Docker: Configured
- ✅ No duplicates
- 🟢 Ready for testing

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui  
**Backend:** Node.js, Express, MySQL, Sequelize, Socket.io  
**Deployment:** Docker, Nginx

## 📞 Support

Check the documentation files above for detailed guides and examples.

**Original Design:** [Figma](https://www.figma.com/design/RHmdPy9ziU3PhOZ89TMa9L/School-Management-System-Design)
# 🚀 Deployment Guide - Graceland Royal Academy

## Overview
This guide will help you deploy both the frontend and backend of your school management system.

---

## 📦 Part 1: Deploy Backend (Render)

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub account

### Step 2: Create MySQL Database
1. In Render dashboard, click **"New +"** → **"PostgreSQL"** 
   *(Note: Render's free tier uses PostgreSQL, not MySQL)*
2. **OR** use an external MySQL service like:
   - **PlanetScale** (free tier) - https://planetscale.com
   - **Railway** (free trial) - https://railway.app
   - **Aiven** (free tier) - https://aiven.io

### Step 3: Deploy Backend Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `hoseaurbanusaudu3-cpu/Germ`
3. Configure the service:
   - **Name:** `graceland-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=8080
DATABASE_URL=<your_database_connection_string>
JWT_SECRET=<generate_random_string_32_chars>
JWT_REFRESH_SECRET=<generate_random_string_32_chars>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=https://your-netlify-site.netlify.app
SOCKET_CORS_ORIGIN=https://your-netlify-site.netlify.app
SCHOOL_NAME=Graceland Royal Academy Gombe
SCHOOL_ADDRESS=Behind Hakimi Palace, Opposite NNPC Depot, Tunfure, Gombe
SCHOOL_EMAIL=gracelandroyalacademy09@gmail.com
SCHOOL_MOTTO=Wisdom & Illumination
PRINCIPAL_NAME=Orogun Glory Ejiro
```

**To generate JWT secrets:**
- Open terminal and run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Or use: https://randomkeygen.com/

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://graceland-backend.onrender.com`)

---

## 🌐 Part 2: Deploy Frontend (Netlify)

### Step 1: Create Netlify Account
1. Go to **https://app.netlify.com**
2. Sign up with **GitHub**
3. Authorize Netlify

### Step 2: Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select repository: `hoseaurbanusaudu3-cpu/Germ`
4. Configure build settings:
   - **Branch:** `main`
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Step 3: Add Environment Variables
Click **"Show advanced"** → **"New variable"**:

```
VITE_API_BASE_URL=https://graceland-backend.onrender.com/api
VITE_SOCKET_URL=https://graceland-backend.onrender.com
```

*(Replace with your actual Render backend URL)*

### Step 4: Deploy
1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. Your site will be live at: `https://random-name-123.netlify.app`

### Step 5: Update Backend CORS
1. Go back to **Render dashboard**
2. Open your backend service
3. Update `CORS_ORIGIN` environment variable with your Netlify URL
4. Save and redeploy

---

## ✅ Verification

### Test Backend
Visit: `https://your-backend.onrender.com/api/health`
Should return: `{"status":"ok"}`

### Test Frontend
1. Visit your Netlify URL
2. Try to login (default credentials should be in your seed data)
3. Check browser console for any errors

---

## 🔧 Troubleshooting

### Backend Issues
- **Database connection failed:** Check DATABASE_URL format
- **CORS errors:** Ensure CORS_ORIGIN includes your Netlify URL
- **Port errors:** Render uses PORT environment variable automatically

### Frontend Issues
- **API not connecting:** Check VITE_API_BASE_URL in Netlify
- **Build failed:** Check Node version (should be 18+)
- **404 errors:** Ensure `netlify.toml` has redirect rules

---

## 📝 Post-Deployment

### 1. Custom Domain (Optional)
- **Netlify:** Settings → Domain management → Add custom domain
- **Render:** Settings → Custom domain

### 2. Database Setup
Run migrations and seed data:
```bash
# SSH into Render or use Render Shell
npm run migrate
npm run seed
```

### 3. Monitor Logs
- **Render:** Click on your service → Logs tab
- **Netlify:** Site → Deploys → Deploy log

---

## 🎉 You're Live!

Your school management system is now deployed and accessible worldwide!

**Frontend:** https://your-site.netlify.app  
**Backend:** https://your-backend.onrender.com

---

## 💡 Tips

1. **Free tier limitations:**
   - Render: Spins down after 15 min of inactivity (first request may be slow)
   - Netlify: 100GB bandwidth/month

2. **Keep services active:**
   - Use a service like **UptimeRobot** to ping your backend every 5 minutes

3. **Environment variables:**
   - Never commit `.env` files to GitHub
   - Always use platform-specific environment variable settings

---

## 📞 Need Help?

Check the logs in both Render and Netlify dashboards for detailed error messages.

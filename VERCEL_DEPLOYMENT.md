# 🚀 Vercel Deployment Guide - Simple Steps

## ✅ What You Need
- GitHub account (you already have this)
- Your repository: `hoseaurbanusaudu3-cpu/Germ`

---

## 📋 Step-by-Step Deployment

### Step 1: Go to Vercel
1. Open: https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find your repository: `hoseaurbanusaudu3-cpu/Germ`
3. Click **"Import"**

### Step 3: Configure Project
Vercel will auto-detect settings. Just verify:
- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

*(We'll update these later with your backend URL)*

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site will be live! 🎉

---

## 🔗 Your URLs

After deployment, you'll get:
- **Frontend URL:** `https://your-project.vercel.app`
- You can connect your custom domain `gra-gm.top` later

---

## ⚠️ Important: Backend Deployment

**Note:** Vercel is primarily for frontend. For the backend (Node.js + MySQL), you have two options:

### Option A: Keep Backend Separate
- Deploy backend on Railway or Render
- Connect frontend to backend via environment variables

### Option B: Use Vercel Serverless Functions (Advanced)
- Requires restructuring backend code
- Not recommended for complex apps with MySQL

**Recommendation:** Deploy frontend on Vercel, backend on Railway (I'll help you with this after frontend is live)

---

## 🎯 Next Steps After Frontend Deployment

1. ✅ Frontend deployed on Vercel
2. ⏭️ Deploy backend (I'll guide you)
3. ⏭️ Connect frontend to backend
4. ⏭️ Add custom domain `gra-gm.top`

---

## 🆘 Need Help?

Just let me know where you're stuck and I'll guide you through it!

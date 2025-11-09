# 🚀 Supabase Setup Guide - SUPER SIMPLE!

## ✅ What You'll Do (5 Minutes Total)

1. Create Supabase account (2 min)
2. Create database (1 min)
3. Copy connection string (30 sec)
4. Import schema (1 min)
5. Done! ✅

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with **GitHub** (easiest) or email
4. Verify email if needed

---

## Step 2: Create Your Database (1 minute)

1. Click **"New project"**
2. Fill in:
   - **Name**: `graceland-db` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., **West Africa** or **Europe**)
   - **Pricing Plan**: Select **"Free"** (0$/month forever)
3. Click **"Create new project"**
4. Wait 1-2 minutes for setup

---

## Step 3: Get Your Connection Details (30 seconds)

1. In your project dashboard, click **"Settings"** (gear icon on left)
2. Click **"Database"**
3. Scroll to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created in Step 2

---

## Step 4: Update Your Backend .env File (30 seconds)

Open `backend/.env` and add these lines:

```env
# Supabase PostgreSQL Database
DB_DIALECT=postgres
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password_from_step2
DB_NAME=postgres

# OR simply use the full connection string:
DATABASE_URL=postgresql://postgres:your_password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**Replace:**
- `db.xxxxxxxxxxxxx.supabase.co` with your actual host
- `your_password` with your actual password

---

## Step 5: Import Database Schema (1 minute)

### Option A: Using Supabase SQL Editor (Easiest!)

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open this file on your computer: `backend/graceland_schema.sql`
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for success message ✅

### Option B: Using Command Line (If you prefer)

```bash
cd backend
npm install -g supabase
supabase db push
```

---

## Step 6: Install PostgreSQL Dependencies (30 seconds)

Run this in your backend folder:

```bash
cd backend
npm install
```

This will install the `pg` and `pg-hstore` packages we added.

---

## Step 7: Test Your Connection (30 seconds)

```bash
cd backend
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 8080
```

If you see errors, double-check your password and connection details!

---

## 🎉 That's It! You're Done!

Your backend is now connected to Supabase PostgreSQL (free forever).

---

## 📋 Quick Reference

### Your Supabase Dashboard
- **URL**: https://supabase.com/dashboard
- **Database**: Click "Database" → "Tables" to see your data
- **SQL Editor**: Run queries directly
- **API**: Auto-generated REST API (bonus!)

### Environment Variables for Production (Render/Netlify)

When deploying, use these:

```env
NODE_ENV=production
DB_DIALECT=postgres
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

---

## 🆘 Troubleshooting

### "Connection refused"
- Check your password is correct
- Make sure you replaced `[YOUR-PASSWORD]` in connection string

### "SSL required"
- Already configured! The code handles this automatically

### "Database doesn't exist"
- Use `postgres` as database name (default for Supabase)

### "Can't find module 'pg'"
- Run: `cd backend && npm install`

---

## 💡 Bonus: Supabase Features You Get FREE

- ✅ **Database**: 500 MB PostgreSQL
- ✅ **Auto-generated REST API**: Access your data via API
- ✅ **Real-time subscriptions**: Live data updates
- ✅ **Authentication**: Built-in user auth (if needed later)
- ✅ **Storage**: 1 GB file storage
- ✅ **Dashboard**: Visual database management

---

## 🔄 Need Help?

If anything doesn't work:
1. Check your password is correct
2. Make sure you ran `npm install` in backend folder
3. Verify the connection string has no typos
4. Check Supabase project is "Active" (not paused)

That's it! Super simple, right? 😊

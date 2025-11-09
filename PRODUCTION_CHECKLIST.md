# ✅ PRODUCTION DEPLOYMENT CHECKLIST
**Quick verification guide for your deployed system**

---

## 🔴 CRITICAL - DO THESE NOW (5 minutes)

### 1. Update CORS on Render Backend

**Why:** Your Vercel frontend can't communicate with Render backend without this

**Steps:**
1. Go to https://dashboard.render.com
2. Click on `germ-73vn` service
3. Click "Environment" tab
4. Find `CORS_ORIGIN` variable
5. Update to include your Vercel URL:
   ```
   https://your-vercel-app.vercel.app,https://gra-gm.top
   ```
6. Find `SOCKET_CORS_ORIGIN` variable
7. Update the same way
8. Click "Save Changes" (will auto-redeploy)

**How to find your Vercel URL:**
- Go to https://vercel.com/dashboard
- Click your project
- Copy the URL shown (e.g., `https://germ-abc123.vercel.app`)

---

### 2. Verify Vercel Environment Variables

**Steps:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Verify these exist:
   ```
   VITE_API_BASE_URL = https://germ-73vn.onrender.com/api
   VITE_SOCKET_URL = https://germ-73vn.onrender.com
   ```
5. If missing or wrong, add/update them
6. Redeploy: Deployments → [Latest] → "Redeploy"

---

### 3. Change JWT Secrets on Render

**Why:** Default secrets are insecure

**Steps:**
1. Generate two strong secrets:
   ```bash
   # Run this twice to get two different secrets
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Go to Render → `germ-73vn` → Environment
3. Update:
   ```
   JWT_SECRET = [paste first generated secret]
   JWT_REFRESH_SECRET = [paste second generated secret]
   ```
4. Save (will redeploy)

---

## 🟡 IMPORTANT - DO THESE TODAY (15 minutes)

### 4. Verify Supabase Connection

**Steps:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Project Settings → Database
4. Copy "Connection string" (URI format)
5. Go to Render → `germ-73vn` → Environment
6. Verify `DATABASE_URL` matches the connection string
7. Verify `DB_DIALECT=postgres`

---

### 5. Create Production Admin User

**Option A: Via Render Shell**
1. Go to Render → `germ-73vn`
2. Click "Shell" tab
3. Run:
   ```bash
   npm run setup-admin
   ```
4. Follow prompts to create admin

**Option B: Via Supabase SQL Editor**
1. Go to Supabase → SQL Editor
2. Run this (replace with your details):
   ```sql
   INSERT INTO "Users" (
     email, password_hash, role, status, 
     first_name, last_name, created_at, updated_at
   ) VALUES (
     'admin@gra-gm.top',
     '$2a$10$...',  -- Use bcrypt to hash your password
     'admin',
     'active',
     'Admin',
     'User',
     NOW(),
     NOW()
   );
   ```

---

### 6. Test Production Login

**Steps:**
1. Open your Vercel URL in browser
2. Click "Portal Login"
3. Enter admin credentials
4. Should successfully log in
5. Check browser console for errors

**If login fails:**
- Check browser console for CORS errors
- Verify Render logs for database connection
- Confirm JWT secrets are set

---

## 🟢 RECOMMENDED - DO THIS WEEK

### 7. Run Database Migrations

**Via Render Shell:**
```bash
npm run migrate
```

**Or set auto-sync temporarily:**
```env
NODE_ENV=development
```
(This will auto-create tables on next request)

---

### 8. Test All Features

**Admin Portal:**
- [ ] Create a teacher user
- [ ] Create a class
- [ ] Create a subject
- [ ] Create a student
- [ ] Set fees
- [ ] View reports

**Teacher Portal:**
- [ ] Login as teacher
- [ ] Enter scores
- [ ] Compile results
- [ ] View class list

**Accountant Portal:**
- [ ] Login as accountant
- [ ] Record payment
- [ ] Generate receipt
- [ ] View payment reports

**Parent Portal:**
- [ ] Login as parent
- [ ] View student results
- [ ] View payment history

---

### 9. Set Up Monitoring

**Render:**
- Enable email alerts for service failures
- Set up uptime monitoring

**Vercel:**
- Enable deployment notifications
- Review analytics

**Supabase:**
- Set up database backup schedule
- Enable connection pooling

---

## 📊 VERIFICATION COMMANDS

### Test Backend Health
```bash
curl https://germ-73vn.onrender.com/health
```
**Expected:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-09T..."
}
```

### Test API Endpoint
```bash
curl https://germ-73vn.onrender.com/api/sessions
```
**Expected:** JSON response with sessions data or auth error

### Check Frontend Build
```bash
# Visit your Vercel URL
# Should load without errors
# Check browser console (F12)
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "CORS Error"
```
Access to fetch at 'https://germ-73vn.onrender.com/api/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```
**Fix:** Update CORS_ORIGIN on Render (Step 1 above)

---

### Issue: "Cannot connect to database"
```
SequelizeConnectionError: connect ECONNREFUSED
```
**Fix:** 
1. Check DATABASE_URL on Render
2. Verify Supabase database is running
3. Check Supabase connection string

---

### Issue: "401 Unauthorized" on all API calls
```
{"success": false, "message": "Unauthorized"}
```
**Fix:**
1. Verify JWT_SECRET is set on Render
2. Clear browser localStorage
3. Try logging in again

---

### Issue: "Table doesn't exist"
```
SequelizeDatabaseError: relation "Users" does not exist
```
**Fix:** Run migrations (Step 7 above)

---

## ✅ COMPLETION CHECKLIST

### Critical (Must Do)
- [ ] CORS updated with Vercel URL
- [ ] Vercel environment variables verified
- [ ] JWT secrets changed from defaults
- [ ] Supabase connection verified
- [ ] Production admin user created
- [ ] Login tested successfully

### Important (Should Do)
- [ ] Database migrations run
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Backup strategy configured
- [ ] Error tracking enabled

### Optional (Nice to Have)
- [ ] Custom domain configured
- [ ] SSL certificates verified
- [ ] Performance optimization
- [ ] SEO configuration
- [ ] Analytics set up

---

## 🎯 SUCCESS CRITERIA

Your deployment is successful when:

✅ Frontend loads without errors  
✅ Login works with admin credentials  
✅ API calls succeed (no CORS errors)  
✅ Database queries work  
✅ Real-time features function  
✅ All portals accessible  
✅ No console errors  

---

## 📞 NEED HELP?

### Check These First:
1. **Render Logs:** Dashboard → germ-73vn → Logs
2. **Vercel Logs:** Dashboard → Project → Deployments → Logs
3. **Browser Console:** F12 → Console tab
4. **Supabase Logs:** Dashboard → Logs

### Documentation:
- `PRODUCTION_DEPLOYMENT_STATUS.md` - Detailed deployment guide
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full system analysis
- `API_ENDPOINTS_REFERENCE.md` - API documentation

---

**Estimated Time:** 20-30 minutes for all critical items  
**Status:** Ready to verify! 🚀

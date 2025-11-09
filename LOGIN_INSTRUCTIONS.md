# 🔐 LOGIN INSTRUCTIONS - READ CAREFULLY

## ✅ CORRECT LOGIN CREDENTIALS

```
Email:    admin@gra.edu.ng
Password: admin123
Role:     Admin
```

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ WRONG Email Formats:
- `admin@gra-edu.ng` (hyphen instead of dot)
- `admin[gra.edu.ng]` (brackets - browser autocomplete issue)
- `admin` (missing @gra.edu.ng)
- `admin@graceland.edu.ng` (wrong domain)

### ✅ CORRECT Email:
- `admin@gra.edu.ng` (with DOT between gra and edu)

---

## 📋 STEP-BY-STEP LOGIN PROCESS

### Step 1: Open Application
Go to: https://gra-gm.vercel.app/login

### Step 2: Clear Browser Cache
Press: `Ctrl + Shift + R` (hard refresh)

### Step 3: Fill Login Form
1. **Role:** Select "Admin" from dropdown
2. **Email:** Type exactly: `admin@gra.edu.ng`
3. **Password:** Type: `admin123`

### Step 4: Click Login Button

### Step 5: Verify Success
You should see:
- ✅ "Login successful!" message
- ✅ Redirected to Admin Dashboard
- ✅ No immediate logout

---

## 🔧 IF LOGIN STILL FAILS

### Option 1: Reset Admin Password on Render

1. Go to Render Dashboard: https://dashboard.render.com
2. Click your service: `germ-73vn`
3. Go to "Shell" tab
4. Run: `npm run setup-admin`
5. This will reset the password to `admin123`

### Option 2: Use Setup API Endpoint

Open browser console (F12) and run:
```javascript
fetch('https://germ-73vn.onrender.com/api/setup/create-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log(d));
```

---

## 🎯 AFTER SUCCESSFUL LOGIN

### Test Creating a Class:
1. Navigate to "Create Class" page
2. Fill in:
   - **School Level:** Primary or Secondary
   - **Class Name:** e.g., "JSS 1A"
   - **Capacity:** e.g., 35
3. Click "Create Class"
4. Should see: ✅ "Class created successfully!"
5. Class will be saved to PostgreSQL database
6. Class will appear in "Manage Classes" table

---

## 📊 TROUBLESHOOTING

### Issue: "Invalid credentials"
**Cause:** Wrong email or password
**Solution:** Double-check you're using `admin@gra.edu.ng` (with DOT)

### Issue: "Network Error"
**Cause:** Backend is sleeping or down
**Solution:** Wait 30 seconds for Render to wake up, then try again

### Issue: "Invalid token" after login
**Cause:** Old deployment, browser cache
**Solution:** Hard refresh (`Ctrl + Shift + R`), clear localStorage

### Issue: Logs out immediately after login
**Cause:** Token not being stored correctly
**Solution:** Check browser console for errors, ensure latest deployment

---

## 🚀 DEPLOYMENT STATUS

- **Frontend:** https://gra-gm.vercel.app
- **Backend:** https://germ-73vn.onrender.com
- **Database:** PostgreSQL on Render

### Check Backend Health:
https://germ-73vn.onrender.com/health

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-09T..."
}
```

---

## 📞 SUPPORT

If you continue to experience issues:
1. Clear all browser data (cookies, cache, localStorage)
2. Try in incognito/private mode
3. Try a different browser
4. Check Render logs for backend errors
5. Verify Render service is "Live" (not "Sleeping" or "Failed")

---

**Last Updated:** November 9, 2025
**Version:** 1.0

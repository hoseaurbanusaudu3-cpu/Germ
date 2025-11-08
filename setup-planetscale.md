# PlanetScale Database Setup Guide

## Connection Details Template

After creating your PlanetScale database and password, you'll get these details:

```
Host: aws.connect.psdb.cloud (or similar)
Username: xxxxxxxxxxxxxx
Password: pscale_pw_xxxxxxxxxxxxxx
Database: graceland-db
Port: 3306
```

## For Render Environment Variables

Use these exact variable names in Render:

```
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USER=your_planetscale_username
DB_PASS=your_planetscale_password
DB_NAME=graceland-db
```

## Import Schema to PlanetScale

### Method 1: PlanetScale Web Console (Recommended)
1. Go to your database in PlanetScale
2. Click **"Console"** tab
3. Open `backend/graceland_schema.sql` in a text editor
4. Copy ALL the contents
5. Paste into PlanetScale console
6. Click **"Run"** or press Ctrl+Enter

### Method 2: Using MySQL Client
If you have MySQL client installed:

```bash
mysql -h aws.connect.psdb.cloud -u YOUR_USERNAME -p'YOUR_PASSWORD' --ssl-mode=REQUIRED graceland-db < backend/graceland_schema.sql
```

Replace:
- `YOUR_USERNAME` with your PlanetScale username
- `YOUR_PASSWORD` with your PlanetScale password

## Verify Database Setup

After importing, run this query in PlanetScale Console:

```sql
SHOW TABLES;
```

You should see tables like:
- users
- sessions
- terms
- classes
- subjects
- students
- scores
- etc.

## Next Steps

1. ✅ Database created on PlanetScale
2. ✅ Schema imported
3. ⏭️ Add connection details to Render
4. ⏭️ Deploy backend on Render
5. ⏭️ Run seed data (optional)

## Seed Data (Optional)

After backend is deployed on Render, you can seed initial data:

1. Go to Render dashboard
2. Open your backend service
3. Click **"Shell"** tab
4. Run: `npm run seed`

This will create:
- Default admin user
- Sample sessions and terms
- Sample classes and subjects

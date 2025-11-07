# Graceland Backend - Deployment Guide

Complete deployment instructions for various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database created and accessible
- [ ] SSL certificate ready (for production)
- [ ] Domain/subdomain configured
- [ ] Backup strategy in place
- [ ] Monitoring tools configured

## 🚀 Deployment Options

### Option 1: Render.com (Recommended - Easiest)

**Pros**: Free tier available, automatic deployments, managed MySQL
**Cons**: Cold starts on free tier

#### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create MySQL Database**
   - Dashboard → New → MySQL
   - Name: `graceland-db`
   - Plan: Free or Starter
   - Note the connection details

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     ```
     Name: graceland-api
     Environment: Node
     Region: Choose closest to Nigeria (e.g., Frankfurt)
     Branch: main
     Build Command: npm install
     Start Command: npm start
     Plan: Free or Starter
     ```

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<from-render-mysql>
   DB_PORT=3306
   DB_USER=<from-render-mysql>
   DB_PASS=<from-render-mysql>
   DB_NAME=graceland_db
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   CORS_ORIGIN=https://gra-gm.top,https://www.gra-gm.top
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment
   - Your API will be at: `https://graceland-api.onrender.com`

6. **Run Migrations**
   - Go to Shell tab in Render dashboard
   - Run: `npm run migrate`
   - Run: `npm run seed` (optional)

7. **Custom Domain (Optional)**
   - Settings → Custom Domain
   - Add: `api.gra-gm.top`
   - Update DNS CNAME record

---

### Option 2: Railway.app

**Pros**: Simple deployment, good free tier, automatic SSL
**Cons**: Limited free tier hours

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Dashboard → New Project
   - Deploy from GitHub repo

3. **Add MySQL Database**
   - Add → Database → MySQL
   - Note connection variables

4. **Configure Service**
   - Settings → Environment Variables
   - Add all variables from `.env.example`
   - Use Railway's MySQL connection string

5. **Deploy**
   - Railway auto-deploys on push
   - Get URL from Settings → Domains

6. **Run Migrations**
   - Use Railway CLI or web shell
   ```bash
   railway run npm run migrate
   railway run npm run seed
   ```

---

### Option 3: DigitalOcean Droplet (VPS)

**Pros**: Full control, predictable pricing, good for production
**Cons**: Requires server management

#### Steps:

1. **Create Droplet**
   ```
   Image: Ubuntu 22.04 LTS
   Plan: Basic ($6/month minimum)
   Datacenter: Choose closest region
   Authentication: SSH Key
   ```

2. **Initial Server Setup**
   ```bash
   # SSH into server
   ssh root@your_server_ip

   # Update system
   apt update && apt upgrade -y

   # Create non-root user
   adduser graceland
   usermod -aG sudo graceland
   su - graceland
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version  # Verify
   ```

4. **Install MySQL**
   ```bash
   sudo apt install mysql-server -y
   sudo mysql_secure_installation

   # Create database
   sudo mysql
   ```
   ```sql
   CREATE DATABASE graceland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'graceland_user'@'localhost' IDENTIFIED BY 'strong_password_here';
   GRANT ALL PRIVILEGES ON graceland_db.* TO 'graceland_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Install Git and Clone Repository**
   ```bash
   sudo apt install git -y
   cd /home/graceland
   git clone https://github.com/yourusername/graceland-backend.git
   cd graceland-backend/backend
   ```

6. **Install Dependencies**
   ```bash
   npm install --production
   ```

7. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   # Edit with your production values
   ```

8. **Run Migrations**
   ```bash
   npm run migrate
   npm run seed  # Optional
   ```

9. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start src/index.js --name graceland-api
   pm2 startup systemd
   pm2 save
   ```

10. **Install Nginx**
    ```bash
    sudo apt install nginx -y
    sudo nano /etc/nginx/sites-available/graceland
    ```

    Add configuration:
    ```nginx
    server {
        listen 80;
        server_name api.gra-gm.top;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    Enable site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/graceland /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Install SSL Certificate**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d api.gra-gm.top
    ```

12. **Setup Firewall**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

13. **Setup Automatic Backups**
    ```bash
    # Create backup script
    nano /home/graceland/backup.sh
    ```

    Add:
    ```bash
    #!/bin/bash
    DATE=$(date +%Y%m%d_%H%M%S)
    mysqldump -u graceland_user -p'your_password' graceland_db > /home/graceland/backups/graceland_$DATE.sql
    find /home/graceland/backups -name "*.sql" -mtime +7 -delete
    ```

    Make executable and schedule:
    ```bash
    chmod +x /home/graceland/backup.sh
    mkdir -p /home/graceland/backups
    crontab -e
    # Add: 0 2 * * * /home/graceland/backup.sh
    ```

---

### Option 4: cPanel Hosting (If Node.js Supported)

**Note**: Most cPanel hosts don't support Node.js. Check with your host first.

#### If Supported:

1. **Setup Node.js Application**
   - cPanel → Setup Node.js App
   - Node.js version: 18.x
   - Application root: `/home/username/graceland-backend`
   - Application URL: `api.gra-gm.top`
   - Application startup file: `src/index.js`

2. **Upload Files**
   - Use File Manager or FTP
   - Upload entire backend folder

3. **Configure Environment**
   - Create `.env` file via File Manager
   - Add all environment variables

4. **Install Dependencies**
   - Terminal in cPanel
   ```bash
   cd graceland-backend
   npm install
   ```

5. **Setup MySQL**
   - cPanel → MySQL Databases
   - Create database and user
   - Import `graceland_schema.sql`

6. **Start Application**
   - Node.js App interface
   - Click "Start"

#### If Not Supported:

Deploy backend on Render/Railway and connect frontend on cPanel:
- Backend API: `https://graceland-api.onrender.com`
- Frontend: `https://gra-gm.top` (on cPanel)
- Update CORS to allow cPanel domain

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Security
- Use strong passwords
- Limit database user privileges
- Enable SSL for database connections (production)
- Regular backups

### 3. API Security
- Always use HTTPS in production
- Set proper CORS origins
- Enable rate limiting
- Keep dependencies updated

### 4. Server Security (VPS)
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Setup fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

---

## 📊 Monitoring

### PM2 Monitoring (VPS)
```bash
pm2 monit              # Real-time monitoring
pm2 logs graceland-api # View logs
pm2 status             # Check status
```

### Health Check Endpoint
```bash
curl https://api.gra-gm.top/health
```

### Setup Uptime Monitoring
- Use services like UptimeRobot or Pingdom
- Monitor: `https://api.gra-gm.top/health`
- Alert on downtime

---

## 🔄 Updates and Maintenance

### Updating Application (VPS)
```bash
cd /home/graceland/graceland-backend/backend
git pull origin main
npm install
npm run migrate  # If new migrations
pm2 restart graceland-api
```

### Database Backup (Manual)
```bash
mysqldump -u graceland_user -p graceland_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u graceland_user -p graceland_db < backup_20241107.sql
```

---

## 🐛 Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs graceland-api

# Check environment
pm2 env graceland-api

# Restart
pm2 restart graceland-api
```

### Database Connection Error
```bash
# Test MySQL connection
mysql -u graceland_user -p -h localhost graceland_db

# Check if MySQL is running
sudo systemctl status mysql
```

### Port Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## 📞 Support

For deployment issues:
- Check logs first
- Verify environment variables
- Test database connection
- Check firewall rules

---

## ✅ Post-Deployment Checklist

- [ ] API accessible via HTTPS
- [ ] Database migrations completed
- [ ] Admin user can login
- [ ] File uploads working
- [ ] PDF generation working
- [ ] Socket.io connections working
- [ ] CORS configured correctly
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] SSL certificate valid
- [ ] Documentation updated with production URLs

---

## 🌐 DNS Configuration

For custom domain `api.gra-gm.top`:

**A Record** (VPS):
```
Type: A
Name: api
Value: <your_server_ip>
TTL: 3600
```

**CNAME Record** (Render/Railway):
```
Type: CNAME
Name: api
Value: <platform-provided-url>
TTL: 3600
```

---

## 💰 Cost Estimates

| Platform | Monthly Cost | Best For |
|----------|--------------|----------|
| Render Free | $0 | Testing/Demo |
| Render Starter | $7 | Small production |
| Railway Free | $0 (500 hrs) | Testing |
| Railway Pro | $5 | Small production |
| DigitalOcean | $6-12 | Full control |
| cPanel + Render | $3-5 | Hybrid setup |

---

**Recommended for Production**: DigitalOcean VPS ($12/month) or Render Starter ($7/month)

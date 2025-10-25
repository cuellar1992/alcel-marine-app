# Alcel Marine App - Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Security
- [x] 2FA (Two-Factor Authentication) implemented with Google Authenticator
- [x] JWT token authentication with refresh tokens
- [x] Password hashing with bcrypt
- [x] Helmet.js security headers
- [x] Rate limiting on API endpoints
- [x] Role-based access control (Admin/User)
- [x] Trusted device management (45-day expiration)
- [x] Input validation and sanitization
- [x] Environment variables protected (.env in .gitignore)

### ✅ Features
- [x] User authentication & authorization
- [x] User management (admin only)
- [x] Marine Claims management
- [x] Marine Non-Claims (Jobs) management
- [x] TimeSheet tracking per claim/job
- [x] Dashboard with KPIs and analytics
- [x] Client management (shared between Claims and Non-Claims)
- [x] Port management
- [x] Job type management
- [x] Advanced filtering and search
- [x] Excel export functionality
- [x] Data caching system (5-minute TTL)
- [x] Auto-refresh on data mutations

### ⚠️ Before Deployment

1. **Environment Variables** - Update all production values
2. **Database** - Ensure MongoDB is accessible
3. **Secrets** - Generate strong JWT secrets
4. **Super Admin** - Create initial admin account
5. **CORS** - Configure allowed origins
6. **Build** - Test production build
7. **Security** - NEVER commit `.env` files to Git (use `.env.example` instead)

---

## Environment Setup

### 🔒 Important Security Note

**NEVER commit `.env` files to Git!** Always use `.env.example` as a template.

To set up your environment:
1. Copy `.env.example` to `.env`
2. Fill in your actual credentials
3. Verify `.env` is listed in `.gitignore`

### 1. Frontend Environment Variables

Create `.env` in root directory (copy from `.env.example`):

```bash
VITE_API_URL=https://your-production-api.com/api
```

### 2. Backend Environment Variables

Create `server/.env` (copy from `server/.env.example`):

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration
# ⚠️ Replace with your actual MongoDB Atlas credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration (GENERATE NEW SECRETS!)
# Generate using: openssl rand -base64 32
JWT_SECRET=your-production-jwt-secret-here
JWT_REFRESH_SECRET=your-production-refresh-secret-here

# JWT Expiration Times
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Generate Strong Secrets

Run this command to generate secure secrets:

```bash
cd server
node generate-secrets.js
```

Copy the generated secrets to your `server/.env` file.

---

## Database Setup

### 1. MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 free tier available)
3. Configure network access:
   - Add your server's IP address
   - Or add 0.0.0.0/0 (allow from anywhere) - less secure but easier
4. Create a database user with read/write permissions
5. Get your connection string and update `MONGODB_URI` in `.env`

### 2. Create Super Admin Account

After connecting to the database, create the initial admin:

```bash
npm run seed:superadmin
```

This will create:
- **Email:** admin@alcel.com
- **Password:** Admin123!@#
- **Role:** Admin

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = Your backend API URL
6. Deploy!

#### Backend on Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Configure:
   - **Root Directory:** `./`
   - **Start Command:** `npm start`
5. Add all environment variables from `server/.env`
6. Deploy!

### Option 2: DigitalOcean App Platform

1. Go to https://www.digitalocean.com/products/app-platform
2. Create new app from GitHub
3. Configure two components:
   - **Frontend (Static Site):**
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Backend (Node.js):**
     - Run Command: `npm start`
     - Environment Variables: Add all from `server/.env`
4. Deploy!

### Option 3: AWS (EC2 + S3 + MongoDB Atlas)

#### Backend on EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/your-username/alcel-marine-app.git
cd alcel-marine-app

# Install dependencies
npm install

# Create .env file
nano server/.env
# (paste your production environment variables)

# Build frontend
npm run build

# Start backend with PM2
pm2 start npm --name "alcel-api" -- start
pm2 save
pm2 startup
```

#### Frontend on S3 + CloudFront

```bash
# Install AWS CLI
# Configure with your credentials
aws configure

# Deploy frontend
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: VPS (Linux Server)

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Configure Nginx for React app
sudo nano /etc/nginx/sites-available/alcel-marine

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/alcel-marine/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/alcel-marine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Steps

### 1. Verify Deployment

Test these endpoints:

```bash
# Health check
curl https://your-api.com/api/health

# Login
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alcel.com","password":"Admin123!@#"}'
```

### 2. Security Checklist

- [ ] Change default admin password
- [ ] Enable 2FA for all admin accounts
- [ ] Verify JWT secrets are strong and unique
- [ ] Check CORS settings
- [ ] Verify rate limiting is working
- [ ] Test authentication flow
- [ ] Review error messages (no sensitive data exposed)
- [ ] Check HTTPS is enforced
- [ ] **CRITICAL:** Verify .env files are NOT committed to Git
- [ ] Rotate MongoDB credentials if they were exposed
- [ ] Review Git history for leaked secrets (use `git log --all --full-history -- ".env"`)

### 3. Performance Optimization

- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up database indexes
- [ ] Enable caching headers
- [ ] Monitor API response times
- [ ] Set up logging and monitoring

### 4. Backup Strategy

- [ ] Set up automated MongoDB backups
- [ ] Document restore procedures
- [ ] Test backup restoration
- [ ] Store backups securely (encrypted)

---

## Monitoring & Maintenance

### Recommended Tools

1. **Error Tracking:** Sentry (https://sentry.io)
2. **Uptime Monitoring:** UptimeRobot (https://uptimerobot.com)
3. **Performance:** New Relic or DataDog
4. **Logs:** LogRocket or Papertrail

### MongoDB Monitoring

- Set up alerts for:
  - High connection count
  - Slow queries
  - Storage usage
  - CPU/Memory usage

### Application Monitoring

Monitor these metrics:
- API response times
- Error rates
- Authentication failures
- Rate limit hits
- Active user sessions

---

## Troubleshooting

### Common Issues

**Problem:** "Cannot connect to MongoDB"
- **Solution:** Check MongoDB Atlas network access, verify connection string

**Problem:** "CORS error"
- **Solution:** Update `CORS_ORIGIN` in backend .env, verify frontend URL

**Problem:** "JWT token expired"
- **Solution:** Normal behavior - refresh token should handle this automatically

**Problem:** "Rate limit exceeded"
- **Solution:** Adjust rate limits in `server/middleware/rateLimiter.js`

**Problem:** "2FA code not working"
- **Solution:** Verify device time is synchronized (required for TOTP)

---

## Scaling Considerations

### When to Scale

Monitor these indicators:
- Response time > 500ms consistently
- CPU usage > 70% sustained
- Memory usage > 80%
- Database connections maxed out
- Rate limiting triggered frequently

### Scaling Options

1. **Vertical Scaling:** Upgrade server resources
2. **Horizontal Scaling:** Add more server instances (requires load balancer)
3. **Database Scaling:** MongoDB sharding or read replicas
4. **Caching:** Redis for session storage and caching
5. **CDN:** CloudFlare or AWS CloudFront for static assets

---

## Support & Contact

For deployment assistance, contact the development team.

**Version:** 1.0.0
**Last Updated:** October 2025

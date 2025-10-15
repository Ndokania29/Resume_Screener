# 🚀 Deployment Guide - Smart Resume Screener

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **MongoDB**: Local or cloud instance (MongoDB Atlas recommended)
- **Domain**: Optional for production
- **SSL Certificate**: For HTTPS (Let's Encrypt recommended)

## 🔧 Environment Setup

### Backend Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb://localhost:27017/smart_resume
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/smart_resume

# Authentication (CHANGE THIS!)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters

# AI Configuration (Optional - has intelligent fallback)
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# CORS Configuration
FRONTEND_URL=https://yourdomain.com
```

### Frontend Environment Variables

Create `.env` file in `frontend/` directory:

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
# For local development: http://localhost:5000
```

## 🏗️ Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <your-repo-url>
cd Smart_Resume_Checker

# Backend setup
cd backend
npm install
cp env.example .env
# Edit .env with your configuration

# Frontend setup
cd ../frontend
npm install
```

### 2. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:5174`

## 🌐 Production Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### 1. Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
sudo apt-get install -y mongodb

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx
```

#### 2. Deploy Backend

```bash
# Upload code to server
scp -r backend/ user@your-server:/var/www/smart-resume-backend/

# On server
cd /var/www/smart-resume-backend
npm install --production
cp env.example .env
# Edit .env with production values

# Start with PM2
pm2 start src/server.js --name "resume-backend"
pm2 startup
pm2 save
```

#### 3. Deploy Frontend

```bash
# Local build
cd frontend
npm run build

# Upload build to server
scp -r dist/ user@your-server:/var/www/smart-resume-frontend/

# Configure Nginx
sudo nano /etc/nginx/sites-available/smart-resume
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/smart-resume-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smart-resume /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Vercel + Railway Deployment

#### 1. Deploy Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Add environment variables in Railway dashboard
5. Deploy automatically

#### 2. Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

### Option 3: Docker Deployment

#### 1. Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

#### 2. Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: smart_resume
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongodb:27017/smart_resume
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - mongodb
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

```bash
# Deploy with Docker
docker-compose up -d
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Set up MongoDB authentication
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting
- [ ] Enable MongoDB connection encryption
- [ ] Regular security updates

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs resume-backend

# Monitor performance
pm2 monit

# Restart application
pm2 restart resume-backend

# View status
pm2 status
```

### Database Backup

```bash
# MongoDB backup
mongodump --db smart_resume --out /backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db smart_resume --out /backup/$DATE
find /backup -type d -mtime +7 -exec rm -rf {} +
```

## 🚀 Performance Optimization

### Backend Optimizations

1. **Enable Gzip Compression**
2. **Set up Redis Caching**
3. **Database Indexing**
4. **Connection Pooling**

### Frontend Optimizations

1. **Code Splitting**
2. **Image Optimization**
3. **CDN for Static Assets**
4. **Service Worker Caching**

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGO_URI format
   - Verify MongoDB is running
   - Check network connectivity

2. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check API URL in frontend

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

4. **File Upload Errors**
   - Check file size limits
   - Verify multer configuration
   - Check disk space

### Logs and Debugging

```bash
# Backend logs
pm2 logs resume-backend --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity

---

**🎉 Congratulations! Your Smart Resume Screener is now deployed and ready for production use!**

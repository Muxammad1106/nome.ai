# Nome.ai Backend Deployment Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Application Deployment](#application-deployment)
- [Production Configuration](#production-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Overview

This guide covers the complete deployment process for the Nome.ai backend API, including local development setup, staging deployment, and production configuration.

## Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04+ or similar Linux distribution
- **Python**: 3.9 or higher
- **PostgreSQL**: 12 or higher with pgvector extension
- **Redis**: 6.0 or higher (for WebSocket channels)
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 20GB available space
- **AI API Key**: Required for AI-powered customer insights feature

### Software Dependencies
- Docker (optional, for containerized deployment)
- Git
- Nginx (for reverse proxy)
- Supervisor (for process management)

## Environment Setup

### 1. System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3.9 python3.9-venv python3.9-dev
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y redis-server
sudo apt install -y nginx supervisor
sudo apt install -y git curl wget
```

### 2. Python Environment

```bash
# Create application user
sudo useradd -m -s /bin/bash nomeai
sudo usermod -aG sudo nomeai

# Switch to application user
sudo su - nomeai

# Create project directory
mkdir -p /home/nomeai/apps
cd /home/nomeai/apps

# Clone repository
git clone <repository-url> nome-ai-backend
cd nome-ai-backend/backend

# Create virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Environment Variables

Create environment configuration file:

```bash
# Create .env file
cat > .env << EOF
# Django Configuration
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=nome-ai-t5lly.ondigitalocean.app,nomeai.space,localhost

# Database Configuration
DATABASE_URL=postgresql://nomeai:password@localhost:5432/nomeai_prod

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# AI Configuration (Required for AI features)
OPENAI_API_KEY=your-ai-api-key-here

# Media and Static Files
MEDIA_ROOT=/home/nomeai/apps/nome-ai-backend/backend/media
STATIC_ROOT=/home/nomeai/apps/nome-ai-backend/backend/staticfiles

# Security
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO
LOG_FILE=/home/nomeai/apps/nome-ai-backend/backend/logs/django.log
EOF
```

## Database Configuration

### 1. PostgreSQL Setup

```bash
# Switch to postgres user
sudo su - postgres

# Create database and user
psql -c "CREATE DATABASE nomeai_prod;"
psql -c "CREATE USER nomeai WITH PASSWORD 'secure_password_here';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE nomeai_prod TO nomeai;"
psql -c "ALTER USER nomeai CREATEDB;"

# Enable pgvector extension
psql -d nomeai_prod -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Exit postgres user
exit
```

### 2. Database Migration

```bash
# Switch to application user
sudo su - nomeai
cd /home/nomeai/apps/nome-ai-backend/backend
source venv/bin/activate

# Run migrations
python manage.py migrate

# Load initial data
python manage.py loaddata fixtures/*.yaml

# Create superuser
python manage.py createsuperuser
```

## Application Deployment

### 1. Static Files Collection

```bash
# Collect static files
python manage.py collectstatic --noinput

# Set proper permissions
sudo chown -R nomeai:nomeai /home/nomeai/apps/nome-ai-backend/backend/staticfiles
sudo chown -R nomeai:nomeai /home/nomeai/apps/nome-ai-backend/backend/media
```

### 2. Supervisor Configuration

Create supervisor configuration for process management:

```bash
# Create supervisor config
sudo tee /etc/supervisor/conf.d/nomeai-backend.conf << EOF
[program:nomeai-backend]
command=/home/nomeai/apps/nome-ai-backend/backend/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
directory=/home/nomeai/apps/nome-ai-backend/backend
user=nomeai
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/nomeai/apps/nome-ai-backend/backend/logs/gunicorn.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=10
environment=PATH="/home/nomeai/apps/nome-ai-backend/backend/venv/bin"
EOF

# Create logs directory
sudo mkdir -p /home/nomeai/apps/nome-ai-backend/backend/logs
sudo chown -R nomeai:nomeai /home/nomeai/apps/nome-ai-backend/backend/logs

# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start nomeai-backend
```

### 3. Nginx Configuration

Configure Nginx as reverse proxy:

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/nomeai-backend << EOF
server {
    listen 80;
    server_name nome-ai-t5lly.ondigitalocean.app nomeai.space;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nome-ai-t5lly.ondigitalocean.app nomeai.space;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Client Max Body Size
    client_max_body_size 10M;

    # Static Files
    location /static/ {
        alias /home/nomeai/apps/nome-ai-backend/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media Files
    location /media/ {
        alias /home/nomeai/apps/nome-ai-backend/backend/media/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # API Routes
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health Check
    location /health/ {
        proxy_pass http://127.0.0.1:8000/api/;
        access_log off;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/nomeai-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Production Configuration

### 1. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Secure PostgreSQL
sudo -u postgres psql -c "ALTER USER nomeai PASSWORD 'new_secure_password';"
sudo -u postgres psql -c "REVOKE ALL ON SCHEMA public FROM PUBLIC;"
sudo -u postgres psql -c "GRANT ALL ON SCHEMA public TO nomeai;"

# Set proper file permissions
sudo chmod 600 /home/nomeai/apps/nome-ai-backend/backend/.env
sudo chown nomeai:nomeai /home/nomeai/apps/nome-ai-backend/backend/.env
```

### 2. Logging Configuration

```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/nomeai-backend << EOF
/home/nomeai/apps/nome-ai-backend/backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nomeai nomeai
    postrotate
        supervisorctl restart nomeai-backend
    endscript
}
EOF
```

### 3. Backup Configuration

```bash
# Create backup script
sudo tee /home/nomeai/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/nomeai/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="nomeai_prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U nomeai $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Media files backup
tar -czf $BACKUP_DIR/media_$DATE.tar.gz -C /home/nomeai/apps/nome-ai-backend/backend media/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

sudo chmod +x /home/nomeai/backup.sh
sudo chown nomeai:nomeai /home/nomeai/backup.sh

# Add to crontab
(crontab -u nomeai -l 2>/dev/null; echo "0 2 * * * /home/nomeai/backup.sh") | crontab -u nomeai -
```

## Monitoring & Maintenance

### 1. Health Monitoring

```bash
# Create health check script
sudo tee /home/nomeai/health_check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://nome-ai-t5lly.ondigitalocean.app/api/"
LOG_FILE="/home/nomeai/apps/nome-ai-backend/backend/logs/health_check.log"

# Check API health
if curl -f -s $HEALTH_URL > /dev/null; then
    echo "$(date): API is healthy" >> $LOG_FILE
else
    echo "$(date): API is down" >> $LOG_FILE
    # Restart service
    supervisorctl restart nomeai-backend
fi
EOF

sudo chmod +x /home/nomeai/health_check.sh
sudo chown nomeai:nomeai /home/nomeai/health_check.sh

# Add to crontab (check every 5 minutes)
(crontab -u nomeai -l 2>/dev/null; echo "*/5 * * * * /home/nomeai/health_check.sh") | crontab -u nomeai -
```

### 2. Performance Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Create performance monitoring script
sudo tee /home/nomeai/monitor.sh << 'EOF'
#!/bin/bash
LOG_FILE="/home/nomeai/apps/nome-ai-backend/backend/logs/performance.log"

echo "$(date): CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)" >> $LOG_FILE
echo "$(date): Memory Usage: $(free | grep Mem | awk '{printf "%.2f%%", $3/$2 * 100.0}')" >> $LOG_FILE
echo "$(date): Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')" >> $LOG_FILE
EOF

sudo chmod +x /home/nomeai/monitor.sh
sudo chown nomeai:nomeai /home/nomeai/monitor.sh

# Add to crontab (check every hour)
(crontab -u nomeai -l 2>/dev/null; echo "0 * * * * /home/nomeai/monitor.sh") | crontab -u nomeai -
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connectivity
psql -h localhost -U nomeai -d nomeai_prod -c "SELECT 1;"

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-12-main.log
```

#### 2. Application Issues
```bash
# Check application status
sudo supervisorctl status nomeai-backend

# Check application logs
tail -f /home/nomeai/apps/nome-ai-backend/backend/logs/gunicorn.log

# Restart application
sudo supervisorctl restart nomeai-backend
```

#### 3. Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. Redis Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test Redis connectivity
redis-cli ping

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_person_created_at ON client_person(created_at);
CREATE INDEX CONCURRENTLY idx_person_organization ON client_person(organization_id);
CREATE INDEX CONCURRENTLY idx_person_gender ON client_person(gender);
CREATE INDEX CONCURRENTLY idx_person_age ON client_person(age);

-- Analyze tables for query optimization
ANALYZE client_person;
ANALYZE client_organization;
ANALYZE client_product;
```

#### 2. Application Optimization
```bash
# Increase worker processes
# Edit /etc/supervisor/conf.d/nomeai-backend.conf
# Change --workers 3 to --workers 5

# Restart application
sudo supervisorctl restart nomeai-backend
```

### Security Checklist

- [ ] Firewall configured and enabled
- [ ] SSL certificates installed and configured
- [ ] Database passwords are secure
- [ ] File permissions are properly set
- [ ] Regular backups are configured
- [ ] Log monitoring is in place
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] CSRF protection is enabled
- [ ] Session security is configured

### Maintenance Tasks

#### Daily
- Check application logs for errors
- Monitor system resources
- Verify backup completion
- Monitor AI API usage

#### Weekly
- Review security logs
- Update system packages
- Clean old log files
- Review AI-generated insights quality

#### Monthly
- Review performance metrics
- Update application dependencies
- Test disaster recovery procedures
- Review and optimize AI prompts

## AI Features Configuration

### AI Integration

The system uses AI to generate personalized customer insights.

#### Configuration
1. Obtain your AI API key from the service provider
2. Add the key to `.env` file: `OPENAI_API_KEY=your-key-here`
3. Restart the application to apply changes

#### Monitoring Usage
```bash
# Check AI generation logs
tail -f /home/nomeai/apps/nome-ai-backend/backend/logs/django.log | grep "AI summary"

# Monitor AI errors
tail -f /home/nomeai/apps/nome-ai-backend/backend/logs/django.log | grep "Error generating AI"
```

#### Fallback Behavior
If the AI API key is not configured:
- The `/api/client/person/{id}/summary/` endpoint will return:
  `"AI analysis unavailable: OPENAI_API_KEY not configured"`
- Other data (favorite dishes, tables, statistics) will work normally

## Support

For deployment issues or questions:
- **Email**: support@nomeai.space
- **Documentation**: [API Docs](https://nome-ai-t5lly.ondigitalocean.app/api/docs/)
- **Issues**: GitHub Issues for bug reports

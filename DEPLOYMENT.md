# Deployment Guide for Staff Management Application

This guide will help you deploy the Staff Management Application on AWS EC2 using Docker and Docker Compose.

## Prerequisites

- AWS EC2 instance (Ubuntu 20.04 or later recommended)
- Docker and Docker Compose installed on EC2
- Domain name (optional, for production)
- Neon PostgreSQL database credentials

## Step 1: Setup EC2 Instance

1. Launch an EC2 instance (t2.micro or larger)
2. Configure security groups to allow:
   - Port 80 (HTTP)
   - Port 443 (HTTPS, if using SSL)
   - Port 22 (SSH)
3. SSH into your EC2 instance

## Step 2: Install Docker and Docker Compose

```bash
# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and log back in for this to take effect
```

## Step 3: Clone and Setup Project

```bash
# Clone your repository
git clone <your-repo-url>
cd Staff_Management_Application

# Create .env file in the root directory
nano .env
```

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Neon PostgreSQL)
PGHOST=your-neon-host.neon.tech
PGDATABASE=your-database-name
PGUSER=your-username
PGPASSWORD=your-password

# Backend Configuration
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production
```

**Important:** Replace all placeholder values with your actual credentials. Never commit the `.env` file to version control.

## Step 5: Build and Run with Docker Compose

```bash
# Build and start containers
docker-compose up -d --build

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 6: Verify Deployment

1. Check if containers are running:
   ```bash
   docker ps
   ```

2. Test backend health:
   ```bash
   curl http://localhost:3001/api/auth/validate
   ```

3. Test frontend:
   - Open your browser and navigate to `http://your-ec2-public-ip`

## Step 7: Setup Nginx with SSL (Optional but Recommended)

For production, you should set up SSL certificates using Let's Encrypt:

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# If you have a domain pointing to your EC2 instance
sudo certbot --nginx -d your-domain.com
```

After obtaining SSL certificates, you'll need to update the nginx configuration to include SSL settings. You can modify `nginx/nginx.conf` to add SSL configuration.

## Step 8: Configure Domain Name (Optional)

1. Point your domain to your EC2 instance's public IP
2. Update nginx configuration to use your domain name
3. Update CORS settings in backend if needed

## Architecture Overview

```
Internet
   |
   v
[EC2 Instance]
   |
   +-- [Nginx Container] (Port 80)
   |      |
   |      +-- Serves React Static Files
   |      |
   |      +-- Proxies /api/* to Backend
   |
   +-- [Backend Container] (Port 3001)
   |      |
   |      +-- Express.js API
   |      |
   |      +-- Connects to Neon PostgreSQL
   |
   +-- [External Neon PostgreSQL Database]
```

## Useful Docker Commands

```bash
# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# View resource usage
docker stats
```

## Troubleshooting

### Backend not connecting to database
- Verify database credentials in `.env`
- Check if Neon database allows connections from your EC2 IP
- Check backend logs: `docker-compose logs backend`

### Frontend not loading
- Check nginx logs: `docker-compose logs frontend`
- Verify nginx configuration is mounted correctly
- Check if port 80 is open in security group

### CORS errors
- Verify nginx is properly proxying `/api` requests
- Check backend CORS configuration
- Restart containers: `docker-compose restart`

### Container keeps restarting
- Check logs: `docker-compose logs [service-name]`
- Verify all environment variables are set in `.env`
- Check if ports are already in use

## Production Recommendations

1. **Use Environment Variables**: Never commit `.env` file to version control
2. **Enable HTTPS**: Use Let's Encrypt for free SSL certificates
3. **Set up Monitoring**: Consider using CloudWatch or similar
4. **Backup Database**: Set up regular backups for your Neon database
5. **Use Load Balancer**: For high availability, use AWS Application Load Balancer
6. **Enable Auto-scaling**: Configure EC2 auto-scaling groups if needed
7. **Set up Logging**: Configure centralized logging (CloudWatch Logs, ELK stack, etc.)

## Security Checklist

- [ ] Change default JWT_SECRET to a strong random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules (security groups)
- [ ] Keep Docker and system packages updated
- [ ] Use environment variables for all secrets
- [ ] Enable database connection encryption
- [ ] Set up regular security updates

## Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Backup Database

Set up automated backups through Neon dashboard or use pg_dump:

```bash
docker-compose exec backend pg_dump -h $PGHOST -U $PGUSER $PGDATABASE > backup.sql
```

## Support

For issues or questions, check:
- Docker logs: `docker-compose logs`
- Container status: `docker-compose ps`
- System resources: `docker stats`


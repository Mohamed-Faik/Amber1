# Docker Setup Guide

This guide explains how to run the Teor application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (for Windows/Mac) or Docker Engine (for Linux)
- Docker Compose v2.0 or higher

## Quick Start

1. **Create environment file** (optional - uses defaults if not provided):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration.

2. **Build and start containers**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

4. **Access the application**:
   - Application: http://localhost:3000
   - MySQL: localhost:3306

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This deletes database data)
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Access MySQL Database
```bash
docker-compose exec mysql mysql -u teor_user -p teor_db
# Password: teor_password (or your MYSQL_PASSWORD)
```

### Run Prisma Commands
```bash
# Generate Prisma Client
docker-compose exec app npx prisma generate

# Run Migrations
docker-compose exec app npx prisma migrate dev

# Open Prisma Studio
docker-compose exec app npx prisma studio
```

### Access Application Shell
```bash
docker-compose exec app sh
```

## Environment Variables

Create a `.env` file in the `teor` directory with the following variables:

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=teor_db
MYSQL_USER=teor_user
MYSQL_PASSWORD=teor_password

# Application
DATABASE_URL=mysql://teor_user:teor_password@mysql:3306/teor_db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth (Optional)
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

## Troubleshooting

### Port Already in Use
If port 3000 or 3306 is already in use, change them in `.env`:
```env
APP_PORT=3001
MYSQL_PORT=3307
```

### Database Connection Issues
1. Wait for MySQL to be fully ready (check health status)
2. Verify DATABASE_URL matches your MySQL credentials
3. Check logs: `docker-compose logs mysql`

### Build Fails
1. Clear Docker cache: `docker system prune -a`
2. Rebuild: `docker-compose build --no-cache`

### Permission Issues (Linux/Mac)
```bash
sudo chown -R $USER:$USER ./public/uploads
```

## Production Deployment

For production:
1. Change all default passwords
2. Use strong `NEXTAUTH_SECRET`
3. Set proper `NEXTAUTH_URL` (your domain)
4. Use environment-specific `.env` file
5. Consider using Docker secrets for sensitive data
6. Set up proper backup strategy for MySQL volume

## Volumes

- `mysql_data`: Persistent MySQL database storage
- `./public/uploads`: Application uploads directory (mounted from host)

## Network

All services run on the `teor-network` bridge network, allowing them to communicate using service names (e.g., `mysql` hostname).


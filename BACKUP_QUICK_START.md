# Backup Quick Start Guide

Quick reference guide for backing up and restoring your AmberHomes platform.

---

## 🚀 Quick Commands

### Full Backup (Recommended)

```bash
# Local MySQL
npm run backup:full

# Docker MySQL
npm run backup:full:docker

# Remote MySQL (using DATABASE_URL)
npm run backup:full:remote
```

### Database Backup Only

```bash
# Local MySQL
npm run backup:db

# Docker MySQL
npm run backup:db:docker

# Remote MySQL
npm run backup:db:remote
```

### File Uploads Backup Only

```bash
npm run backup:files
```

### Restore Database

```bash
# Restore from backup file
npm run restore:db backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --docker

# With options
node scripts/restore-database.js backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --docker
```

---

## 📦 Backup Locations

Backups are stored in:
- **Default location**: `./backups/`
- **Daily backups**: `./backups/YYYY-MM-DD/`
- **Retention**: 30 days (automatic cleanup)

---

## 🤖 Automated Backups

Automated daily backups run via GitHub Actions:
- **Schedule**: Daily at 2:00 AM UTC
- **Workflow**: `.github/workflows/backup.yml`
- **Artifacts**: Stored for 7 days in GitHub Actions

### Manual Trigger

1. Go to GitHub repository → Actions tab
2. Select "Automated Daily Backup" workflow
3. Click "Run workflow" → "Run workflow"

---

## 🚨 Emergency Restore

### Step 1: Stop Application

```bash
docker-compose down
# or
pm2 stop all
```

### Step 2: Restore Database

```bash
npm run restore:db backups/YYYY-MM-DD/backup_*.sql.gz --docker
```

### Step 3: Restore Files (if needed)

```bash
# Linux/Mac
tar -xzf backups/YYYY-MM-DD/uploads_backup_*.tar.gz -C ./

# Windows
powershell Expand-Archive -Path backups/YYYY-MM-DD/uploads_backup_*.zip -DestinationPath ./ -Force
```

### Step 4: Regenerate Prisma Client

```bash
npx prisma generate
```

### Step 5: Restart Application

```bash
docker-compose up -d
# or
pm2 start all
```

---

## 📚 Full Documentation

For detailed backup and disaster recovery procedures, see:
- **[BACKUP_DISASTER_RECOVERY.md](./BACKUP_DISASTER_RECOVERY.md)** - Comprehensive guide
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Docker setup instructions

---

## ⚡ Common Issues

### "mysqldump: command not found"

Install MySQL client tools:
```bash
# Ubuntu/Debian
sudo apt-get install default-mysql-client

# macOS
brew install mysql-client

# Windows
# Download MySQL installer and install MySQL client tools
```

### "Cannot connect to MySQL server"

1. Check if MySQL is running: `docker-compose ps`
2. Verify database credentials in `.env`
3. Check network connectivity (for remote databases)

### "Backup file not found"

1. List available backups: `ls -lh backups/`
2. Check backup directory: `ls -lh backups/YYYY-MM-DD/`
3. Verify backup file path is correct

---

## 💡 Tips

1. **Test restores regularly** - Don't wait for a disaster
2. **Store backups offsite** - Use cloud storage (S3, GCS, etc.)
3. **Verify backups** - Check file sizes and test restoration
4. **Document backup locations** - Keep track of where backups are stored
5. **Monitor backup logs** - Check for failures regularly

---

**Quick Help**: See [BACKUP_DISASTER_RECOVERY.md](./BACKUP_DISASTER_RECOVERY.md) for complete documentation.


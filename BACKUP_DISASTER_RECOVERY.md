# Backup and Disaster Recovery Plan

This document outlines the comprehensive backup and disaster recovery procedures for the AmberHomes platform.

---

## 📋 Table of Contents

1. [Backup Strategy](#backup-strategy)
2. [Backup Scripts](#backup-scripts)
3. [Automated Backups](#automated-backups)
4. [Manual Backup Procedures](#manual-backup-procedures)
5. [Disaster Recovery Procedures](#disaster-recovery-procedures)
6. [Backup Verification](#backup-verification)
7. [Recovery Testing](#recovery-testing)

---

## 🎯 Backup Strategy

### Backup Frequency

- **Database Backups**: Daily automated backups
- **File Uploads Backups**: Daily automated backups
- **Retention Period**: 30 days (configurable)
- **Backup Storage**: Local + Cloud (recommended)

### What Gets Backed Up

1. **MySQL Database**
   - All user data
   - All listings
   - All reviews
   - All blog posts
   - All content pages
   - System configuration

2. **File Uploads**
   - Profile images (`public/uploads/profiles/`)
   - Listing images (`public/uploads/listings/`)
   - All uploaded media files

3. **Configuration Files** (Manual)
   - `.env` file (stored securely, not in backups)
   - `prisma/schema.prisma`
   - `next.config.js`

---

## 📦 Backup Scripts

### Available Scripts

All backup scripts are located in the `scripts/` directory:

1. **`backup-database.js`** - Database backup script
2. **`backup-files.js`** - File uploads backup script
3. **`backup-full.js`** - Complete backup (database + files)
4. **`restore-database.js`** - Database restore script

---

## 🔧 Manual Backup Procedures

### Option 1: Full Backup (Recommended)

Creates a complete backup of both database and files:

```bash
# Full backup (local MySQL)
node scripts/backup-full.js

# Full backup (Docker)
node scripts/backup-full.js --docker

# Full backup (Remote database)
node scripts/backup-full.js --remote

# Custom output directory
node scripts/backup-full.js --output-dir /path/to/backups
```

### Option 2: Database Backup Only

```bash
# Local MySQL
node scripts/backup-database.js

# Docker MySQL container
node scripts/backup-database.js --docker

# Remote database (using DATABASE_URL)
node scripts/backup-database.js --remote

# Custom output directory
node scripts/backup-database.js --output-dir /path/to/backups
```

### Option 3: File Uploads Backup Only

```bash
node scripts/backup-files.js

# Custom output directory
node scripts/backup-files.js --output-dir /path/to/backups
```

### Backup Output Structure

```
backups/
├── 2024-01-15/
│   ├── backup_2024-01-15_12-30-45.sql.gz
│   ├── metadata_2024-01-15_12-30-45.json
│   ├── uploads_backup_2024-01-15_12-30-45.tar.gz
│   └── uploads_metadata_2024-01-15_12-30-45.json
├── 2024-01-16/
│   └── ...
└── ...
```

---

## 🤖 Automated Backups

### GitHub Actions Workflow

Automated backups run daily via GitHub Actions. See `.github/workflows/backup.yml` for configuration.

**Backup Schedule:**
- Runs daily at 2:00 AM UTC
- Stores backups as GitHub Actions artifacts (7 days retention)
- Optionally uploads to cloud storage (AWS S3, Google Cloud Storage, etc.)

### Docker Cron Job (Alternative)

For local/production servers, you can set up a cron job:

```bash
# Add to crontab (crontab -e)
# Daily backup at 2:00 AM
0 2 * * * cd /path/to/project && node scripts/backup-full.js --docker >> /var/log/backup.log 2>&1
```

---

## 🚨 Disaster Recovery Procedures

### Scenario 1: Database Corruption or Data Loss

**Steps to Recover:**

1. **Stop the application** (if running)
   ```bash
   docker-compose down
   # or
   pm2 stop all
   ```

2. **Identify the backup to restore**
   ```bash
   ls -lh backups/
   ```

3. **Restore the database**
   ```bash
   # From Docker backup
   node scripts/restore-database.js backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --docker
   
   # From remote backup
   node scripts/restore-database.js backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --remote
   ```

4. **Regenerate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Restart the application**
   ```bash
   docker-compose up -d
   # or
   pm2 start all
   ```

6. **Verify restoration**
   - Check if data is restored correctly
   - Test user login
   - Verify listings are visible
   - Check admin panel functionality

### Scenario 2: File Uploads Loss

**Steps to Recover:**

1. **Stop the application** (optional, to avoid conflicts)

2. **Extract backup archive**
   ```bash
   # Linux/Mac
   tar -xzf backups/2024-01-15/uploads_backup_2024-01-15_12-30-45.tar.gz -C ./
   
   # Windows
   powershell Expand-Archive -Path backups/2024-01-15/uploads_backup_2024-01-15_12-30-45.zip -DestinationPath ./ -Force
   ```

3. **Verify files are restored**
   ```bash
   ls -lh public/uploads/
   ```

4. **Restart the application**

### Scenario 3: Complete System Failure

**Full System Recovery:**

1. **Restore database** (see Scenario 1)

2. **Restore file uploads** (see Scenario 2)

3. **Restore configuration**
   - Copy `.env` file from secure backup
   - Verify all environment variables
   - Regenerate Prisma Client

4. **Verify all services**
   - Database connectivity
   - File uploads access
   - Application functionality
   - Admin panel access

5. **Update DNS/Deployment** (if needed)
   - Verify Vercel deployment (if using)
   - Check environment variables on hosting platform
   - Test public access

---

## ✅ Backup Verification

### Verify Database Backup

```bash
# Check backup file exists and has content
ls -lh backups/2024-01-15/backup_*.sql.gz

# Verify backup file integrity
gunzip -t backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz

# Check backup metadata
cat backups/2024-01-15/metadata_*.json
```

### Verify File Backup

```bash
# List backup contents
tar -tzf backups/2024-01-15/uploads_backup_*.tar.gz | head -20

# Check backup size
ls -lh backups/2024-01-15/uploads_backup_*.tar.gz
```

### Automated Backup Verification

The backup scripts automatically:
- ✅ Verify backup file creation
- ✅ Check file sizes
- ✅ Generate metadata files
- ✅ Clean up old backups (30+ days)

---

## 🧪 Recovery Testing

### Test Database Restore (Safe Test)

1. **Create a test database**
   ```bash
   mysql -u root -p -e "CREATE DATABASE teor_test_restore;"
   ```

2. **Restore to test database**
   ```bash
   # Modify restore script temporarily to use test database
   # Or manually restore:
   gunzip -c backups/2024-01-15/backup_*.sql.gz | mysql -u root -p teor_test_restore
   ```

3. **Verify data**
   ```bash
   mysql -u root -p teor_test_restore -e "SELECT COUNT(*) FROM listing;"
   ```

4. **Cleanup test database**
   ```bash
   mysql -u root -p -e "DROP DATABASE teor_test_restore;"
   ```

### Recommended Testing Schedule

- **Monthly**: Test restore on staging/test environment
- **Quarterly**: Full disaster recovery drill
- **After major updates**: Verify backups still work

---

## ☁️ Cloud Backup Storage (Recommended)

### Option 1: AWS S3

1. Install AWS CLI: `pip install awscli`

2. Configure AWS credentials:
   ```bash
   aws configure
   ```

3. Upload backups to S3:
   ```bash
   aws s3 cp backups/ s3://your-backup-bucket/amberhomes/backups/ --recursive
   ```

### Option 2: Google Cloud Storage

1. Install gsutil: `pip install gsutil`

2. Upload backups:
   ```bash
   gsutil -m cp -r backups/ gs://your-backup-bucket/amberhomes/backups/
   ```

### Option 3: Vercel Blob Storage

If using Vercel, backups can be stored in Vercel Blob Storage using the existing `@vercel/blob` package.

---

## 📊 Backup Monitoring

### Backup Logs

Check backup execution logs:

```bash
# GitHub Actions logs (if using automated backups)
# Check Actions tab in GitHub repository

# Local cron logs
tail -f /var/log/backup.log

# Docker logs
docker-compose logs -f backup
```

### Backup Health Checks

- Monitor backup file sizes (should be consistent)
- Verify backup frequency (daily backups)
- Check backup retention (30 days)
- Alert on backup failures

---

## 🔐 Security Considerations

### Backup Security

1. **Encrypt Sensitive Backups**
   - Use encrypted storage for backups containing user data
   - Consider encrypting backup files with GPG

2. **Access Control**
   - Limit access to backup files
   - Use secure storage (S3 with encryption, etc.)
   - Store backups separately from production

3. **Environment Variables**
   - **NEVER** include `.env` file in backups
   - Store environment variables separately (password manager, secrets manager)

4. **Backup Retention**
   - Comply with data retention policies
   - Delete backups containing deleted user data (GDPR compliance)

---

## 📝 Backup Checklist

### Daily Automated Backups ✅

- [ ] Database backup scheduled (GitHub Actions or cron)
- [ ] File uploads backup scheduled
- [ ] Backup verification automated
- [ ] Backup logs monitored

### Weekly Manual Checks

- [ ] Verify backup files are being created
- [ ] Check backup file sizes (reasonable)
- [ ] Verify backups are stored securely
- [ ] Review backup logs for errors

### Monthly Maintenance

- [ ] Test database restore on staging
- [ ] Verify backup retention (30 days)
- [ ] Review and update backup procedures
- [ ] Check cloud storage (if used)

---

## 🚑 Emergency Contacts

### In Case of Data Loss

1. **Stop all write operations** (if possible)
2. **Identify the last known good backup**
3. **Follow disaster recovery procedures**
4. **Contact hosting provider** (if needed)
5. **Document the incident** for post-mortem

### Support Resources

- **Documentation**: See this file and `IMPLEMENTATION_GUIDE.md`
- **Backup Scripts**: `scripts/backup-*.js`
- **Recovery Scripts**: `scripts/restore-database.js`
- **Docker Setup**: `DOCKER_SETUP.md`

---

## 📈 Best Practices

1. **3-2-1 Backup Rule**
   - 3 copies of data
   - 2 different storage media
   - 1 offsite backup

2. **Automated Backups**
   - Never rely on manual backups only
   - Automate daily backups
   - Monitor backup success/failure

3. **Test Restores Regularly**
   - Backup without restore testing is incomplete
   - Test on staging/test environment
   - Document restore procedures

4. **Documentation**
   - Keep backup procedures updated
   - Document all backup locations
   - Maintain recovery runbooks

5. **Security**
   - Encrypt sensitive backups
   - Secure backup storage
   - Limit access to backups

---

## 🔄 Backup Maintenance

### Cleanup Old Backups

Backup scripts automatically clean up backups older than 30 days. To manually clean:

```bash
# Remove backups older than 30 days
find backups/ -type d -mtime +30 -exec rm -rf {} \;

# Or keep specific number of backups
cd backups/ && ls -t | tail -n +31 | xargs rm -rf
```

### Backup Storage Management

- Monitor disk space usage
- Move old backups to cold storage (if needed)
- Archive backups to external storage
- Document all backup locations

---

## ⚠️ Important Notes

1. **Always verify backups** before deleting old data
2. **Test restore procedures** on a regular basis
3. **Keep backups encrypted** if containing sensitive data
4. **Store backups offsite** (cloud storage recommended)
5. **Document backup locations** and access credentials
6. **Never commit backup files** to Git repository

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Maintained By**: Development Team


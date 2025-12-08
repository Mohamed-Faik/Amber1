# CI/CD Pipeline Setup Guide

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
1. **Test Job**
   - Runs on: Ubuntu Latest
   - Node.js versions: 18.x
   - Steps:
     - Checkout code
     - Setup Node.js with npm cache
     - Install dependencies
     - Run linter
     - Run tests with coverage
     - Upload coverage reports to Codecov

2. **Build Job**
   - Runs after tests pass
   - Steps:
     - Checkout code
     - Setup Node.js
     - Install dependencies
     - Generate Prisma Client
     - Build Next.js application

3. **Docker Build Job** (Main branch only)
   - Runs after tests and build pass
   - Steps:
     - Build Docker image
     - Test Docker image

### 2. Deploy Pipeline (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Tag push (v*)

**Jobs:**
- Run tests
- Build application
- Deploy (placeholder - add your deployment steps)

### 3. Docker Publish (`.github/workflows/docker-publish.yml`)

**Triggers:**
- Push to `main` branch
- Tag push (v*)
- Manual workflow dispatch

**Jobs:**
- Build Docker image
- Push to Docker Hub (if credentials are configured)

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions are automatically enabled when you push the workflow files. No additional setup needed.

### 2. Configure Secrets (Optional)

For production deployments, add secrets in GitHub:
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

```
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=your-production-database-url
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

### 3. View Workflow Runs

1. Go to your repository → Actions tab
2. See all workflow runs and their status
3. Click on a run to see detailed logs

## Workflow Status Badge

Add this to your README.md to show CI status:

```markdown
![CI](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml/badge.svg)
```

## Customization

### Add Deployment Steps

Edit `.github/workflows/deploy.yml` and add your deployment commands:

```yaml
- name: Deploy to Vercel
  run: |
    npm install -g vercel
    vercel --prod --token ${{ secrets.VERCEL_TOKEN }}

# OR

- name: Deploy to AWS
  run: |
    aws s3 sync ./teor/.next/static s3://your-bucket/static
    # Add more AWS deployment commands
```

### Add More Test Jobs

Edit `.github/workflows/ci.yml` to add:
- E2E tests
- Performance tests
- Security scans
- Code quality checks

### Change Triggers

Modify the `on:` section in workflow files:

```yaml
on:
  push:
    branches: [ main, develop, staging ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

## Troubleshooting

### Tests Failing
- Check the Actions tab for error logs
- Run tests locally: `npm test`
- Ensure all dependencies are in `package.json`

### Build Failing
- Check Node.js version compatibility
- Verify environment variables are set
- Check Prisma schema is valid

### Docker Build Failing
- Ensure Dockerfile is correct
- Check for syntax errors
- Verify all required files are present

## Best Practices

1. **Always run tests before merging** - CI will catch issues early
2. **Keep workflows fast** - Use caching and parallel jobs
3. **Use secrets for sensitive data** - Never commit secrets
4. **Review workflow logs** - Check for warnings and errors
5. **Test workflows locally** - Use `act` tool for local testing

## Local Testing

Install `act` to test workflows locally:

```bash
# Install act (macOS/Linux)
brew install act

# Or download from: https://github.com/nektos/act/releases

# Run CI workflow locally
act -W .github/workflows/ci.yml
```

## Next Steps

1. ✅ CI pipeline is set up
2. ⏳ Configure deployment steps for your hosting provider
3. ⏳ Set up production secrets
4. ⏳ Add status badges to README
5. ⏳ Configure branch protection rules (require CI to pass)


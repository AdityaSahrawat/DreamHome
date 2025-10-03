# Azure Deployment Fix Guide

## Critical Issues to Fix

Your Azure deployment at `http://98.70.24.108` has 3 critical issues that need to be resolved:

### 1. Database Connection Issue
**Problem**: App cannot connect to database
**Solution**: Update your environment variables with the correct database connection string.

### 2. Google OAuth Redirect Issue
**Problem**: OAuth redirects to `localhost:3000` instead of your Azure server
**Solution**: Update NextAuth configuration and Google OAuth console settings.

### 3. Hero Image Loading Issue
**Problem**: Images not loading in hero section
**Solution**: Environment variable configuration for image optimization.

## Step-by-Step Fix Instructions

### Step 1: Update Environment Variables on Azure VM

SSH into your Azure VM and update your environment variables:

```bash
# Connect to your Azure VM
ssh your-username@98.70.24.108

# Navigate to your project directory
cd /path/to/your/dreamhome-project

# Create or update .env.production file
nano .env.production
```

Add these environment variables to `.env.production`:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/dreamhome?sslmode=require"

# NextAuth Configuration - CRITICAL: Change from localhost to your Azure IP
NEXTAUTH_URL="http://98.70.24.108"
NEXTAUTH_SECRET="your-super-secret-key-here-minimum-32-characters"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Node Environment
NODE_ENV="production"
```

### Step 2: Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID
4. Click "Edit" on your OAuth client
5. Under "Authorized redirect URIs", add:
   ```
   http://98.70.24.108/api/auth/callback/google
   ```
6. Remove or keep the localhost URL for development:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Save changes

### Step 3: Verify Database Connection String

Your Neon.tech database connection string should look like this:
```
postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
```

To get the correct connection string:
1. Log into [Neon.tech console](https://console.neon.tech/)
2. Go to your project dashboard
3. Click "Connection Details"
4. Copy the connection string
5. Replace the placeholder in your `.env.production` file

### Step 4: Rebuild and Restart Your Application

After updating environment variables:

```bash
# If using Docker (recommended)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# OR if running directly with Node.js
pm2 stop all
npm run build
pm2 start ecosystem.config.js

# OR if using pnpm
pnpm build
pm2 restart all
```

### Step 5: Test the Fixes

1. **Test Database Connection**:
   ```bash
   # Check application logs
   docker logs your-container-name
   # OR
   pm2 logs
   ```

2. **Test Google OAuth**:
   - Visit `http://98.70.24.108`
   - Click "Continue with Google"
   - Should redirect to Google, then back to `http://98.70.24.108/profile` (not localhost)

3. **Test Image Loading**:
   - Check if hero section images load properly
   - Open browser dev tools to check for image loading errors

## Additional Docker Configuration

If you're using Docker, make sure your `docker-compose.yml` includes environment variables:

```yaml
version: '3.8'
services:
  dreamhome:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=http://98.70.24.108
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
```

## Security Considerations

1. **Generate a secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

2. **Secure your environment files**:
   ```bash
   chmod 600 .env.production
   ```

3. **Use HTTPS in production** (recommended):
   - Set up SSL certificate
   - Update NEXTAUTH_URL to `https://your-domain.com`
   - Update Google OAuth redirect URI accordingly

## Troubleshooting

### If Database Connection Still Fails:
- Verify Neon.tech database is running
- Check firewall settings on Azure VM
- Test connection string with a database client

### If Google OAuth Still Redirects to Localhost:
- Clear browser cache/cookies
- Double-check NEXTAUTH_URL environment variable
- Verify Google OAuth console configuration

### If Images Still Don't Load:
- Check browser network tab for 404 errors
- Verify Unsplash API access (if using Unsplash images)
- Check next.config.ts image configuration

## Need Help?

If you encounter issues:
1. Check application logs: `docker logs container-name` or `pm2 logs`
2. Verify environment variables are loaded: `printenv | grep NEXTAUTH`
3. Test database connection separately
4. Check Google OAuth console for any error messages

Let me know if you need help with any of these steps!
# Azure Production Environment Variables

## Required Environment Variables for Production Deployment

### Database Configuration
```bash
# Replace with your Neon.tech connection string
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

### NextAuth.js Configuration
```bash
# Change from localhost to your Azure VM IP/domain
NEXTAUTH_URL="http://98.70.24.108"

# Generate a secure secret (32+ characters)
NEXTAUTH_SECRET="your-super-secure-secret-here-32-chars-minimum"
```

### Google OAuth Configuration
```bash
# Your Google OAuth Client ID
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Your Google OAuth Client Secret  
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Other Environment Variables
```bash
# Disable Next.js telemetry in production
NEXT_TELEMETRY_DISABLED=1

# Set to production
NODE_ENV=production
```

## Google OAuth Setup Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://98.70.24.108/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (if you have SSL)

## Neon.tech Database Setup

1. Create account at [Neon.tech](https://neon.tech/)
2. Create a new database
3. Copy the connection string (it should look like):
   ```
   postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. Run migrations after setting DATABASE_URL:
   ```bash
   pnpm prisma migrate deploy --schema=database/prisma/schema.prisma
   ```

## Docker Container Environment Variables

When running via Docker, pass these environment variables:

```bash
docker run -d --name dreamhome --restart=always \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_URL="http://98.70.24.108" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e GOOGLE_CLIENT_ID="your-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-client-secret" \
  -p 3000:3000 \
  ghcr.io/adityasahrawat/dreamhome:latest
```
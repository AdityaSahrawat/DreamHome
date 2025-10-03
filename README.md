# 🏠 DreamHome - Real Estate Platform

A modern, secure real estate platform built with Next.js 15, TypeScript, and PostgreSQL. DreamHome simplifies property management and lease agreements with role-based access control and streamlined workflows.

## ✨ Features

- **Multi-Role Authentication**: Client, Manager, Assistant, Supervisor, and Owner roles
- **Property Management**: Add, edit, and manage property listings with photo uploads
- **Lease Management**: Digital lease creation, negotiation, and approval workflow
- **Branch Management**: Multi-branch operations support
- **Security First**: Rate limiting, input validation, and comprehensive security headers
- **Real-time Notifications**: Stay updated on lease status and property changes
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm (recommended) or npm
- PostgreSQL database (we recommend [Neon.tech](https://neon.tech) for managed hosting)
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dreamhome
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   
   # NextAuth (Generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET="your-super-secret-32-character-minimum-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email (for manual authentication)
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   pnpm db:generate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗 Architecture

### Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with middleware
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth + custom email verification
- **Security**: Rate limiting, input validation, security headers
- **Deployment**: Docker with multi-stage builds

### Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── about/             # About page
│   ├── how-it-works/      # How it works explanation page
│   ├── login/             # Authentication pages
│   ├── profile/           # User dashboard and profile
│   └── properties/        # Property listing pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── security.ts       # Security middleware
│   └── utils.ts          # General utilities
└── types/                 # TypeScript type definitions

database/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migration files
└── generated/            # Prisma generated client
```

## 🔒 Security Features

- **Rate Limiting**: API routes are protected with configurable rate limits
- **Input Validation**: All endpoints validate input data
- **Security Headers**: CSP, HSTS, XSS Protection, and more
- **Authentication**: Secure JWT tokens with proper expiration
- **Environment Security**: No hardcoded secrets, proper environment validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t dreamhome .

# Run the container
docker run -p 3000:3000 --env-file .env.production dreamhome
```

### Docker Compose (recommended)

```yaml
version: '3.8'
services:
  dreamhome:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
```

## 📊 Health Check

The application includes a health check endpoint at `/api/health` that verifies:
- Database connectivity
- Environment variable configuration
- Application status

```bash
curl http://localhost:3000/api/health
```

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio

### Database Operations

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Push schema changes to database (development)
pnpm db:push

# Create a new migration
pnpm db:migrate

# View database in Prisma Studio
pnpm db:studio
```

## 🚀 Production Deployment

### Environment Setup

1. **Generate secure secrets**:
   ```bash
   openssl rand -base64 32  # For NEXTAUTH_SECRET
   ```

2. **Set up production environment variables**
3. **Configure Google OAuth redirect URIs**
4. **Set up SSL certificates (recommended)**

### Azure VM Deployment

See `AZURE_DEPLOYMENT_FIX.md` for detailed Azure deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

If you encounter any issues:

1. Check the health endpoint: `/api/health`
2. Review the logs: `docker logs container-name` or `pnpm dev`
3. Verify environment variables are correctly set
4. Check database connectivity

## 🔄 Recent Updates

- ✅ Updated all dependencies to fix security vulnerabilities
- ✅ Added comprehensive security middleware with rate limiting
- ✅ Implemented environment variable validation
- ✅ Added health check endpoint
- ✅ Enhanced Docker configuration for production deployment
- ✅ Added security headers and input validation

---

**Last Updated**: October 3, 2025  
**Version**: 0.1.0

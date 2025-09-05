# Manual Authentication System

This directory contains the manual authentication API routes for DreamHome, providing email verification-based registration and login.

## Features

- ✅ Email verification with 6-digit codes
- ✅ User registration with email verification
- ✅ Manual login with JWT tokens
- ✅ Integration with existing Prisma schema
- ⚠️ **Note**: Currently uses plain text passwords (to be enhanced later)

## API Endpoints

### 1. Send Verification Code
**POST** `/api/auth/manual/send-code`

Send a 6-digit verification code to the user's email.

```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code sent successfully"
}
```

### 2. Verify Code & Register
**POST** `/api/auth/manual/verify-code`

Verify the code and create a new user account.

```json
{
  "email": "user@example.com",
  "code": "123456",
  "password": "userpassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User verified and created successfully!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client"
  }
}
```

### 3. Manual Login
**POST** `/api/auth/manual/login`

Login with email and password.

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client",
    "branchId": null
  }
}
```

### 4. Create Owner
**POST** `/api/auth/manual/create-owner`

Create a new owner account directly (no email verification required).

```json
{
  "email": "owner@example.com",
  "name": "Jane Owner",
  "password": "ownerpassword",
  "branchId": 1
}
```

**Response:**
```json
{
  "message": "Owner created successfully",
  "user": {
    "id": 2,
    "email": "owner@example.com",
    "name": "Jane Owner",
    "role": "owner",
    "branch": {
      "id": 1,
      "name": "Main Branch",
      "location": "Downtown"
    },
    "createdAt": "2025-09-05T12:00:00.000Z"
  }
}
```

### 5. Create Staff
**POST** `/api/auth/manual/create-staff`

Create new staff members (manager, supervisor, assistant).

```json
{
  "email": "manager@example.com",
  "name": "Bob Manager",
  "password": "managerpassword",
  "role": "manager",
  "branchId": 1
}
```

**Response:**
```json
{
  "message": "Manager created successfully",
  "user": {
    "id": 3,
    "email": "manager@example.com",
    "name": "Bob Manager",
    "role": "manager",
    "branch": {
      "id": 1,
      "name": "Main Branch",
      "location": "Downtown"
    }
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

## Database Schema Changes

The following model was added to support email verification:

```prisma
model VerificationEmail {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  code     String
  expireAt DateTime
  createdAt DateTime @default(now())
}
```

## Security Notes

⚠️ **Important**: This implementation currently uses plain text passwords. For production use:

1. Add password hashing (bcrypt, argon2, etc.)
2. Ensure HTTPS in production
3. Use strong JWT secrets
4. Implement rate limiting for authentication endpoints

## Integration with Existing Auth

This manual auth system works alongside your existing NextAuth setup:
- NextAuth handles OAuth (Google, etc.)
- Manual auth handles email/password registration
- Both systems use the same `User` model in Prisma
- Role-based access control is consistent across both

## Error Handling

All endpoints include proper error handling for:
- Missing fields (400)
- Duplicate emails (409)
- Invalid codes (400)
- Expired codes (400)
- Authentication failures (401)
- Server errors (500)

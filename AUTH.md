# Authentication Architecture

This document explains the current (transitional) dual-authentication design, available endpoints, data flows, and the roadmap to consolidation.

## Overview
We currently support:
1. OAuth (Google) via NextAuth (primary / strategic)
2. Legacy manual email/password JWT flow (temporary until migrated to a NextAuth Credentials provider)

A unified status contract is exposed at:
- `GET /api/auth/status`
- `GET /api/auth` (proxy alias)

Both return JSON:
```json
{
  "authenticated": boolean,
  "source": "nextauth" | "manual" | null,
  "user": {
    "id": string,
    "email": string,
    "name": string | null,
    "role": string | null,
    "branchId": string | null
  } | null
}
```

## Flows
### Google OAuth Flow
1. User clicks Google button (client invokes `signIn('google')`).
2. NextAuth callback creates or fetches the user via Prisma Adapter.
3. If `role` or `branchId` is missing, redirect to `/auth/complete`.
4. Completion page submits to `POST /api/auth/complete` with `{ role, branchId }`.
5. Session callback enriches the NextAuth session with `role` & `branchId`.
6. UI polls or listens for `authStateChanged` to update navigation state.

### Manual Login Flow (Transitional)
1. User posts `{ email, password }` to `POST /api/auth/manual/login`.
2. On success: httpOnly `token` cookie (JWT) + JSON body with user details.
3. Client stores a non-HTTP only mirror token only if needed for immediate in-memory state (avoid relying on localStorage if possible long-term).
4. Navbar calls `/api/auth/status` which prefers NextAuth session; if none, validates JWT.

### Logout
- Google / NextAuth: client calls `signOut()` (which clears session cookies) then optionally hits `/api/auth/logout` to also clear legacy `token` cookie.
- Manual: client calls `POST /api/auth/logout` (clears `token`).

## Middleware Behavior (`src/middleware.ts`)
- Maintains allowlist of public routes.
- `authenticateToken` returns:
  - `null` => route public, continue
  - `{ user }` => token valid, continue
  - `NextResponse` => an auth failure response (401/403)
- Only legacy JWT is validated here; NextAuth session-based routes (using server helpers) bypass manual JWT logic when not needed.

## Endpoints Inventory
| Endpoint | Method | Purpose | Auth | Notes |
|----------|--------|---------|------|-------|
| /api/auth/status | GET | Unified auth state | Public | Uses NextAuth > JWT fallback |
| /api/auth | GET | Alias of status | Public | For backward compatibility |
| /api/auth/manual/login | POST | Manual login | Public | Issues JWT cookie (7d) |
| /api/auth/logout | POST | Manual logout | Public | Clears `token` cookie |
| /api/auth/complete | POST | Complete Google profile | NextAuth session required | Validates role + branch |
| /api/properties/[id] | GET | Fetch property | Public | DELETE requires auth |
| /api/auth/login | POST | Deprecated | Public | Returns 410 Gone |

## Data Model Notes
- `User.role` and `User.branchId` are nullable to enable post-OAuth completion.
- Completion endpoint ensures `branchId` refers to an existing Branch record.

## Environment Variables
| Variable | Purpose |
|----------|---------|
| NEXTAUTH_URL | Base URL for NextAuth callbacks |
| NEXTAUTH_SECRET | JWT/Session secret for NextAuth & manual fallback |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth secret |
| DATABASE_URL | Prisma connection string |

## Security Considerations
- Manual flow currently compares plaintext password (needs hashing upgrade: bcrypt / argon2).
- Recommend migrating manual login to a NextAuth Credentials provider and removing raw JWT issuance from custom route.
- Avoid storing JWT in localStorage; rely on httpOnly cookie + server-rendered auth state.

## Roadmap
1. (Done) Unify status shape & deprecate duplicate `/api/auth/login`.
2. Add password hashing + credentials provider in NextAuth.
3. Migrate clients to use `signIn('credentials', ...)` instead of `/api/auth/manual/login`.
4. Remove `/api/auth/manual/login` and `/api/auth/logout` endpoints.
5. Remove JWT validation from middleware (rely on NextAuth session / middleware integration or protected Route Handlers using `getServerSession`).
6. Add automated tests (unit + integration) for auth flows.

## Test Matrix (Suggested)
| Scenario | Steps | Expected |
|----------|-------|----------|
| Manual login success | POST /manual/login valid creds | 200 + token cookie set |
| Manual login fail | POST /manual/login bad password | 401 |
| Google new user | signIn -> redirect complete -> submit | Session has role/branch |
| Google existing complete user | signIn | Redirect to / (no completion) |
| Status unauthenticated | GET /status no cookies | authenticated=false |
| Status manual | After manual login | authenticated=true source=manual |
| Status nextauth | After Google login | authenticated=true source=nextauth |
| Completion invalid branch | POST /complete bad branch | 400 |
| Deprecated endpoint | POST /auth/login | 410 |

## Developer Tips
- Use `/api/auth/status` server-side via `fetch` with `{ cache: 'no-store' }` for SSR.
- Trigger UI refresh after auth changes by dispatching `authStateChanged` (continue pattern until moved to a global store).
- Keep middleware allowlist updated for newly public routes.

## Open Tasks
- Implement password hashing.
- Add credential provider & remove manual JWT logic.
- Add integration tests and CI pipeline.

---
Last updated: (auto-generated)

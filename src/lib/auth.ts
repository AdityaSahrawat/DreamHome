import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prismaClient } from '@/database'

interface AugmentedToken {
  id?: string | number;
  role?: string | null;
  branchId?: number | null;
  [key: string]: unknown;
}

interface AugmentedUser {
  id: string;
  role?: string | null;
  branchId?: number | null;
  email?: string | null;
  name?: string | null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, password: true, role: true, branchId: true }
        });
        if (!user) return null;
        // Plain password comparison (TODO: replace with bcrypt compare in future)
        if (!user.password || user.password !== credentials.password) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          branchId: user.branchId || null
        } as unknown as AugmentedUser;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== 'google') return true;
      // Minimal validation; keep fast. Additional checks can be added later.
      try {
        // Ensure provider is marked as google in DB (if new or previously manual)
        await prismaClient.user.update({
          where: { id: Number(user.id) },
          data: { provider: 'google' },
        }).catch(async () => {
          // If update fails because user doesn't exist yet, ignore: Prisma adapter will create.
        });
        return true;
      } catch (e) {
        console.error('signIn callback error', e);
        return true; // fail open
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith(baseUrl)) {
          // We can inspect jwt via auth() but avoid extra DB queries here for speed.
          return url;
        }
        return baseUrl;
      } catch (e) {
        console.error('redirect callback error', e);
        return baseUrl;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          (token as AugmentedToken).id = (user as AugmentedUser).id;
          // Enrich once at sign-in with role/branch
          const dbUser = await prismaClient.user.findUnique({
            where: { id: Number(user.id) },
            select: { role: true, branchId: true }
          });
          if (dbUser) {
            (token as AugmentedToken).role = dbUser.role || null;
            (token as AugmentedToken).branchId = dbUser.branchId || null;
          }
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user && token) {
          const t = token as AugmentedToken;
          (session.user as AugmentedUser).id = String(t.id || '');
          (session.user as AugmentedUser).role = t.role ?? null;
          (session.user as AugmentedUser).branchId = t.branchId ?? null;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
})

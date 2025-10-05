import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prismaClient } from '@/database'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
  async signIn({ account, user }) {
      if (account?.provider !== 'google') return true;
      try {
        const existing = await prismaClient.user.findUnique({
          where: { id: Number(user.id) },
          select: { id: true, role: true, branchId: true }
        });
        if (!existing?.role || (existing.role !== 'client' && !existing.branchId)) {
          return true;
        }
        return true;
      } catch (e) {
        console.error('signIn callback error', e);
        return true; // fail open to not block login
      }
    },
    async redirect({ url, baseUrl }) {
      // After Google login, if user incomplete, send to completion page
      try {
        if (url.startsWith(baseUrl)) {
          // Inspect current user
          const session = await auth();
          if (session?.user?.id) {
            const u = await prismaClient.user.findUnique({
              where: { id: Number(session.user.id) },
              select: { role: true, branchId: true }
            });
            if (!u?.role || (u.role !== 'client' && !u.branchId)) {
              return baseUrl + '/auth/complete';
            }
          }
          return url;
        }
        return baseUrl;
      } catch (e) {
        console.error('redirect callback error', e);
        return baseUrl;
      }
    },
    async session({ session, user, token }) {
      try {
        if (session.user) {
          if (user) {
            session.user.id = user.id
          } else if (token) {
            session.user.id = token.id as string
          }
          // augment with role & branch
          try {
            const dbUser = await prismaClient.user.findUnique({
              where: { id: Number(session.user.id) },
              select: { role: true, branchId: true }
            });
            if (dbUser) {
              (session.user as unknown as { role?: string | null; branchId?: number | null }).role = dbUser.role || null;
              (session.user as unknown as { role?: string | null; branchId?: number | null }).branchId = dbUser.branchId || null;
            }
          } catch {
            console.warn('Session role enrichment failed');
          }
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
})

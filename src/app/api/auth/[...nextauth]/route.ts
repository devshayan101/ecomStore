import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/storefront';
const STOREFRONT_API_SECRET = process.env.STOREFRONT_API_SECRET || 'fallback-storefront-api-secret-key-123456789';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Invalid credentials');
          }

          const data = await res.json();
          if (data && data.token) {
            return {
              id: data.customer.id,
              name: data.customer.name,
              email: data.customer.email,
              accessToken: data.token,
              phone: data.customer.phone,
              address: data.customer.address
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    ] : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      })
    ] : [])
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const res = await fetch(`${API_BASE}/auth/social`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Storefront-Secret': STOREFRONT_API_SECRET
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || profile?.name || 'Social User',
              provider: account.provider,
              providerId: account.providerAccountId
            })
          });

          if (!res.ok) {
            console.error('Social login sync failed on backend');
            return false;
          }

          const data = await res.json();
          (user as any).accessToken = data.token;
          (user as any).id = data.customer.id;
          (user as any).phone = data.customer.phone;
          (user as any).address = data.customer.address;
          return true;
        } catch (error) {
          console.error('Error during social login sync:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.phone = (user as any).phone;
        token.address = (user as any).address;
      }
      
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.phone = session.phone;
        token.address = session.address;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).user.id = token.id;
        (session as any).user.accessToken = token.accessToken;
        (session as any).user.phone = token.phone;
        (session as any).user.address = token.address;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-nextauth-secret-key-123456789'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

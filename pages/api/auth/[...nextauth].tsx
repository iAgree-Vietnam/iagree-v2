import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import AuthServices from '@/src/data/auth/services/AuthServices';
import { AxiosError } from 'axios';
import Constants from '@/src/constants/Constants';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        try {
          const authService = new AuthServices();
          const res = await authService.login(credentials);

          const user = { 
            id: '', 
            email: credentials.email,
            accessToken: res.accessToken,
          };
          return user;
        } catch (error) {
          const err = error as AxiosError<any>;

          const statusCode = err.response?.status;
          const errorMessage = err?.response?.data?.message || 'Login failed';

          if (statusCode === 400) {
            // Wrong password/credentials
            throw new Error(`WRONG_PASSWORD:${errorMessage}`);
          } else if (statusCode === 401) {
            // Email not verified
            throw new Error(`EMAIL_NOT_VERIFIED:${errorMessage}`);
          } else {
            // Other errors
            throw new Error(`UNKNOWN_ERROR:${errorMessage}`);
          }
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
  },

  debug: process.env.NODE_ENV === 'development',

  callbacks: {
    async signIn({ account, profile, user }) {
      // ✅ Handle Google login validation in signIn callback
      if (account?.provider === 'google') {
        try {
          const authService = new AuthServices();
          const res = await authService.loginGoogle({
            email: profile?.email || '',
            full_name: profile?.name || '',
            google_token: account.id_token || '',
          });
          
          if (!res) {
            return false; // ✅ Return false để prevent sign in
          }
          
          // Store the access token in the account object for JWT callback
          // @ts-ignore
          user.accessToken = res.accessToken;
          return true;
          
        } catch (error) {
          console.error('Google login failed:', error);
          return false; // ✅ Return false để prevent sign in
        }
      }
      
      return true;
    },
    
    jwt: async ({ token, user, account }) => {
      // First time login với Google
      // if (account?.provider === 'google' && account.accessToken) {
      //   return {
      //     ...token,
      //     jwt: account.accessToken,
      //     provider: 'google',
      //     iat: Math.floor(Date.now() / 1000),
      //   };
      // }
      
      // // First time login với credentials
      // if (account?.provider === 'credentials' && user) {
      //   return {
      //     ...token,
      //     jwt: user.id,
      //     provider: 'credentials', 
      //     iat: Math.floor(Date.now() / 1000),
      //   };
      // }

      if (account && user) {
        //@ts-ignore
        const accessToken = user.accessToken;

        if (accessToken) {
          try {
            const authService = new AuthServices();
            const fullProfile = await authService.getFullInfo(accessToken);

            token.id = fullProfile.userId;
            token.jwt = accessToken;
            token.provider = account.provider;
          } catch (error) {
            throw new Error("Unable to fetch user profile.");
          }
        }
      }
      
      // ✅ Subsequent requests - return existing token
      return token;
    },
    
    session: async ({ session, token }) => {
      if (token) {
        try {
          //@ts-ignore
          session.user.id = token.id;
          //@ts-ignore
          session.jwt = token.jwt;
          //@ts-ignore  
          session.provider = token.provider;
          //@ts-ignore
          session.tokenIssuedAt = token.iat;
        } catch (error) {
          console.error('Session validation failed:', error);
          return session;
        }
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  events: {
    async signOut(message) {
      // console.log('User signed out:', message);
    },
  },
});

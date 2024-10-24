import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import { compare } from 'bcrypt';
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'ucok@gaul.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser) {
          throw new Error('No user found with that email');
        }
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password,
        );
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }
        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
        };
      },
      //   code in below is default
      //   async authorize(credentials, req) {
      //     // Add logic here to look up the user from the credentials supplied
      //     const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };

      //     if (user) {
      //       // Any object returned will be saved in `user` property of the JWT
      //       return user;
      //     } else {
      //       // If you return null then an error will be displayed advising the user to check their details.
      //       return null;

      //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      //     }
      //   },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.id = profile.id;
      // }
      if (user) {
        return {
          ...token,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken;
      // session.user.id = token.id;
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      };
    },
  },
};

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { compare } from 'bcryptjs';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectMongo();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          console.log('No user found with email:', credentials.email);
          throw new Error('No user found with this email');
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.log('Invalid password for email:', credentials.email);
          throw new Error('Invalid password');
        }
        console.log('User authenticated:', { id: user._id, email: user.email, name: user.name, role: user.role });
        return { id: user._id, email: user.email, name: user.name, role: user.role || 'user' };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user';
        console.log('JWT token updated with role:', token.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'user';
        console.log('Session updated with role:', session.user.role);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
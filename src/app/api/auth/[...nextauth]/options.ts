import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { getIdentifier } from "@/lib/identifier";
import { loginLimiter } from "@/lib/rateLimiter";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        // console.log(
        //   "Attempting to authorize user with identifier:",
        //   credentials,
        // );
        try {
          const identifier = await getIdentifier();
          const { success } = await loginLimiter.limit(identifier);
          if (!success) {
            throw new Error("RATE_LIMIT");
          }
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

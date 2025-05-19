import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import argon2 from "argon2";
import UserModel from "@/models/user.model";
import dbConnect from "@/helpers/dbconnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await dbConnect();
        const user = await UserModel.findOne({ email: credentials.email });
        if (user && (await argon2.verify(user.password, credentials.password))) {
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            // ...other fields
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            email: profile?.email,
          });

          if (!existingUser) {
            // Generate username from Google profile
            let username = profile?.name?.replace(/\s+/g, "").toLowerCase();

            // If no name in profile, use email local part
            if (!username) {
              username = profile?.email?.split("@")[0];
            }

            // Check for existing username
            let usernameExists = await UserModel.findOne({ username });
            while (usernameExists) {
              username = `${username}${Math.floor(Math.random() * 1000)}`;
              usernameExists = await UserModel.findOne({ username });
            }

            const newUser = new UserModel({
              email: profile?.email,
              username,
              name: profile?.name || username,
              // Add any other required fields from your UserModel
            });

            await newUser.save();
            (user as any)._id = newUser._id.toString();
            (user as any).username = newUser.username;
            (user as any).name = newUser.name;
          } else {
            // Update user object with existing data
            (user as any)._id = existingUser._id.toString();
            (user as any).username = existingUser.username;
            (user as any).name = existingUser.name;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = (user as any)._id?.toString();
        token.username = (user as any).username;

      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any)._id = token._id;
        (session.user as any).username = token.username;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // The cookies section below ensures proper handling of session cookies for OAuth flows, especially in local development.
  // Adjusting sameSite and secure options helps prevent 'State cookie was missing' errors.
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
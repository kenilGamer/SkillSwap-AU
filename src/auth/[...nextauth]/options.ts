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
            role: user.role,
            verified: user.verified
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          // Convert email to lowercase for case-insensitive comparison
          const email = profile?.email?.toLowerCase();
          
          const existingUser = await UserModel.findOne({
            email: email
          });

          if (existingUser) {
            // Existing user - update their info
            user._id = existingUser._id.toString();
            user.username = existingUser.username.toLowerCase();
            user.name = existingUser.name;
            user.role = existingUser.role || 'user';
            user.verified = existingUser.verified; // Google emails are pre-verified
          } else {
            // New user - create account with lowercase email and username
            const newUser = await UserModel.create({
              email: email,
              name: profile?.name,
              username: email?.split('@')[0].toLowerCase(),
              password: '',
              authProvider: 'google',
              role: 'user',
              verified: true // Google emails are pre-verified
            });
            
            user._id = newUser._id.toString();
            user.username = newUser.username;
            user.name = newUser.name;
            user.role = newUser.role;
            user.verified = true;
          }
          return true;
        } catch (error) {
          console.error("Error in Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
};
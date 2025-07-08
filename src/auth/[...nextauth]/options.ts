import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import argon2 from "argon2";
import UserModel, {UserRole} from "@/models/user.model";
import dbConnect from "@/helpers/dbconnect";
import { User } from "next-auth";

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        const user = await UserModel.findOne({ 
          email: credentials.email.toLowerCase() 
        }).select('+password');

        if (!user || !user.password) {
          return null;
        }

        const isValid = await argon2.verify(user.password, credentials.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || UserRole.USER,
          username: user.username,
          verified: user.verified || false
        } as User;
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
    async jwt({ token, user, account, profile }) {
      await dbConnect();

      // Always try to find the user in the DB by email
      let email = token.email || user?.email || profile?.email;
      if (email) {
        let dbUser = await UserModel.findOne({ email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.verified = dbUser.verified;
          token.email = dbUser.email;
        }
      }

      // If this is a Google login and we have a profile, create the user if not found
      if (account?.provider === "google" && profile) {
        let dbUser = await UserModel.findOne({ email: profile.email });
        if (!dbUser) {
          if (!profile.email) throw new Error("Google profile did not return an email");
          dbUser = await UserModel.create({
            email: profile.email,
            name: profile.name,
            image: profile.image || '',
            provider: "google",
            providerId: profile.sub,
            role: UserRole.USER,
            username: profile.email ? profile.email.split("@")[0] : "googleuser",
            verified: true,
            skills: [],
            bio: '',
            country: '',
            website: '',
            followers: [],
            following: [],
          });
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.verified = dbUser.verified;
          token.email = dbUser.email;
        }
      } else if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
        token.username = user.username;
        token.verified = user.verified;
        token.email = user.email;
      }

      console.log('JWT CALLBACK:', { tokenId: token.id });
      return token;
    },
    async session({ session, token }) {
      console.log('SESSION CALLBACK:', { sessionUserId: token.id });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          username: token.username,
          verified: token.verified || false
        }
      };
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};
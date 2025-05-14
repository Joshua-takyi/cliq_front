import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import client from "./libs/connect";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
// Removed unused imports to clean up the code
import { User } from "next-auth";

// Extend the User type to match what we'll return from authorize
interface ExtendedUser extends User {
  id: string;
  role?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async jwt({ token, user }) {
      // If a user has just signed in, add their information to the token
      if (user) {
        token.sub = user.id; // Ensure sub matches MongoDB _id
        token.id = user.id;

        // add token to user
        token.token = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to the session
      if (token && session.user) {
        session.user.id = (token.id as string) || token.sub || "";
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
        if (token.image) {
          session.user.image = token.image as string;
        }
        if (token.role) {
          session.user.role = token.role as string;
        }
        if (token.token) {
          session.user.token = token.token as string;
        }
      }
      return session;
    },
  },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>
      ) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          return null;
        }
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to MongoDB
          await client.connect();
          const db = client.db();
          const users = db.collection("users");

          // Find the user by email
          const user = await users.findOne({ email: credentials.email });

          // If no user found or no password (could be a GitHub oauth user)
          if (!user || !user.password) {
            return null;
          }

          // Check if password matches
          const passwordMatch = await compare(
            credentials.password as string,
            user.password as string
          );

          if (!passwordMatch) {
            return null;
          }

          // Return the user object
          return {
            id: user._id.toString(),
            email: user.email as string,
            name: (user.name as string) || "",
            image: (user.image as string) || "",
            role: (user.role as string) || "user", // Default role if not set
          } as ExtendedUser;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
});

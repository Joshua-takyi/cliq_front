import { toast } from "sonner";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier. */
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    token?: string;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    sub?: string;
    role?: string;
  }
}

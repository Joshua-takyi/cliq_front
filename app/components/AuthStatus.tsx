"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * AuthStatus Component
 *
 * Displays different UI based on authentication state:
 * - Loading: Shows a spinner
 * - Not authenticated: Shows sign-in button
 * - Authenticated: Shows user info, role badge, and action buttons
 */
export default function AuthStatus() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  // Show a loading spinner with accessible text
  if (loading) {
    return (
      <div className="flex items-center gap-2" aria-live="polite" role="status">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Verifying authentication...</span>
      </div>
    );
  }

  // Not authenticated state
  if (!session) {
    return (
      <Button
        onClick={() => signIn()}
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        aria-label="Sign in to your account"
      >
        Sign in
      </Button>
    );
  }

  // User has role in their session
  const userRole = session.user?.role as string | undefined;

  // Authenticated state with user info and role badge
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
            aria-hidden="true"
          />
        ) : (
          <div
            className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-indigo-800 font-medium">
              {session.user?.name?.[0] || "U"}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span
            className="font-medium"
            aria-label={`Signed in as ${session.user?.name || "User"}`}
          >
            {session.user?.name || "User"}
          </span>

          {/* Display user role if available */}
          {userRole && (
            <span className="text-xs text-gray-500">
              {userRole === "admin" ? (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  Admin
                </span>
              ) : (
                userRole.charAt(0).toUpperCase() + userRole.slice(1)
              )}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {/* Profile button */}
        <Button
          onClick={() => router.push("/profile")}
          variant="outline"
          className="rounded-md px-3 py-2 text-sm font-medium"
          aria-label="View your profile"
        >
          Profile
        </Button>

        {/* Sign out button */}
        <Button
          onClick={() => signOut()}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          aria-label="Sign out of your account"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

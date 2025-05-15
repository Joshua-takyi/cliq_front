"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function SignOutDialog() {
  const [isLoading, setIsLoading] = useState(false); // Track loading state for sign out
  const router = useRouter();

  // Handles the sign out process using next-auth
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" }); // Redirect to home after sign out
    } catch (error) {
      console.error("Sign out error:", error); // Log any errors
    } finally {
      setIsLoading(false);
    }
  };

  // Handles cancel action, navigates back to home
  const handleCancel = () => {
    router.push("/");
  };

  return (
    <AlertDialog open>
      {/* Dialog content with responsive max width and rounded corners for a modern look */}
      <AlertDialogContent className="max-w-md w-full rounded-xl shadow-lg">
        <AlertDialogHeader>
          {/* Title styled for prominence */}
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Sign out
          </AlertDialogTitle>
          {/* Description with subtle color for clarity */}
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to sign out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {/* Cancel button styled to fill width on mobile, inline on desktop */}
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          {/* Action button triggers sign out and shows loading state */}
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// This component uses a responsive flexbox layout to center the modal on all devices.
// The AlertDialogContent is styled for a modern, clean appearance with rounded corners and shadow.
// Button layout adapts for mobile (stacked) and desktop (inline) for better usability.

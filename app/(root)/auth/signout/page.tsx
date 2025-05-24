"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

// Accept onCancel as a prop to communicate back to parent component
interface SignOutDialogProps {
  onCancel?: () => void;
}

// SignOutDialog component that handles the dialog UI and functionality
function SignOutDialog({ onCancel }: SignOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false); // Track loading state for sign out

  // Handles the sign out process using next-auth
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" }); // Redirect to home after sign out
    } catch (error) {
      console.error("Sign out error:", error); // Log detailed error for debugging purposes
    } finally {
      setIsLoading(false);
    }
  };

  // Handles cancel action by calling the passed onCancel callback
  const handleCancel = () => {
    // Call the onCancel callback if provided to notify parent to close dialog
    if (onCancel) {
      onCancel();
    }
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

export default function SignOutPage() {
  return <SignOutDialog />;
}

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

// Interface defining the component props for type safety and documentation
interface SignOutDialogProps {
  onCancel?: () => void; // Optional callback function for cancel action
}

/**
 * SignOutDialog component - A modal dialog for confirming user sign out
 *
 * This component renders an alert dialog with confirmation controls for signing out.
 * It manages its own loading state and handles the sign out process with next-auth.
 * The parent component can be notified of cancellation via the onCancel prop.
 */
export default function SignOutDialog({ onCancel }: SignOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false); // Track loading state during sign out process

  // Handle the sign out action with loading state management
  const handleSignOut = async () => {
    setIsLoading(true); // Set loading state to true to disable button and show indicator
    try {
      await signOut({ callbackUrl: "/" }); // Sign out and redirect to homepage
    } catch (error) {
      console.error("Sign out error:", error); // Log detailed error information for debugging
      // Could add error notification here if needed
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  // Handle cancel action by calling the provided onCancel callback
  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Notify parent component to close dialog
    }
  };

  return (
    <AlertDialog open>
      {/* Dialog content with responsive styling */}
      <AlertDialogContent className="max-w-md w-full rounded-xl shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Sign out
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to sign out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {/* Cancel button - full width on mobile, inline on larger screens */}
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          {/* Sign out button with loading state */}
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

"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface RoleBasedProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

/**
 * A component that renders its children only if the current user has one of the allowed roles
 */
export default function RoleBasedAccess({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedProps) {
  const { data: session } = useSession();

  // No session means no access
  if (!session || !session.user) {
    return fallback;
  }

  const userRole = session.user.role || "user";

  // Check if the user's role is in the allowed roles
  if (!allowedRoles.includes(userRole)) {
    return fallback;
  }

  // User has one of the allowed roles
  return <>{children}</>;
}

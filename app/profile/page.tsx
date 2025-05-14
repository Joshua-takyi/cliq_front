"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin?callbackUrl=/profile");
    },
  });

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user?.name || "User"}
              className="h-24 w-24 rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-medium">{session.user?.name}</h2>
            <p className="text-gray-600">{session.user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              User ID: {session.user?.id}
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  session.user?.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : session.user?.role === "editor"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                Role: {session.user?.role || "user"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

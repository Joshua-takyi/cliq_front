"use client";

import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import Loader from "@/app/loading";

export default function PersonalInfoComponent() {
  const { getUserInfo } = useProfile();
  const { data, isLoading, refetch } = getUserInfo;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || data?.length === 0) {
    return (
      <div className="bg-transparent">
        <div className="py-6 border-b border-gray-200">
          <h1 className="text-2xl font-medium text-gray-800">Welcome, User</h1>
        </div>
        <div className="mt-6">
          <div className="bg-gray-50 p-4">
            <h2 className="font-medium text-gray-800">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-center px-4 text-sm">
                No personal information found. Please add your details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent">
      {/* Welcome header with user name - like in reference image */}
      <div className="py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Welcome, {data?.firstname || "User"}
          </h1>
          <button className="text-sm text-gray-700 hover:underline">
            Delete Account
          </button>
        </div>
      </div>

      {/* Personal information section - styled like the reference */}
      <div className="mt-6">
        {/* Section header with actions */}
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Personal Information</h2>
          <div className="space-x-4">
            <button className="text-sm text-gray-700 hover:underline">
              Change Password
            </button>
            <button className="text-sm text-gray-700 hover:underline">
              Edit
            </button>
          </div>
        </div>

        {/* User details - similar to reference image layout */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Name:</p>
            <p className="text-gray-800">
              {data?.firstname} {data?.lastname}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Contact:</p>
            <p className="text-gray-800">
              {data?.email || "No email provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number:</p>
            <p className="text-gray-800">
              {data?.phoneNumber || "No phone number provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Birthday Date:</p>
            <p className="text-gray-800">
              {data?.dateOfBirth || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

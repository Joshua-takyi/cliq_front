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
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-light text-gray-900 mb-8">Welcome</h1>
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with user name */}
      <h1 className="text-xl font-light text-gray-900 mb-8">
        {data?.name || "Welcome"}
      </h1>

      {/* ALL DATA FIELDS - Complete Information Display */}
      <div className="space-y-6">
        {/* BASIC INFORMATION */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Basic Information
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Name:</span>
              <span className="text-gray-900">
                {data?.name || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Email:</span>
              <span className="text-gray-900">
                {data?.email || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Phone:</span>
              <span className="text-gray-900">
                {data?.phone || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* ADDRESS INFORMATION */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Address Information
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Street:</span>
              <span className="text-gray-900">
                {data?.street || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">City:</span>
              <span className="text-gray-900">
                {data?.city || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Region:</span>
              <span className="text-gray-900">
                {data?.region || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Ghana Post Code:</span>
              <span className="text-gray-900">
                {data?.ghana_post || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* DELIVERY INFORMATION */}
        {/* <div className="border-b border-gray-100 pb-4"> */}
        {/*   <p className="text-xs uppercase tracking-wide text-gray-400 mb-2"> */}
        {/*     Delivery Information */}
        {/*   </p> */}
        {/*   <div className="flex justify-between"> */}
        {/*     <span className="text-gray-600 text-sm">Instructions:</span> */}
        {/*     <span className="text-gray-900 text-right max-w-xs"> */}
        {/*       {data?.deliverto || "No special instructions"} */}
        {/*     </span> */}
        {/*   </div> */}
        {/* </div> */}

        {/* ACCOUNT TIMESTAMPS */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Account Information
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Created:</span>
              <span className="text-gray-900 text-sm">
                {data?.created_at
                  ? new Date(data.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not available"}
              </span>
            </div>
            {data?.updated_at &&
              data?.created_at &&
              new Date(data.updated_at).getTime() !==
                new Date(data.created_at).getTime() && (
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Last Updated:</span>
                  <span className="text-gray-900 text-sm">
                    {new Date(data.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* DEBUG INFO - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-50 rounded text-xs"> */}
        {/*   <p className="text-gray-500 mb-2">Debug Info:</p> */}
        {/*   <pre className="text-gray-600 overflow-auto"> */}
        {/*     {JSON.stringify(data, null, 2)} */}
        {/*   </pre> */}
        {/* </div> */}
      </div>
    </div>
  );
}

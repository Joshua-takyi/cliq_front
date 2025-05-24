"use client";

import { useVerifyPayment } from "@/app/services/verifyPayment";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentCompleted() {
  // Get payment reference from URL parameters
  const ref = useSearchParams();
  const reference = ref.get("reference") || "";
  const fallbackRef = ref.get("trxref") || "";

  // Track verification status
  const [verificationStatus, setVerificationStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
    data?: any;
  }>({ status: "idle" });

  // Get the verification mutation
  const { mutate: verifyPayment } = useVerifyPayment();

  // Effect to trigger verification when component mounts
  useEffect(() => {
    // Validate if we have a reference to verify
    if (!reference && !fallbackRef) {
      setVerificationStatus({
        status: "error",
        message: "No payment reference provided. Cannot verify your payment.",
      });
      return;
    }

    // Set loading state
    setVerificationStatus({
      status: "loading",
      message: "Verifying your payment...",
    });

    // Trigger the verification process
    try {
      verifyPayment(
        { reference: reference || fallbackRef },
        {
          // Handle success case
          onSuccess: (responseData) => {
            setVerificationStatus({
              status: "success",
              message: "Payment verification completed successfully!",
              data: responseData,
            });
          },
          // Handle error case
          onError: (err: any) => {
            setVerificationStatus({
              status: "error",
              message:
                err?.message ||
                "Failed to verify payment. Please contact support.",
            });
          },
        }
      );
    } catch (err: any) {
      setVerificationStatus({
        status: "error",
        message:
          err?.message || "An unexpected error occurred during verification.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, fallbackRef]); // Only run when reference changes

  // Render different UI based on verification status
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Payment Verification</h1>

      {/* Loading state */}
      {verificationStatus.status === "loading" && (
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Verifying your payment...</p>
        </div>
      )}

      {/* Error state */}
      {verificationStatus.status === "error" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">
                {verificationStatus.message || "Error verifying payment"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {verificationStatus.status === "success" && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-green-700">
                {verificationStatus.message || "Payment verified successfully"}
              </p>
            </div>
          </div>

          {/* Order details could be shown here */}
          <div className="mt-4 p-4 border border-gray-200 rounded">
            <h3 className="font-medium mb-2">Transaction Details</h3>
            <p className="text-sm text-gray-600">
              Reference: {reference || fallbackRef}
            </p>
            {verificationStatus.data && (
              <div className="mt-2">
                {/* Display any relevant data from the verification response */}
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(verificationStatus.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-6 flex justify-between">
        <a href="/" className="text-blue-500 hover:text-blue-700">
          Return to Home
        </a>
        <a href="/profile/order" className="text-blue-500 hover:text-blue-700">
          View Orders
        </a>
      </div>
    </div>
  );
}

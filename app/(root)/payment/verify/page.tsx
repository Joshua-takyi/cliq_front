"use client";

import { useVerifyPayment } from "@/app/services/verifyPayment";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Type definitions for better code organization
type VerificationStatus = "idle" | "loading" | "success" | "error";

interface VerificationData {
  orderId?: string;
  amount?: number;
  transactionDate?: string;
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  [key: string]: any;
}

interface VerificationState {
  status: VerificationStatus;
  message?: string;
  data?: VerificationData;
}

export default function PaymentCompleted() {
  // Get payment reference from URL parameters.
  const searchParams = useSearchParams();
  const paymentReference = searchParams.get("reference") || "";
  const transactionReference = searchParams.get("trxref") || ""; // Fallback reference if "reference" is not present

  // Consolidate reference: use the first available one.
  const activeReference = paymentReference || transactionReference;

  // State to track the verification process (idle, loading, success, error)
  const [verificationStatus, setVerificationStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string; // User-facing message regarding the status
    data?: VerificationData; // Data received upon successful verification
  }>({ status: "idle" });

  // Get the mutation function from the custom hook for verifying payment.
  // The hook itself handles the asynchronous logic of the API call.
  const { mutate: verifyPayment } = useVerifyPayment();

  // useEffect hook to trigger payment verification when the component mounts or activeReference changes.
  useEffect(() => {
    // If no payment reference is found in the URL, set an error state immediately.
    if (!activeReference) {
      setVerificationStatus({
        status: "error",
        message: "No payment reference found. Unable to verify your payment.",
      });
      return; // Exit early if no reference
    }

    // Set the status to loading before initiating the verification API call.
    setVerificationStatus({
      status: "loading",
      message: "Verifying your payment, please wait...",
    });

    // Call the verifyPayment mutation.
    verifyPayment(
      { reference: activeReference }, // Payload for the verification API
      {
        // Callback for successful verification
        onSuccess: (responseData) => {
          setVerificationStatus({
            status: "success",
            message: "Your payment has been successfully verified!",
            data: responseData, // Store the data returned from the API
          });
        },
        // Callback for errors during verification
        onError: (error: any) => {
          // Consider defining a more specific error type
          setVerificationStatus({
            status: "error",
            // Construct a user-friendly error message. Attempt to use server-provided message if available.
            message:
              error?.response?.data?.message || // Message from API error response
              error?.message || // General error message
              "An error occurred while verifying your payment. Please contact support if the issue persists.",
          });
        },
      }
    );
    // Dependencies for useEffect: re-run if activeReference or verifyPayment function changes.
  }, [activeReference, verifyPayment]);

  // Helper function to render an appropriate icon based on the verification status.
  const renderStatusIcon = () => {
    switch (verificationStatus.status) {
      case "loading":
        return (
          <ArrowPathIcon
            className="h-12 w-12 text-blue-500 animate-spin"
            aria-label="Loading"
          />
        );
      case "success":
        return (
          <CheckCircleIcon
            className="h-12 w-12 text-green-500"
            aria-label="Success"
          />
        );
      case "error":
        return (
          <XCircleIcon className="h-12 w-12 text-red-500" aria-label="Error" />
        );
      default:
        return null; // No icon for 'idle' or other states
    }
  };

  // Main JSX for the component
  return (
    <div className=" bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8  p-8 sm:p-10 rounded-xl shadow-xl text-center">
        {/* Container for the status icon */}
        <div className="flex justify-center items-center h-12">
          {renderStatusIcon()}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Payment Verification
        </h1>

        {/* Display the status message to the user */}
        {verificationStatus.message && (
          <p
            className={`text-sm sm:text-base ${
              verificationStatus.status === "error"
                ? "text-red-600"
                : verificationStatus.status === "success"
                ? "text-green-700"
                : "text-gray-600"
            }`}
          >
            {verificationStatus.message}
          </p>
        )}

        {/* Section to display details upon successful verification */}
        {verificationStatus.status === "success" && verificationStatus.data && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-left space-y-3 text-sm">
            <h3 className="text-md font-semibold text-green-800 mb-2">
              Transaction Confirmed
            </h3>
            <p className="text-gray-700">
              <strong>Reference:</strong> {activeReference}
            </p>
            {/* Conditionally display order ID if available */}
            {verificationStatus.data.orderId && (
              <p className="text-gray-700">
                <strong>Order ID:</strong> {verificationStatus.data.orderId}
              </p>
            )}
            {/* Conditionally display amount if available, with formatting */}
            {verificationStatus.data.amount !== undefined && (
              <p className="text-gray-700">
                <strong>Amount:</strong>{" "}
                {typeof verificationStatus.data.amount === "number"
                  ? `$${(verificationStatus.data.amount / 100).toFixed(2)}` // Assuming amount is in cents
                  : verificationStatus.data.amount}
              </p>
            )}
            {/* Add more details from verificationStatus.data as needed */}
          </div>
        )}

        {/* Section to display information when verification fails */}
        {verificationStatus.status === "error" && activeReference && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-left space-y-2 text-sm">
            <h3 className="text-md font-semibold text-red-800 mb-2">
              Verification Issue
            </h3>
            <p className="text-gray-700">
              <strong>Reference:</strong> {activeReference}
            </p>
            <p className="text-gray-700">
              If you completed your payment and see this message, please save
              the reference above and contact our support team for assistance.
            </p>
          </div>
        )}

        {/* Call to action buttons: visible after verification attempt (success or error) */}
        {(verificationStatus.status === "success" ||
          verificationStatus.status === "error") && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/">
              <Button className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                Return to Home
              </Button>
            </Link>
            <Link href="/profile/order">
              <Button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                View My Orders
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

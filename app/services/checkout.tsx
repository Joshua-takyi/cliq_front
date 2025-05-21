"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CheckoutRequest, CheckoutResponse } from "@/types/product_types";

export const useCheckout = () => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  // We use window.location.href for redirects instead of router
  const { data: session } = useSession();

  // Return the mutation with improved error handling and loading states
  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationKey: ["checkout"],
    mutationFn: async (data: CheckoutRequest) => {
      if (!session || !session.user) {
        throw new Error(
          "Authentication required. Please sign in to proceed with checkout."
        );
      }

      // Validate payment amount
      if (!data.amount || data.amount <= 0) {
        throw new Error(
          "Invalid payment amount. Please ensure your cart has items with valid prices."
        );
      }

      // Validate delivery details if provided
      if (data.deliveryDetails) {
        const { firstName, phoneNumber, email, region } = data.deliveryDetails;
        if (!firstName || !phoneNumber || !email || !region) {
          throw new Error(
            "Missing required delivery information. Please complete all required fields."
          );
        }
      }

      // Get the origin for constructing absolute URLs
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      // Create complete request with callback URL to payment-complete page
      const requestData = {
        ...data,
        callback_url: `${origin}/payment-complete`, // Add callback URL to return to payment-complete page
      };

      // Store delivery details in localStorage for retrieval after payment
      if (data.deliveryDetails) {
        localStorage.setItem(
          "deliveryDetails",
          JSON.stringify(data.deliveryDetails)
        );
        // Set timestamp to detect stale delivery details
        localStorage.setItem("deliveryDetailsTimestamp", Date.now().toString());
      }

      try {
        const res = await axios.post(
          `${API_URL}/protected/checkout`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
            withCredentials: true,
          }
        );

        // Validate response data
        if (!res.data) {
          throw new Error("No data returned from checkout API");
        }

        // Log success for debugging
        console.log("Checkout response:", res.data);

        return res.data;
      } catch (error) {
        // Enhanced error handling with more details
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          const errorMessage = error.response?.data?.message || error.message;

          // Handle specific error codes
          if (statusCode === 401) {
            throw new Error("Authentication failed. Please sign in again.");
          } else if (statusCode === 400) {
            throw new Error(`Invalid request: ${errorMessage}`);
          } else if (statusCode === 500) {
            throw new Error("Server error. Please try again later.");
          }
        }

        // Generic error handling
        throw new Error(
          `Error during checkout: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },

    onSuccess: (data) => {
      console.log("Checkout successful:", data);
      if (data?.authorization_url) {
        // Store payment reference in localStorage for verification later
        if (data?.reference) {
          localStorage.setItem("paymentReference", data.reference);

          // Also store timestamp to detect stale references
          localStorage.setItem("paymentTimestamp", Date.now().toString());
        }

        localStorage.setItem(
          "paymentReturnUrl",
          window.location.origin + "/payment-complete"
        );

        toast?.success?.("Redirecting to payment gateway...");

        console.info("Redirecting to payment gateway:", data.authorization_url);

        setTimeout(() => {
          window.location.href = data.authorization_url;
        }, 1500);
      } else {
        console.error("Missing authorization URL in response");
        toast?.error?.("Checkout failed: Invalid payment gateway response");
      }
    },

    onError: (error) => {
      console.error("Checkout error:", error.message);
      toast?.error?.(error.message || "Checkout failed. Please try again.");
    },
  });
};

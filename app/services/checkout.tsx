"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Enhanced interface to include shipping details for complete order processing
interface CheckoutPayload {
  amount: number;
  email: string;
  shippingInfo?: {
    name: string;
    phone: string;
    email?: string;
    region: string;
    street: string;
    ghana_post?: string;
    city?: string;
    notes?: string;
  };
}

export const useCheckout = () => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
      : process.env.NEXT_PUBLIC_PRODUCTION || "/api";

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      if (!payload.amount || payload.amount <= 0) {
        throw new Error("Invalid payment amount: must be greater than zero");
      }

      if (!payload.email) {
        throw new Error("Invalid payment data: email is required");
      }

      console.log("Initiating payment with data:", payload);

      const response = await axios.post(
        `${API_URL}/payment/checkout`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Payment API response:", response.data);
      return response.data;
    },
    onSuccess: (responseData) => {
      if (responseData?.data?.authorization_url) {
        toast.success("Payment initialized successfully");
        console.log("Redirecting to:", responseData.data.authorization_url);
        window.location.href = responseData.data.authorization_url;
      }
      // Handle Paystack nested response format
      else if (responseData?.data?.data?.authorization_url) {
        toast.success("Payment initialized successfully");
        console.log(
          "Redirecting to:",
          responseData.data.data.authorization_url
        );
        window.location.href = responseData.data.data.authorization_url;
        // localStorage.setItem("reference", responseData.data.data.reference);
      } else {
        toast.error(
          responseData?.message ||
            responseData?.data?.message ||
            "Failed to get authorization URL from payment provider"
        );
        console.error(
          "Payment response missing authorization URL:",
          responseData
        );
      }
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while connecting to the payment service";
      toast.error(errorMessage);
      console.error("Payment initialization failed:", error);
    },
  });
};

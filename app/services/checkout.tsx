"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CheckoutProps {
  amount: number; // Using server-expected parameter name
  email: string;
}

export const useCheckout = () => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  const router = useRouter();
  const { data: session } = useSession();
  return useMutation({
    mutationKey: ["checkout"],
    mutationFn: async (data: CheckoutProps) => {
      // Check if there's an active session first
      if (!session || !session.user) {
        throw new Error(
          "Authentication required. Please sign in to proceed with checkout."
        );
      }

      try {
        // Include the authorization token in the request headers
        const res = await axios.post(`${API_URL}/protected/checkout`, data, {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header using the session token
            Authorization: `Bearer ${session?.user?.token}`,
          },
          withCredentials: true,
        });

        if (!res.data) {
          throw new Error("No data returned from checkout API");
        }
        console.log("Checkout response:", res.data);

        return res.data;
      } catch (error) {
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
        // Store payment reference in localStorage for extra resilience (optional)
        if (data?.reference) {
          localStorage.setItem("paymentReference", data.reference);
        }
        // Redirect to payment gateway
        router.push(data.authorization_url);
      } else {
        console.error("Missing authorization URL in response");
      }
    },

    onError: (error) => {
      console.error("Checkout error:", error.message);
    },
  });
};

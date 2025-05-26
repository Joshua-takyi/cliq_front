"use client";

import { UseCart } from "@/hooks/useCart";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface VerifyPaymentPayload {
  reference: string;
}
export const useVerifyPayment = () => {
  const { ClearCart } = UseCart();
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
      : process.env.NEXT_PUBLIC_PRODUCTION || "/api";

  return useMutation({
    mutationFn: async (reference: VerifyPaymentPayload) => {
      const res = await axios.post(
        `${API_URL}/payment/verifyPayment`,
        reference,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format from payment verification");
      }
      return res.data.data;
    },

    onSuccess: () => {
      // debug console.log("Payment verification response:", data);
      // console.log("Payment verification successful:", data);
      // Handle successful payment verification logic here
      //   clear cart
      ClearCart.mutate();
      //   toast.success("cart cleared successfully");
      //   queryClient.invalidateQueries({ queryKey: ["get_cart"] });
    },
    onError: (error) => {
      console.error("Payment verification failed:", error);
      // Handle payment verification error logic here
      //   toast.error("Failed to verify payment");
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    },
  });
};

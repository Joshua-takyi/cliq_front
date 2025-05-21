"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { UseCart } from "@/hooks/useCart";
import {
  CheckoutFormData,
  PaymentVerificationResponse,
} from "@/types/product_types";

export const useVerifyPayment = () => {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] =
    useState<CheckoutFormData | null>(null);
  const { ClearCart } = UseCart();

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  // Extract the reference and delivery details from URL parameters and localStorage on component mount
  useEffect(() => {
    // Try to get reference from various URL parameters Paystack might use
    const urlReference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transaction_reference");

    // If not found in URL, try to get it from localStorage (fallback)
    const localStorageReference = localStorage.getItem("paymentReference");

    // Try to get delivery details from localStorage
    const localStorageDeliveryDetails = localStorage.getItem("deliveryDetails");
    if (localStorageDeliveryDetails) {
      try {
        const parsedDeliveryDetails = JSON.parse(localStorageDeliveryDetails);
        setDeliveryDetails(parsedDeliveryDetails);
      } catch (error) {
        console.error("Error parsing delivery details:", error);
      }
    }

    //! Log information for debugging
    // console.info("Payment verification - URL reference:", urlReference);
    // console.info(
    //   "Payment verification - LocalStorage reference:",
    //   localStorageReference
    // );
    // console.info(
    //   "Payment verification - Delivery details:",
    //   localStorageDeliveryDetails
    // );

    if (urlReference) {
      setReference(urlReference);

      // Also save to localStorage as a backup
      if (urlReference !== localStorageReference) {
        localStorage.setItem("paymentReference", urlReference);
      }
    } else if (localStorageReference) {
      setReference(localStorageReference);
    } else {
      console.warn("No payment reference found in URL or localStorage");
    }
  }, [searchParams]);

  // Query to verify payment using the reference
  const verifyPaymentQuery = useQuery<PaymentVerificationResponse, Error>({
    queryKey: ["verifyPayment", reference],
    queryFn: async () => {
      if (!reference) {
        throw new Error("Missing payment reference");
      }

      try {
        //! Log the reference for debugging
        // console.info("Verifying payment with reference:", reference);

        // Include delivery details in the verification request if available
        const requestParams = new URLSearchParams();
        requestParams.append("reference", reference);

        if (deliveryDetails) {
          requestParams.append(
            "deliveryDetails",
            JSON.stringify(deliveryDetails)
          );
        }

        const response = await axios.get(
          `${API_URL}/verify_payment?${requestParams.toString()}`,
          {
            withCredentials: true,
          }
        );

        //! console.info("Payment verification response:", response.data);

        // Clear reference and delivery details from localStorage after verification
        localStorage.removeItem("paymentReference");
        localStorage.removeItem("deliveryDetails");
        localStorage.removeItem("paymentTimestamp");
        localStorage.removeItem("deliveryDetailsTimestamp");

        if (response.data.status === "success") {
          try {
            ClearCart.mutate();
          } catch (clearError) {
            console.error("Failed to clear cart:", clearError);
          }
        }

        return response.data;
      } catch (error) {
        throw new Error(
          `Payment verification failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
    enabled: !!reference,
    retry: 2,
    staleTime: Infinity,
  });

  return {
    verifyPaymentQuery,
    reference,
    deliveryDetails,
  };
};

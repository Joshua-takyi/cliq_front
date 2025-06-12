"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

interface ReviewProps {
  product_id: string;
  user_name: string;
  user_email: string;
  comment?: string;
  rating?: number;
}

type ApiResponse = {
  success: boolean;
  message: string;
  data: ReviewProps;
};

export const useReviews = () => {
  const API_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  const { data: session } = useSession();

  const queryClient = useQueryClient();

  // Mutation for adding a review
  const addReview = useMutation<ApiResponse, Error, ReviewProps>({
    mutationFn: async (reviewProps) => {
      const res = await axios.post(
        `${API_URL}/protected/add_review`,
        reviewProps,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
          withCredentials: true,
        }
      );
      if (!res.data) {
        return {
          success: false,
          message: "Failed to add review - no response from server",
          data: reviewProps, // fallback to input data for error handling
        };
      }
      return res.data as ApiResponse;
    },
    onSuccess: () => {
      // Invalidate and refetch reviews cache after successful review addition
      queryClient.invalidateQueries({ queryKey: ["product_reviews"] });
    },
  });

  return {
    addReview,
  };
};

// Separate hook for fetching reviews for a specific product
// This follows React Hook rules by being a top-level hook
export const useProductReviews = (productId: string) => {
  const API_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  return useQuery({
    queryKey: ["product_reviews", productId],
    queryFn: async () => {
      // Make API call to fetch reviews for the specific product using the correct endpoint
      const res = await axios.get(`${API_URL}/product/${productId}/reviews`);
      if (!res.data) {
        throw new Error(
          "Failed to fetch reviews - no data returned from server"
        );
      }
      return res.data;
    },
    enabled: !!productId, // Only run query if product ID is provided and valid
  });
};

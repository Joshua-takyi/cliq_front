"use client";

import { CheckoutFormData } from "@/types/product_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const API_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  // Define a mutation for creating a user profile with proper type annotations
  const createUserProfile = useMutation<
    CheckoutFormData,
    Error,
    CheckoutFormData
  >({
    mutationKey: ["createUserProfile"], // Unique key for this mutation
    mutationFn: async (data: CheckoutFormData): Promise<CheckoutFormData> => {
      try {
        const res = await axios.post(
          `${API_URL}/protected/add_user_address`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (!res.data) {
          throw new Error(
            `Failed to create user profile: No data returned from server`
          );
        }
        console.log("User profile created successfully:", res.data);
        return res.data.profile || res.data;
      } catch (error) {
        // Detailed error handling with specific error messages
        if (axios.isAxiosError(error)) {
          if (error.response) {
            throw new Error(
              `Server error: ${error.response.status} - ${
                error.response.data?.message || error.response.statusText
              }`
            );
          } else if (error.request) {
            throw new Error(
              `Network error: No response received from server. Please check your connection.`
            );
          } else {
            throw new Error(`Request configuration error: ${error.message}`);
          }
        }
        throw error;
      }
    },

    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["get_user_profile"] });
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error occurred while creating user profile";

      console.error("Error creating user profile:", errorMessage);
    },
  });

  const getUserInfo = useQuery({
    queryKey: ["get_user_info"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/protected/get_user_address`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        withCredentials: true,
      });
      return res.data?.data || res.data;
    },
    enabled: false,
  });
  return {
    getUserInfo,
    createUserProfile,
  };
};

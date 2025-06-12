"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
    : process.env.NEXT_PUBLIC_PRODUCTION || "/api";

export const useOrder = () => {
  const { data: session } = useSession();
  const getOrder = useQuery({
    queryKey: ["user_order"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/order/user-orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          withCredentials: true,
        });

        if (!res.data) {
          throw new Error(
            "No response data received from server during order retrieval"
          );
        }

        if (!res.data.data) {
          console.warn("Server returned empty data field for user orders");
          return [];
        }

        // Validate that the response contains an array of orders
        if (!Array.isArray(res.data.data)) {
          console.error(
            "Server returned non-array data for user orders:",
            res.data.data
          );
          throw new Error(
            "Invalid data format received from server - expected array of orders"
          );
        }

        return res.data.data;
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (updated API)
  });

  const getOrderById = (id: string) => {
    return useQuery({
      queryKey: ["order_by_id", id],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/order/${id}`);
        if (!res?.data) {
          throw new Error("No data found");
        }
        return res.data;
      },
    });
  };
  return {
    getOrder,
    getOrderById,
  };
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order_by_id", id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/order/${id}`);
      if (!res?.data) {
        throw new Error("No data found");
      }
      return res.data;
    },
    enabled: !!id,
  });
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type AdminActionsResponse = {
  success: boolean;
  message: string;
};

interface UpdateOrderStatusProps {
  id: string; // Changed from _id to id to match backend API expectation
  deliveryStatus: string;
}
export const useAdminActions = () => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
      : process.env.NEXT_PUBLIC_PRODUCTION || "/api";

  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation<
    AdminActionsResponse,
    Error, // Specify error type for better typing
    UpdateOrderStatusProps
  >({
    mutationKey: ["delivery_status"], // Consider making it specific: ["delivery_status", data._id]
    mutationFn: async (data: UpdateOrderStatusProps) => {
      try {
        // Send PATCH request to update order status with proper error handling
        const res = await axios.patch(
          `${API_URL}/admin/orders/updateStatus`,
          data // data now contains { id, deliveryStatus } matching backend expectations
        );

        // Check if the response indicates failure even with 200 status
        if (!res.data.success) {
          throw new Error(
            res.data.message ||
              "Failed to update order status - server returned unsuccessful response"
          );
        }

        return {
          success: true,
          message: res.data.message || "Order status updated successfully",
        };
      } catch (error) {
        // Handle Axios-specific errors with detailed error messages
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error || // Backend might return 'error' instead of 'message'
            `HTTP ${error.response?.status}: Failed to update order status`;
          throw new Error(errorMessage);
        }
        // Handle non-Axios errors
        throw new Error(
          "An unexpected error occurred while updating order status"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });

  return { updateOrderStatus };
};

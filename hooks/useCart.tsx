"use client";

import { CartData } from "@/types/product_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface CartProps {
  color: string;
  model: string;
  quantity: number;
  product_Id: string;
}
export const UseCart = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const API_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  const AddToCart = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: async (data: CartProps) => {
      const res = await axios.post(`${API_URL}/protected/add_to_cart`, data, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["get_cart"] });
      }
    },
  });

  interface RemoveFromCartProps {
    id: string; // Changed from product_Id to id to match the cart item's unique ID
  }
  const RemoveFromCart = useMutation({
    mutationFn: async (data: RemoveFromCartProps) => {
      const res = await axios.delete(`${API_URL}/protected/remove_from_cart`, {
        data,
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Item removed from cart successfully");
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["get_cart"] });
      }
    },
  });

  // Update cart item
  interface UpdateCartProps {
    action: string;
    quantity: number;
    color: string;
    product_Id: string; // Changed back to match the CartData interface
  }
  const UpdateCart = useMutation({
    mutationKey: ["update_cart"],
    mutationFn: async (data: UpdateCartProps) => {
      const res = await axios.patch(`${API_URL}/protected/update_cart`, data, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Cart updated successfully");
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["get_cart"] });
      }
    },

    onError: (error) => {
      toast.error("Failed to update cart");
    },
  });

  const ClearCart = async () => {
    useMutation({});
  };

  const GetCart = useQuery<CartData>({
    queryKey: ["get_cart"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/protected/get_cart`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        withCredentials: true,
      });
      if (!res.data) {
        throw new Error("No data found");
      }
      return res.data;
    },
  });
  return {
    AddToCart,
    RemoveFromCart,
    UpdateCart,
    ClearCart,
    GetCart,
  };
};
``;

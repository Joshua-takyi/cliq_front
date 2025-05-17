"use client";

import { CartData } from "@/types/product_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  const RemoveFromCart = async () => {
    useMutation({
      mutationKey: ["removeFromCart"],
      mutationFn: async (data: CartProps) => {
        const res = await axios.delete(`${API_URL}/cart`, { data });
        if (!res.data) {
          throw new Error("No data found");
        }
        return res.data;
      },
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      },
    });
  };
  const UpdateCart = async () => {
    useMutation({
      mutationKey: ["updateCart"],
      mutationFn: async (data: CartProps) => {
        const res = await axios.put(`${API_URL}/cart`, data);
        return res.data;
      },
    });
  };
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

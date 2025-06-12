"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface OrderProps {
  _id: string;
  email: string;
  payment: {
    method: string;
    status: string;
  };
  deliveryStatus: "pending" | "shipped" | "delivered" | "cancelled";
  amount: number;
  userId: string;
  items: {
    id: string;
    title: string;
    slug: string;
    quantity: number;
    price: number;
    color: string;
  };
  createdAt: string;
}

type AdminOrdersResponse = {
  success: boolean;
  message: string;
  data: OrderProps[];
};

export const GetOrdersByAdmin = (page = 1, limit = 20) => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
      : process.env.NEXT_PUBLIC_PRODUCTION || "/api";

  return useQuery<AdminOrdersResponse>({
    queryKey: ["adminOrders", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/admin/orders/getOrders?limit=${limit}&page=${page}`,
      );

      // optional defensive check
      if (!res.data || !res.data.success) {
        throw new Error("Failed to fetch admin orders");
      }
      // console.log("Admin Orders Data:", res.data);
      return res.data;
    },
  });
};

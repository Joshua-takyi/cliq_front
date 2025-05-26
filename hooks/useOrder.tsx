"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useOrder = () => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT || "/api"
      : process.env.NEXT_PUBLIC_PRODUCTION || "/api";
  const getOrder = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get_order`);
      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format from order retrieval");
      }
      return res.data.data;
    },
    enabled: false,
  });

  return {
    getOrder,
  };
};

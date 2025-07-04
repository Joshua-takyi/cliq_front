import { ProductProps } from "@/types/product_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProductData {
  count: number;
  duration: string;
  message: string;
  products: ProductProps[];
}

export const useAdminProducts = (page = 1, limit = 20) => {
  const API_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  return useQuery<ProductData>({
    queryKey: ["adminProducts", page, limit],
    queryFn: async () => {
      // Make the API request to get products
      const res = await axios.get(
        `${API_URL}/products?limit=${limit}&page=${page}`,
      );
      if (!res.data) {
        throw new Error("No data found");
      }
      return res.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: "always",
  });
};

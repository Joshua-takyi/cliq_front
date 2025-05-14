"use client";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, ProductProps } from "../types/product_types";
import { useSession } from "next-auth/react";

// Define a custom hook for product-related operations
export const useProduct = () => {
  // Access the query client for cache invalidation
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  // CREATE PRODUCT
  const createProduct = useMutation<
    ApiResponse<ProductProps>,
    unknown,
    ProductProps
  >({
    mutationKey: ["createProduct"],
    mutationFn: async (product: ProductProps) => {
      // Format product data to match backend expectations
      const productData = {
        ...product,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),

        category: Array.isArray(product.category) ? product.category : [],
        images: Array.isArray(product.images) ? product.images : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        models: Array.isArray(product.models) ? product.models : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        materials: Array.isArray(product.materials) ? product.materials : [],
        details: Array.isArray(product.details) ? product.details : [],
        features: Array.isArray(product.features) ? product.features : [],

        // Convert boolean fields to actual booleans
        isAvailable: Boolean(product.isAvailable),
        isNew: Boolean(product.isNew),
        isOnSale: Boolean(product.isOnSale),
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),

        // Handle numeric fields
        discount: product.discount !== undefined ? Number(product.discount) : 0,
        warranty: product.warranty !== undefined ? Number(product.warranty) : 0,
      };

      // Log the data being sent to help with debugging

      const res = await axios.post<ApiResponse<ProductProps>>(
        `${API_URL}/protected/create_product`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session?.user?.token}`, // Use the token from the session
          },
          withCredentials: true, // Enable sending cookies and auth headers cross-origin
        }
      );

      // Return the response data to match the expected type
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // More aggressive cache invalidation
        queryClient.invalidateQueries({
          queryKey: ["listProducts"],
          refetchType: "active",
        });

        // Force a refetch to ensure fresh data
        queryClient.refetchQueries({
          queryKey: ["listProducts"],
        });
      }
    },
  });

  //   UPDATE PRODUCT

  const updateProduct = useMutation<
    ApiResponse<ProductProps>,
    unknown,
    ProductProps
  >({
    mutationKey: ["updateProduct"],
    mutationFn: async (product: ProductProps) => {
      // Format product data to match backend expectations, similar to createProduct
      const productData = {
        ...product,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),

        category: Array.isArray(product.category) ? product.category : [],
        images: Array.isArray(product.images) ? product.images : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        models: Array.isArray(product.models) ? product.models : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        materials: Array.isArray(product.materials) ? product.materials : [],
        details: Array.isArray(product.details) ? product.details : [],
        features: Array.isArray(product.features) ? product.features : [],

        // Convert boolean fields to actual booleans
        isAvailable: Boolean(product.isAvailable),
        isNew: Boolean(product.isNew),
        isOnSale: Boolean(product.isOnSale),
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),

        // Handle numeric fields
        discount: product.discount !== undefined ? Number(product.discount) : 0,
        warranty: product.warranty !== undefined ? Number(product.warranty) : 0,
      };

      try {
        const res = await axios.patch<ApiResponse<ProductProps>>(
          `${API_URL}/protected/update_product/${product.id}`,
          productData,
          {
            headers: {
              "Content-Type": "application/json",
              // Send token as Bearer token in Authorization header
              Authorization: `Bearer ${session?.user?.token}`,
            },
            withCredentials: true,
          }
        );

        // Ensure we're returning data with correct structure
        return {
          success: res.data.success || res.status === 200,
          message: res.data.message || "Product updated successfully",
          product: res.data.product || undefined, // Ensure compatibility with ApiResponse type
        };
      } catch (error: any) {
        // Ensure consistent error handling
        console.error("Update product error:", error);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update product"
        );
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["adminProducts"] }); // Invalidate the admin products
        // Query for the updated product
        if (data.product?.id) {
          queryClient.invalidateQueries({
            queryKey: ["updatedProduct", data.product.id],
          });
        }
      }
    },
  });

  //   GET PRODUCTS

  const getProducts = (limit: number, page: number) =>
    useQuery<ProductProps[], unknown>({
      queryKey: ["listProducts", limit, page], // Include limit and page in the queryKey
      queryFn: async () => {
        // Get a fresh token when making the request

        const res = await axios.get<ApiResponse<ProductProps[]>>(
          `${API_URL}/products?limit=${limit}&page=${page}` // Use limit and page in the API URL
        );
        // Extract and return only the product array from the API response
        return res?.data?.product || [];
      },
      // Add staleTime and refetch settings to improve cache behavior
      staleTime: 1000 * 60, // Consider data stale after 1 minute
      refetchOnWindowFocus: true, // Refetch when the window regains focus
    });

  const getProductById = (id: string) =>
    useQuery<ProductProps, unknown>({
      queryKey: ["product", id],
      queryFn: async () => {
        const res = await axios.get<ApiResponse<ProductProps>>(
          `${API_URL}/get_product_by_id/${id}`
        );
        if (!res.data?.product) {
          throw new Error("Product not found");
        }
        queryClient.invalidateQueries({ queryKey: ["product", id] });
        return res.data.product;
      },
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    });

  const deleteProduct = useMutation<ApiResponse<ProductProps>, unknown, string>(
    {
      mutationKey: ["deleteProduct"],
      // the id will be passed as a request body
      mutationFn: async (id: string) => {
        const res = await axios.delete<ApiResponse<ProductProps>>(
          `${API_URL}/protected/delete_product`,
          {
            data: { id },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
            withCredentials: true,
          }
        );
        if (!res.data?.success) {
          throw new Error("Failed to delete product");
        }
        return res.data;
      },
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
          queryClient.invalidateQueries({ queryKey: ["listProducts"] });
        }
      },
    }
  );
  return {
    createProduct,
    updateProduct,
    getProducts,
    getProductById,
    deleteProduct,
  };
};

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
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

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

  interface ProductData {
    count: number;
    duration: string;
    message: string;
    products: ProductProps[];
  }
  //   GET PRODUCTS

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

  // FILTER PRODUCTS
  const filterProducts = (filters: any, limit: number, page: number) =>
    useQuery({
      queryKey: ["filterProducts", filters, limit, page],
      queryFn: async () => {
        // Build query parameters
        const params = new URLSearchParams();

        // Add pagination parameters
        params.append("limit", String(limit));
        params.append("page", String(page));

        // Add filter parameters if they exist
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice)
          params.append("min_price", String(filters.minPrice));
        if (filters.maxPrice)
          params.append("max_price", String(filters.maxPrice));
        // Support both search and q parameters (q is used when coming from search component)
        // If search parameter exists and is not empty or undefined, add it to the request
        if (
          filters.search &&
          typeof filters.search === "string" &&
          filters.search.trim() !== ""
        ) {
          // console.log("Adding search parameter:", filters.search);
          // Use 'q' parameter instead of 'search' for better consistency with search component
          params.append("q", filters.search.trim());
        } else {
          console.log("No search parameter to add");
        }
        if (filters.tags) params.append("tags", filters.tags);
        if (filters.models) params.append("models", filters.models);
        if (filters.colors) params.append("colors", filters.colors);
        if (filters.materials) params.append("materials", filters.materials);
        if (filters.sortBy) {
          params.append("sort_by", filters.sortBy);
          if (filters.sortDir) params.append("sort_dir", filters.sortDir);
        }

        // Handle boolean filters - supporting both camelCase and snake_case naming conventions
        if (filters.isAvailable !== undefined)
          params.append("is_available", String(filters.isAvailable));
        if (filters.is_available !== undefined)
          // Support for snake_case version
          params.append("is_available", String(filters.is_available));

        if (filters.isNew !== undefined)
          params.append("is_new", String(filters.isNew));
        if (filters.is_new !== undefined)
          // Support for snake_case version
          params.append("is_new", String(filters.is_new));

        if (filters.isOnSale !== undefined)
          params.append("is_on_sale", String(filters.isOnSale));
        if (filters.is_on_sale !== undefined)
          // Support for snake_case version
          params.append("is_on_sale", String(filters.is_on_sale));

        if (filters.isFeatured !== undefined)
          params.append("is_featured", String(filters.isFeatured));
        if (filters.is_featured !== undefined)
          // Support for snake_case version
          params.append("is_featured", String(filters.is_featured));

        if (filters.isBestSeller !== undefined)
          params.append("is_best_seller", String(filters.isBestSeller));
        if (filters.is_best_seller !== undefined)
          // Support for snake_case version
          params.append("is_best_seller", String(filters.is_best_seller));

        const res = await axios.get(
          `${API_URL}/filter_products?${params.toString()}`
        );
        return res.data;
      },
      staleTime: 1000 * 60, // Consider data stale after 1 minute
      refetchOnWindowFocus: true,
    });

  const getProductBySlug = (slug: string) =>
    useQuery<ProductProps, unknown>({
      queryKey: ["get_by_slug", slug],
      queryFn: async () => {
        // Make a single API request to fetch the product by slug
        const res = await axios.get(`${API_URL}/get_product_by_slug/${slug}`);

        // Check if data exists before returning
        if (!res.data) {
          throw new Error("Product not found");
        }

        return res.data;
      },

      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    });

  const getsimilarProducts = (slug: string) => {
    useQuery<ProductProps, unknown>({
      queryKey: ["get_similar_products", slug],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/get_similar_products/${slug}`);
        return res.data;
      },
    });
  };
  return {
    createProduct,
    updateProduct,
    getsimilarProducts,
    getProductById,
    deleteProduct,
    filterProducts,
    getProductBySlug,
  };
};

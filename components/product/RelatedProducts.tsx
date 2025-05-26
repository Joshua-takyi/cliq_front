"use client";

import { useRef } from "react";
import { ProductProps } from "@/types/product_types";
import ProductCard from "../productCard";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/app/loading";

interface Product {
  message?: string;
  products: ProductProps[];
}
const RelatedProducts = ({ productId }: { productId: string }) => {
  // Create a ref for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;

  const reqBody = { id: productId };
  const { data, isLoading } = useQuery<Product>({
    queryKey: ["get_similar_products", productId],
    queryFn: async () => {
      const res = await axios.post(`${API_URL}/get_similar_products`, reqBody);
      // debugging to check the response
      // console.log("datas form axios", res.data);
      return res.data;
    },
  });

  const relatedProducts = data?.products || [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -324,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 324,
        behavior: "smooth",
      });
    }
  };

  // Loading skeleton
  if (isLoading) {
    return <Loader />;
  }

  // No related products
  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // Don't show section if no related products
  }

  // Only show navigation controls if there are enough products to scroll
  const showControls = relatedProducts.length > 4;

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>

        {/* Navigation arrows for carousel */}
        {showControls && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Horizontal scrollable product carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-1 snap-x scrollbar-hide"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
          scrollBehavior: "smooth",
        }}
      >
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            className="min-w-[300px] snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              key={product.id} // Use the unique product ID as the key
              product={{
                ...product, // Spread all product properties
                id: product.id, // Ensure id defaults to the product ID
                slug: product.slug || "", // Provide a fallback for slug to ensure it's always a string
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* CSS for hiding scrollbars but allowing scroll functionality */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;

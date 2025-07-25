"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { ProductProps } from "@/types/product_types";
import ProductCard from "@/components/productCard";
import { useProduct } from "@/hooks/useProduct";

export default function LatestProducts({ limit = 4 }: { limit?: number }) {
  const { filterProducts } = useProduct();

  // State to manage the number of products to display
  const [displayLimit, setDisplayLimit] = useState(limit);
  // State to track if we're loading more products
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filterParams = {
    is_new: true,
    sort_by: "createdAt",
    sortDir: "desc",
    page: 1, // Always fetch the first page for latest products
    limit: displayLimit, // Use the current display limit to fetch appropriate number of products
  };

  const { data, isLoading, isError } = filterProducts(
    filterParams,
    displayLimit,
    1
  );

  // Function to handle loading more products - increases display limit by 5
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate a brief loading state for better UX, then increase the display limit by 5 products
    setTimeout(() => {
      setDisplayLimit((prevLimit) => prevLimit + 5);
      setIsLoadingMore(false);
    }, 300); // Brief delay to show loading state
  }, []);

  // Debug the response data to verify if products are being returned
  // console.log("Latest Products Query Response:", data);

  const sectionWrapper = (content: React.ReactNode) => (
    <section className="py-16 ">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Arrivals
          </h2>
          <p className="text-gray-600 mb-4">
            Check out our newest products just added to the collection
          </p>
          <div className="w-24 h-1 bg-[#9BEC00] mx-auto"></div>
        </div>
        {content}
      </div>
    </section>
  );

  // If loading, show a loading skeleton with more realistic product card shapes
  if (isLoading) {
    return sectionWrapper(
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(displayLimit)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="bg-gray-200 animate-pulse w-full aspect-square"></div>
            {/* Content skeleton */}
            <div className="p-4">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
              {/* Price skeleton */}
              <div className="h-6 bg-gray-300 animate-pulse rounded w-1/3 mt-4"></div>
              {/* Button skeleton */}
              <div className="h-10 bg-gray-200 animate-pulse rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return sectionWrapper(
      <div className="text-center py-8">
        <p className="text-gray-600 mb-6">
          Failed to load latest products. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-black text-white hover:bg-[#9BEC00] hover:text-black transition-colors duration-300"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const products = data?.data?.products || [];
  const hasNoProducts = !isLoading && (!products || products.length === 0);
  // Check if there are more products available to load by comparing with total count
  const totalProducts = data?.data?.total || 0;
  const canLoadMore = products.length < totalProducts;

  if (hasNoProducts) {
    return sectionWrapper(
      <div className="text-center py-8">
        <div className="mx-auto mb-6 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 12V8h-4m4 4v4m-4 0h4m-8-4h.01M12 12h.01M8 12h.01M12 8h.01M8 8h.01M12 16h.01M8 16h.01M4 12h.01"
            />
          </svg>
          <p className="text-gray-600 mb-6">
            We don't have any new products at the moment, but we're always
            adding more!
          </p>
          <Link
            href="/collections"
            className="inline-block px-8 py-3 bg-black text-white hover:bg-[#9BEC00] hover:text-black transition-colors duration-300"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // Render the latest products
  return (
    <section className="py-16 ">
      <div className="max-w-[90rem] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Arrivals
          </h2>
          <p className="text-gray-600 mb-4">
            Check out our newest products just added to the collection
          </p>
          <div className="w-24 h-1 bg-[#9BEC00] mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {products.map((product: ProductProps) => (
            <ProductCard
              key={product.id} // Use the unique product ID as the key
              product={{
                ...product, // Spread all product properties
                slug: product.slug ?? product.id, // Ensure slug defaults to the product ID if not provided
              }}
            />
          ))}
        </div>

        {/* Load More button section - only show if there are more products to load */}
        {canLoadMore && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`inline-block px-8 py-3 transition-colors duration-300 ${
                isLoadingMore
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Disabled state styling
                  : "bg-black text-white hover:bg-[#9BEC00] hover:text-black" // Normal state styling
              }`}
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  {/* Loading spinner icon */}
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading More Products...
                </span>
              ) : (
                `Load 5 More Products` // Show how many products will be loaded
              )}
            </button>
          </div>
        )}

        {/* Show message when all products are loaded */}
        {!canLoadMore && products.length > limit && (
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">
              You've seen all {totalProducts} latest arrivals!
            </p>
            <Link
              href="/collections?isNew=true"
              className="inline-block px-8 py-3 bg-black text-white hover:bg-[#9BEC00] hover:text-black transition-colors duration-300"
            >
              Browse All Collections
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

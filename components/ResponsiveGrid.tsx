"use client"; // This directive marks the component as a client component, enabling React hooks

import { useProduct } from "@/hooks/useProduct";
import { ProductProps } from "@/types/product_types";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveFilterPanel from "./ResponsiveFilterPanel";
import ProductCard from "./productCard";
import Loader from "@/app/loading";

/**
 * ResponsiveGrid component that displays products in a responsive grid layout
 * with integrated filter functionality across all device sizes
 */
export default function ResponsiveGrid() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // State for filter panel visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State to determine if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);

  // Extract filter parameters from URL
  const category = searchParams.get("category");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const search = searchParams.get("search");
  const tags = searchParams.get("tags");
  const models = searchParams.get("models");
  const colors = searchParams.get("colors");

  // Check for active filters
  const hasActiveFilters = !!(colors || models || tags || minPrice || maxPrice);

  // Handle responsive behavior
  useEffect(() => {
    // Function to check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set the initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Get filter products function from custom hook
  const { filterProducts } = useProduct();

  // Build filter parameters object - always use filtering regardless of whether parameters are provided
  const filterParams = {
    category: category || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    search: search || undefined,
    tags: tags || undefined,
    models: models || undefined,
    colors: colors || undefined,
  };

  // Always use the filter products query
  const { data, isLoading } = filterProducts(filterParams, limit, page);

  // Get product array from response data structure
  const products = data?.data?.products || data?.products || [];

  // Toggle filter panel visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Only check for empty products after loading is complete
  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-500">
            No products found
          </h1>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or search terms
          </p>

          {/* Show reset filters button if filters are active */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                // Navigate to current path without any search params
                window.location.href = window.location.pathname;
              }}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render product grid with responsive filter component
  return (
    <div className="container px-4 lg:px-8 mx-auto">
      {/* Page title and filter count */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Products
          {category && <span className="ml-2 text-gray-500">: {category}</span>}
        </h1>

        {/* Active filter indicators - desktop */}
        <div className="hidden md:flex space-x-2">
          {colors && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Colors: {colors.split(",").length}
            </span>
          )}
          {models && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Models: {models.split(",").length}
            </span>
          )}
          {tags && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Tags: {tags.split(",").length}
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Price Filter
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Responsive Filter Panel Component
            - Shows as sidebar on desktop (md+)
            - Shows as slide-in panel on mobile with toggle button */}
        <ResponsiveFilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onToggle={toggleFilter}
        />

        {/* Products grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {products?.map((product: ProductProps) => (
              <ProductCard
                key={product.id} // Use the unique product ID as the key
                product={{
                  ...product, // Spread all product properties
                  slug: product.slug ?? product.id, // Ensure slug defaults to the product ID if not provided
                }}
              />
            ))}
          </div>

          {/* Pagination controls - can be added here */}
          <div className="mt-8 flex justify-center">
            {/* Pagination component would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

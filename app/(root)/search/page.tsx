"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "@/hooks/useProduct";
import ProductCard from "@/components/productCard";
import { ProductProps } from "@/types/product_types";
import ProductFilter from "@/components/ProductFilter";
import { Filter, X } from "lucide-react";
import Loader from "@/app/loading";

export default function SearchPage() {
  // Get search params from URL
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const limitParam = parseInt(searchParams.get("limit") || "12");

  // State for pagination
  const [page, setPage] = useState(pageParam);
  const [limit] = useState(limitParam);
  // State for filter panel visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Build filters object from search params
  const category = searchParams.get("category");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const query = searchParams.get("q"); // Get the search query from the 'q' parameter
  const tags = searchParams.get("tags");
  const models = searchParams.get("models");
  const colors = searchParams.get("colors");

  // Create filters object for the product search - with detailed comments
  const filters = {
    // Include category filter if provided in the URL
    category: category || undefined,
    // Convert price parameters to numbers if provided
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    // Use the query parameter from search component for text search
    // Make sure to only include the search parameter if it's not empty
    search: query && query.trim() !== "" ? query.trim() : undefined,
    // Include additional filter parameters if provided
    tags: tags || undefined,
    models: models || undefined,
    colors: colors || undefined,
  };

  // Use the filterProducts hook to fetch products based on the search query and filters
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useProduct().filterProducts(filters, limit, page);

  // Handle pagination navigation
  const handleNextPage = () => {
    if (searchResults?.totalPages && page < searchResults.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Extract products from search results with the correct structure
  // Handle both response formats (direct or nested in data property)
  const products =
    searchResults?.data?.products || searchResults?.products || [];
  // const totalCount =
  //   searchResults?.data?.totalCount || searchResults?.totalCount || 0;
  const totalPages =
    searchResults?.data?.totalPages || searchResults?.totalPages || 0;

  // Toggle filter panel visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="max-w-[100rem] mx-auto px-4 py-8">
      {/* Page heading that displays the search query if available */}
      <div className="text-center mb-8">
        <h1 className="text-xl mb-6">
          {query ? `Search Results for "${query}"` : "All Products"}
        </h1>
      </div>

      {/* Filter button and active filter indicators */}
      <div className="flex justify-between items-center mb-6 px-4 md:px-8">
        <div className="flex space-x-2">
          {/* Filter tags to show active filters */}
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
          {(minPrice || maxPrice) && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Price Filter
            </span>
          )}
        </div>

        {/* Filter button with enhanced hover animations */}
        <motion.button
          onClick={toggleFilter}
          className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={16} />
          <span>Filter</span>
        </motion.button>
      </div>

      {/* Pass a fallback slug if query is null */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        // Display error message if there was an error fetching results
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">
            Error loading search results. Please try again.
          </p>
        </div>
      ) : products.length === 0 ? (
        // Display message when no products match the search criteria
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No products found matching your search.</p>
        </div>
      ) : (
        // Display grid of product cards when we have search results
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 md:px-8">
          {products.map((product: ProductProps) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                slug: product.slug ?? product.id,
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {products.length > 0 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className={`px-4 py-2 border rounded-md ${
              page <= 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          <span className="px-4 py-2 border border-gray-200 rounded-md bg-gray-50">
            {page} of {totalPages || 1}
          </span>

          <button
            onClick={handleNextPage}
            disabled={totalPages && page >= totalPages}
            className={`px-4 py-2 border rounded-md ${
              totalPages && page >= totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Mobile Filter Overlay - Clean framer-motion animations */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop with beautiful blur effect and smooth fade-in animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier easing like cart
              }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Filter Panel with smooth slide-in animation from right */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother animation
              }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
            >
              {/* Close button header with modern design */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <motion.button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ease-out"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Filter component with content fade-in */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductFilter />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

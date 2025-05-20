"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import ProductCard from "@/components/productCard";
import { ProductProps } from "@/types/product_types";
import FilterPanel from "@/components/FilterPanel";
import { Filter } from "lucide-react";

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
  const totalCount =
    searchResults?.data?.totalCount || searchResults?.totalCount || 0;
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

        {/* Filter button */}
        <button
          onClick={toggleFilter}
          className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Pass a fallback slug if query is null */}
      {isLoading ? (
        // Display loading indicator while fetching results
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading search results...</p>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-8">
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

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}

"use client"; // This directive marks the component as a client component, enabling React hooks

import { useProduct } from "@/hooks/useProduct";
import { ProductProps } from "@/types/product_types";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FilterPanel from "./FilterPanel";
import ProductCard from "./productCard";

export default function Grid() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // State for filter panel visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract filter parameters from URL
  const category = searchParams.get("category");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const search = searchParams.get("search");
  const tags = searchParams.get("tags");
  const models = searchParams.get("models");
  const colors = searchParams.get("colors");

  // Get filter products function from custom hook
  const { filterProducts } = useProduct();

  // Build filter parameters object - always use filtering regardless of whether parameters are provided
  // This ensures we always use the filter endpoint even for no-filter scenarios
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-medium text-gray-700">
            Loading products...
          </h1>
        </div>
      </div>
    );
  }

  // Only check for empty products after loading is complete
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-500">
            No products found
          </h1>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    );
  }

  // Render product grid with filter button and panel
  return (
    <div>
      {/* Filter button and active filter indicators */}
      <div className="flex justify-between items-center mb-6 px-4 lg:px-0">
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

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-1 gap-2  lg:px-0">
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

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}

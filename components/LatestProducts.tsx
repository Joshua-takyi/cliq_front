"use client";

import Link from "next/link";
import { ProductProps } from "@/types/product_types";
import ProductCard from "@/components/productCard";
import { useProduct } from "@/hooks/useProduct";

export default function LatestProducts({ limit = 4 }: { limit?: number }) {
  const { filterProducts } = useProduct();

  const filterParams = {
    is_new: true,
    sort_by: "createdAt",
    sortDir: "desc",
  };

  const { data, isLoading, isError } = filterProducts(filterParams, limit, 1);

  // Debug the response data to verify if products are being returned
  console.log("Latest Products Query Response:", data);

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
        {[...Array(limit)].map((_, i) => (
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
              {/* Pri`ce skeleton */}
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {products.map((product: ProductProps) => (
            <ProductCard
              key={product.id}
              product={{
                title: product.title,
                price: product.price,
                id: product.id,
                images: product.images,
                slug: product.slug || product.id, // Fallback to id if slug is undefined
                colors: product.colors,
                isNew: product.isNew,
              }}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections?isNew=true"
            className="inline-block px-8 py-3 bg-black text-white hover:bg-[#9BEC00] hover:text-black transition-colors duration-300"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}

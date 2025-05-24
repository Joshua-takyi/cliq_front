"use client";

import { DeleteProduct } from "@/components/deleteProduct";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import formatPrice from "@/libs/helpers";
import { ProductProps } from "@/types/product_types";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Products list component with React Query integration
 * Using specialized admin products hook for better performance and admin-specific data
 */
function ProductsList() {
  const [currentPage, setCurrentPage] = useState(1);

  // Use our specialized admin products hook
  const productsQuery = useAdminProducts(currentPage, 10);

  const products = productsQuery.data?.products || [];
  // Calculate pagination details from the total count and items per page
  const totalProducts = productsQuery.data?.count || 0;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    // Ensure page is within valid range
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    // Scroll to top when page changes for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">No products found</p>
        <Link
          href="/admin/products/create"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Add your first product
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {productsQuery.isLoading ? (
        <div className="py-16 w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : productsQuery.isError ? (
        <div className="py-16 text-center">
          <p className="text-red-500">Error loading products</p>
          <Button
            onClick={() => productsQuery.refetch()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No products found</p>
          <Link
            href="/admin/products/create"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product: ProductProps) => (
                <li
                  key={product.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {product.images && product.images[0] && (
                      <div className="flex-shrink-0 h-16 w-16 mr-4 relative">
                        <Image
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-md object-cover border border-gray-200"
                          src={product.images[0]}
                          alt={product.title}
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {product.title}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-3">
                        <span>{formatPrice(product.price)}</span>
                        <span>•</span>
                        <span>Stock: {product.stock || "N/A"}</span>
                        {product.isOnSale && (
                          <>
                            <span>•</span>
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                              On Sale
                            </span>
                          </>
                        )}
                        {product.isFeatured && (
                          <>
                            <span>•</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                              Featured
                            </span>
                          </>
                        )}
                        {product.isNew && (
                          <>
                            <span>•</span>
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                              New
                            </span>
                          </>
                        )}
                        {!product.isAvailable && (
                          <>
                            <span>•</span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                              Out of Stock
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Updated:{" "}
                        {new Date(
                          product?.createdAt ?? ""
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Button className="cursor-pointer">Edit</Button>
                    </Link>
                    <DeleteProduct productId={product.id} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                {/* Smart pagination with ellipsis for better UX with many pages */}
                {(() => {
                  // Function to render page buttons with proper ellipses
                  const renderPageButtons = () => {
                    const buttons = [];

                    // Always show first page
                    if (totalPages > 0) {
                      buttons.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                          aria-current={currentPage === 1 ? "page" : undefined}
                          aria-label="Page 1"
                        >
                          1
                        </button>
                      );
                    }

                    // Show ellipsis if needed
                    if (currentPage > 3) {
                      buttons.push(
                        <span
                          key="start-ellipsis"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    // Calculate range of pages to show around current page
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    // Show pages around current page
                    for (let i = startPage; i <= endPage; i++) {
                      // Skip first and last page as they're handled separately
                      if (i > 1 && i < totalPages) {
                        buttons.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                            aria-current={
                              currentPage === i ? "page" : undefined
                            }
                            aria-label={`Page ${i}`}
                          >
                            {i}
                          </button>
                        );
                      }
                    }

                    // Show end ellipsis if needed
                    if (currentPage < totalPages - 2) {
                      buttons.push(
                        <span
                          key="end-ellipsis"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    // Always show last page if we have more than one page
                    if (totalPages > 1) {
                      buttons.push(
                        <button
                          key={totalPages}
                          onClick={() => handlePageChange(totalPages)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === totalPages
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                          aria-current={
                            currentPage === totalPages ? "page" : undefined
                          }
                          aria-label={`Page ${totalPages}`}
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return buttons;
                  };

                  return renderPageButtons();
                })()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage >= totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Query Performance Indicator */}
          {productsQuery.data?.duration && (
            <div className="text-xs text-gray-500 text-center mt-4">
              {/* Display execution time from the duration field */}
              Execution time: {productsQuery.data.duration}ms | Total Products:{" "}
              {productsQuery.data.count || 0}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsList />;
}

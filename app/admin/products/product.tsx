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

export function ProductsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsQuery = useAdminProducts(currentPage, 10);
  const products = productsQuery.data?.products || [];
  const totalProducts = productsQuery.data?.count || 0;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (productsQuery.isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-500">Error loading products</p>
        <Button
          onClick={() => productsQuery.refetch()}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-600">No products found</p>
        <Link
          href="/admin/products/create"
          className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
        >
          Add a product
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Products</h1>
          <p className="text-xs text-gray-500">{totalProducts} products</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-white">
        <ul className="divide-y divide-gray-100">
          {products.map((product: ProductProps) => (
            <li
              key={product.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center w-full sm:w-auto">
                {product.images && product.images[0] && (
                  <Image
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover mr-3 border border-gray-200"
                    src={product.images[0]}
                    alt={product.title}
                  />
                )}
                <div className="flex-grow">
                  <h2 className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{formatPrice(product.price)}</span>
                    <span>•</span>
                    <span>Stock: {product.stock || "N/A"}</span>
                    {product.isOnSale && (
                      <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">
                        Sale
                      </span>
                    )}
                    {!product.isAvailable && (
                      <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-2 w-full sm:w-auto">
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Button variant="outline" className="text-xs px-3 py-1">
                    Edit
                  </Button>
                </Link>
                <DeleteProduct productId={product.id} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md -space-x-px text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-1 border border-gray-300 bg-white rounded-l-md disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border border-gray-300 ${
                      currentPage === page
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span
                    key={`ellipsis-${page}`}
                    className="px-3 py-1 border border-gray-300 bg-white text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 border border-gray-300 bg-white rounded-r-md disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

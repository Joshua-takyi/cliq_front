"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/form";
import { useProduct } from "@/hooks/useProduct";
// import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

function EditProductContainer() {
  const { id } = useParams();
  const productId = id as string; // Ensure productId is a string
  const { getProductById } = useProduct();
  const queryClient = useQueryClient();

  // // Prefetch the product data
  // useEffect(() => {
  //   // Prefetch and invalidate the product data to ensure we have the latest version
  //   queryClient.invalidateQueries({ queryKey: ["product", productId] });
  // }, [productId, queryClient]);

  const { data: product, isLoading, isError } = getProductById(productId);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Loading product data...</p>
        {/* Add a more attractive loading indicator here if desired */}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">Error loading product</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">Product not found</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEditMode={true} />;
}

export default function EditProductPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
      <EditProductContainer />
    </div>
  );
}

"use client";

import { use } from "react";
import Loader from "@/app/loading";
import ProductForm from "@/components/form";
import { useProduct } from "@/hooks/useProduct";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
// import { useEffect } from "react";

function EditProductContainer() {
  // Get params from useParams hook and properly unwrap if it's a Promise
  const params = useParams();
  // Unwrap params using React.use() for Next.js compatibility with async params
  // Using 'unknown' first to handle the type conversion safely
  const resolvedParams = use(params as unknown as Promise<{ id: string }>);
  const { id } = resolvedParams;

  const productId = id as string; // Ensure productId is a string for proper type safety
  const { getProductById } = useProduct();

  const { data: product, isLoading, isError } = getProductById(productId);

  if (isLoading) {
    return <Loader />;
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

"use client";
import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import ProductDisplay from "@/components/product/ProductDisplay";
import { Suspense } from "react";

const ProductPage = () => {
  const { slug } = useParams(); // Extract slug from URL parameters
  const {
    data: product,
    isLoading,
    error,
  } = useProduct().getProductBySlug(slug as string);

  // Handle loading and error states
  if (error) {
    console.error("Error loading product:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
        <p className="text-red-500">
          There was an error loading the product. Please try again later.
        </p>
      </div>
    );
  }

  // Render our comprehensive product display component
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">Loading product...</div>
      }
    >
      {/* Use our new ProductDisplay component that contains all the product sections */}
      {/* Ensure the product is passed only if it is of type ProductProps */}
      {product && typeof product !== "string" ? (
        <ProductDisplay product={product} isLoading={isLoading} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-500">Product details are unavailable.</p>
        </div>
      )}
    </Suspense>
  );
};

export default ProductPage;

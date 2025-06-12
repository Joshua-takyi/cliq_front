"use client";
import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import ProductDisplay from "@/components/product/ProductDisplay";
import Loader from "@/app/loading";

const ProductPage = () => {
  // Get params directly from useParams hook - it returns synchronous object in App Router
  const params = useParams();
  // Extract slug from params object directly - no need for React.use() since params is not a Promise
  const slug = params?.slug as string;

  const {
    data: product,
    isLoading,
    error,
  } = useProduct().getProductBySlug(slug as string);

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Handle error state
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

  // Handle product not found
  if (!product || typeof product === "string") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-500">
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Render the product
  return <ProductDisplay product={product} isLoading={false} />;
};

export default ProductPage;

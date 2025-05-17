"use client";

import React from "react";
import ProductAddToCart from "./product/ProductAddToCart";
import { ProductProps } from "@/types/product_types";

/**
 * Example usage of the ProductAddToCart component outside of the product detail page
 * This component demonstrates how to use the non-rounded product add to cart component
 * in different contexts, such as a quick add section in product listings
 */
const ProductQuickAdd: React.FC<{ product: ProductProps }> = ({ product }) => {
  /**
   * Handle adding product to cart
   * In a real application, this would call your cart API
   */
  const handleAddToCart = async (quantity: number) => {
    // Example implementation - would be replaced by actual cart logic
    console.log(`Adding ${quantity} of ${product.title} to cart`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Show success feedback (could use toast notification)
    console.log("Product added to cart successfully!");
  };

  return (
    <div className="p-4 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-medium">{product.title}</h2>
        <p className="text-gray-500 text-sm">
          {product.description?.substring(0, 80)}...
        </p>
      </div>

      {/* Using our non-rounded component */}
      <ProductAddToCart
        product={product}
        onAddToCart={handleAddToCart}
        className="mt-auto" // Push to bottom when used in a flex container
      />
    </div>
  );
};

export default ProductQuickAdd;

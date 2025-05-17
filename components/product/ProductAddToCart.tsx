"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ProductProps } from "@/types/product_types";

interface ProductAddToCartProps {
  product: ProductProps;
  onAddToCart: (quantity: number) => void;
  selectedModel?: string | null;
  className?: string;
}

const ProductAddToCart: React.FC<ProductAddToCartProps> = ({
  product,
  onAddToCart,
  selectedModel = null,
  className = "",
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1 and doesn't exceed available stock
    const validQuantity = Math.max(1, Math.min(newQuantity, product.stock));
    setQuantity(validQuantity);
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await onAddToCart(quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Decreases the quantity by 1, ensuring it never goes below 1
   */
  const decreaseQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  /**
   * Increases the quantity by 1, ensuring it never exceeds available stock
   */
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      handleQuantityChange(quantity + 1);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Quantity selector with square styling */}
      <div className="flex items-center">
        <label htmlFor="quantity-input" className="sr-only">
          Quantity
        </label>
        <div className="flex items-center border border-black shadow-sm">
          {/* Decrease quantity button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="h-13 w-10 border-r border-black/40 hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-inset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Button>

          {/* Quantity input field */}
          <Input
            id="quantity-input"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-14 focus:outline-none h-10 text-center border-none text-sm"
            aria-label="Quantity"
          />

          {/* Increase quantity button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="h-13 w-10 border-l border-black/40 hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-inset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Button>
        </div>
      </div>

      {/* Add to cart button with square styling */}
      <Button
        onClick={handleAddToCart}
        disabled={
          !(product.stock > 0 && product.isAvailable !== false) ||
          isAddingToCart ||
          (product.models && product.models.length > 0 && !selectedModel)
        }
        className="flex-1 bg-black hover:bg-gray-800 text-white h-13 text-sm"
        variant="default"
      >
        {isAddingToCart ? (
          <>
            {/* Loading spinner for when product is being added to cart */}
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </>
        ) : (
          <>
            {/* Shopping bag icon */}
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
};

export default ProductAddToCart;

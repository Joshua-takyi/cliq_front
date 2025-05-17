"use client";

import { useState } from "react";
import { ProductProps } from "@/types/product_types";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface ProductActionsProps {
  product: ProductProps;
  quantity: number;
  selectedColor: string | null;
  onQuantityChange: (quantity: number) => void;
  onColorSelect: (color: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  quantity,
  selectedColor,
  onQuantityChange,
  onColorSelect,
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    setIsAddingToCart(true);

    try {
      // Here you would implement the actual cart functionality
      // For example, make an API call to add the item to the cart
      // This is a placeholder for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success feedback (you could add a toast notification here)
      //   console.log("Added to cart:", {
      //     productId: product.id,
      //     quantity,
      //     color: selectedColor,
      //   });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Show error feedback
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to handle adding product to wishlist
  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);

    try {
      // Here you would implement the actual wishlist functionality
      // For example, make an API call to add the item to the wishlist
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success feedback (you could add a toast notification here)
      //   console.log("Added to wishlist:", product.id);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Show error feedback
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Calculate if product is available to be added to cart
  const isAvailable = product.stock > 0 && product.isAvailable !== false;

  return (
    <div className="product-actions mt-8">
      {/* Color selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-black"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow:
                    selectedColor === color
                      ? "0 0 0 2px white, 0 0 0 4px black"
                      : "none",
                }}
                aria-label={`Select ${color} color`}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Material selection if applicable */}
      {product.materials && product.materials.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Material</h3>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((material) => (
              <Button
                key={material}
                variant="outline"
                className="border rounded-md py-1 px-3 text-sm"
              >
                {material}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Quantity</h3>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
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

          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center mx-2 border rounded-md py-2"
            aria-label="Quantity"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add to Cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !isAvailable}
          className="flex-1 py-3 bg-black hover:bg-gray-800 text-white"
          variant="default"
        >
          {isAddingToCart ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : !isAvailable ? (
            "Out of Stock"
          ) : (
            <>
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

        {/* Add to Wishlist button */}
        <Button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className="py-3"
          variant="outline"
        >
          {isAddingToWishlist ? (
            <svg
              className="animate-spin h-5 w-5"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          )}
        </Button>
      </div>

      {/* Additional product metadata and policies */}
      {/* SKU/Model */}
      <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-medium">SKU:</span>
          <span>{product.slug}</span>
        </div>

        {/* Shipping information */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <span>Free shipping on orders over $50</span>
        </div>

        {/* Return policy */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
            />
          </svg>
          <span>30-day return policy</span>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;

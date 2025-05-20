"use client";

import { useState } from "react";
import { ProductProps } from "@/types/product_types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import ProductImageSection from "./ProductImageSection";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { UseCart } from "@/hooks/useCart";
import { Accordion } from "../ui/accordion"; // Import the new Accordion component
import RelatedProducts from "./RelatedProducts";

interface ProductDisplayProps {
  product: ProductProps;
  isLoading?: boolean;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  // State management for product options
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.length ? product.colors[0] : ""
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    product?.models?.length ? product.models[0] : ""
  );

  // State for review functionality
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>("");
  const [reviewEmail, setReviewEmail] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Use the cart hook
  const { AddToCart } = UseCart();
  const { mutate } = AddToCart;

  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    setIsAddingToCart(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!selectedModel || !selectedColor || quantity <= 0) {
        toast.error("Please select a model and color before adding to cart.");
        return;
      }

      mutate({
        product_Id: product.id,
        quantity,
        color: selectedColor,
        model: selectedModel,
      });
      setQuantity(1); // Reset quantity after adding to cart
      setSelectedColor(product.colors[0]); // Reset color to first option
    } catch (error) {
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to handle model selection
  const handleModelSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value;
    setSelectedModel(newModel);
  };

  // Function to handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Function to handle quantity changes with boundary check
  function handleQuantityChange(newQuantity: number): void {
    if (newQuantity < 1) {
      setQuantity(1); // Minimum quantity is 1
    } else {
      setQuantity(newQuantity);
    }
  }

  // Function to handle review submission
  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingReview(true);

    try {
      // Simulating an API call for review submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Review submitted:", {
        productId: product.id,
        rating: reviewRating,
        text: reviewText,
        name: reviewName,
        email: reviewEmail,
        date: new Date().toISOString(),
      });

      // Reset form after successful submission
      setReviewText("");
      setReviewRating(5);
      setReviewName("");
      setReviewEmail("");

      toast.success("Review submitted successfully!", {
        richColors: false,
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper function to format prices with proper currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // If product doesn't exist
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Define accordion items based on product data
  const accordionItems = [
    {
      id: "details",
      title: "Product Details",
      content: (
        <div className="prose max-w-none">
          <p>{product.description}</p>

          {product.details && product.details.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      id: "features",
      title: "Key Features",
      content: (
        <div className="prose max-w-none">
          {product.features && product.features.length > 0 ? (
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700">
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No features specified for this product.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "specifications",
      title: "Specifications",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display product specifications in a structured format */}
          <div className="border-b pb-2">
            <span className="font-medium">Brand</span>
            <p className="text-gray-600">Premium Shop</p>
          </div>

          {/* Materials specification */}
          {product.materials && product.materials.length > 0 && (
            <div className="border-b pb-2">
              <span className="font-medium">Materials</span>
              <p className="text-gray-600">{product.materials.join(", ")}</p>
            </div>
          )}

          {/* Colors specification */}
          {product.colors && product.colors.length > 0 && (
            <div className="border-b pb-2">
              <span className="font-medium">Available Colors</span>
              <p className="text-gray-600">{product.colors.join(", ")}</p>
            </div>
          )}

          {/* Model variants */}
          {product.models && product.models.length > 0 && (
            <div className="border-b pb-2">
              <span className="font-medium">Available Models</span>
              <p className="text-gray-600">{product.models.join(", ")}</p>
            </div>
          )}

          {/* Warranty */}
          <div className="border-b pb-2">
            <span className="font-medium">Warranty</span>
            <p className="text-gray-600">
              {product.warranty
                ? `${product.warranty} months`
                : "Standard warranty"}
            </p>
          </div>

          {/* Creation date */}
          <div className="border-b pb-2">
            <span className="font-medium">Date Added</span>
            <p className="text-gray-600">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>

          {/* Stock status */}
          {/* <div className="border-b pb-2">
            <span className="font-medium">Availability</span>
            <p className="text-gray-600">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </p>
          </div> */}
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="space-y-6">
          {/* Shipping information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
            <p className="text-gray-700">
              We offer standard shipping on all orders. Orders are processed and
              shipped within 1-3 business days. Shipping times are estimated at
              3-7 business days depending on your location.
            </p>
            <p className="mt-2 text-gray-700">
              Free shipping is available on all orders over $50. For orders
              under $50, a flat shipping rate of $5.99 will be applied at
              checkout.
            </p>
          </div>

          {/* Returns information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Returns Policy</h3>
            <p className="text-gray-700">
              We accept returns within 30 days of delivery. Items must be unused
              and in the same condition that you received them, with all
              original packaging and tags attached.
            </p>
            <p className="mt-2 text-gray-700">
              To start a return, please contact our customer service team.
              Return shipping costs are the responsibility of the customer
              unless the item is defective or the return is due to our error.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[100rem] mx-auto px-4 py-8">
      {/* Product main section with image and details */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left side - Product images - Only displays in row format on lg screens and above */}
        <div className="w-full lg:w-1/2">
          <ProductImageSection images={product.images} title={product.title} />
        </div>

        {/* Right side - Product info and actions */}
        <div className="w-full lg:w-1/2">
          {/* Product badges and title section */}
          <div className="mb-6">
            {/* Product badges display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && (
                <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-none">
                  New
                </Badge>
              )}
              {(product.isOnSale || Boolean(product.discount)) && (
                <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-none">
                  Sale
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded-none">
                  Best Seller
                </Badge>
              )}
            </div>

            {/* Product title with modernized styling */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              {product.title}
            </h1>

            {/* Pricing information with improved layout */}
            <div className="mb-6">
              {product.discount ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(
                      product.price - product.price * (product.discount / 100)
                    )}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-red-500 font-medium border border-red-500 px-2 py-1 text-xs">
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Model selection with enhanced UI */}
            {product.models && product.models.length > 0 && (
              <div className="mb-6">
                <Label
                  htmlFor="model-select"
                  className="text-sm font-semibold text-gray-700 block mb-2"
                >
                  Select Model
                </Label>
                <div className="relative w-full">
                  <select
                    id="model-select"
                    value={selectedModel || ""}
                    onChange={handleModelSelect}
                    aria-label="Select product model"
                    className="
                      block w-full
                      h-12 px-4
                      border border-black
                      rounded-none 
                      text-gray-900
                      text-sm
                      focus:outline-none 
                      focus:border-black
                      focus:ring-0
                      appearance-none 
                      bg-transparent
                    "
                  >
                    <option value="" disabled>
                      Choose a model
                    </option>
                    {product.models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>

                  {/* Custom dropdown arrow */}
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Color selection with modernized design */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 block mb-2">
                  Select Color
                </Label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorSelect(color)}
                      className={`w-12 h-12 rounded-none flex items-center justify-center ${
                        selectedColor === color
                          ? "ring-2 ring-black ring-offset-2"
                          : "ring-1 ring-gray-300"
                      }`}
                      style={{
                        backgroundColor: color,
                      }}
                      aria-label={`Select ${color} color`}
                      aria-pressed={selectedColor === color}
                    >
                      {selectedColor === color && (
                        <svg
                          className={`w-4 h-4 ${
                            /^(white|#fff|#ffffff|rgb\(255,\s*255,\s*255\))$/i.test(
                              color
                            )
                              ? "text-black"
                              : "text-white"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and add to cart section with improved design */}
            <div className="mb-8">
              <Label className="text-sm font-semibold text-gray-700 block mb-2">
                Quantity
              </Label>
              <div className="flex items-center gap-4">
                {/* Quantity selector with consistent styling */}
                <div className="flex items-center">
                  <div className="flex items-center border border-black rounded-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="h-12 w-12 rounded-none border-r border-black hover:bg-gray-100 focus:ring-0"
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

                    <Input
                      id="quantity-input"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-12 h-12 text-center border-none text-sm appearance-none focus:ring-0"
                      aria-label="Quantity"
                      readOnly
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      aria-label="Increase quantity"
                      className="h-12 w-12 rounded-none border-l border-black hover:bg-gray-100 focus:ring-0"
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

                {/* Add to cart button with enhanced style */}
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !(
                      product.stock > 0 &&
                      product.isAvailable !== false &&
                      selectedColor &&
                      quantity > 0 &&
                      (!product.models ||
                        (product.models.length > 0 && selectedModel))
                    ) || isAddingToCart
                  }
                  className="flex-1 bg-black hover:bg-gray-800 text-white h-12 text-sm rounded-none transition-colors duration-200"
                  variant="default"
                >
                  {isAddingToCart ? (
                    <>
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
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
              </div>
            </div>

            {/* Stock information */}
            {/* <div className="mb-8">
              <div
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </div>
            </div> */}
          </div>

          {/* Accordion sections for product information */}
          <div className="border-t border-gray-200 pt-6 flex flex-col">
            <Accordion
              items={accordionItems}
              defaultOpen="details"
              className="divide-y-0"
            />
            <div>
              <h2 className="text-xl font-bold my-4">Write a Review</h2>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating and name on same row */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <Label
                      htmlFor="rating-stars"
                      className="text-sm font-medium block mb-1"
                    >
                      Rating
                    </Label>
                    <div
                      id="rating-stars"
                      className="flex items-center gap-1 border border-black p-1"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`w-8 h-8 flex items-center justify-center border border-black ${
                            reviewRating >= star
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <Label
                      htmlFor="review-name"
                      className="text-sm font-medium block mb-1"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="review-name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      className="rounded-none w-full border border-black focus:border-black focus:ring-0 focus:outline-none h-10"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <Label
                    htmlFor="review-email"
                    className="text-sm font-medium block mb-1"
                  >
                    Your Email
                  </Label>
                  <Input
                    id="review-email"
                    type="email"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    required
                    className="rounded-none w-full border border-black focus:border-black focus:ring-0 focus:outline-none h-10"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Review Text Area */}
                <div>
                  <Label
                    htmlFor="review-text"
                    className="text-sm font-medium block mb-1"
                  >
                    Your Review
                  </Label>
                  <Textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    className="rounded-none min-h-[100px] resize-none border border-black focus:border-black focus:ring-0 focus:outline-none w-full"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-fit bg-black hover:bg-gray-800 text-white h-10 rounded-none text-sm px-6"
                  variant="default"
                >
                  {isSubmittingReview ? (
                    <>
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8  border-gray-200 pt-6">
        <RelatedProducts productId={product.id || ""} />
      </div>
    </div>
  );
};

export default ProductDisplay;

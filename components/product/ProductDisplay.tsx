"use client";

import { UseCart } from "@/hooks/useCart";
import { ProductProps } from "@/types/product_types";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion } from "../ui/accordion"; // Import the new Accordion component
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ProductImageSection from "./ProductImageSection";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";

interface ProductDisplayProps {
  product: ProductProps;
  isLoading?: boolean;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  // State management for product options and user interactions
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.length ? product.colors[0] : ""
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    product?.models?.length ? product.models[0] : ""
  );
  // const [isWishlisted, setIsWishlisted] = useState(false); // State for wishlist functionality
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Use the cart hook
  const { AddToCart } = UseCart();
  const { mutate } = AddToCart;
  const session = useSession();
  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    if (!session.data || !session.data.user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    if (!product || product.stock <= 0) return;

    setIsAddingToCart(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!selectedModel || !selectedColor || quantity <= 0) {
        toast.error("Please select a model and color before adding to cart.");
        return;
      }

      mutate({
        product_id: product.id, // Fixed property name to match CartProps interface
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

  // Function to handle adding/removing from wishlist
  // const handleWishlistToggle = async () => {
  //   if (!session.data || !session.data.user) {
  //     toast.error("Please sign in to manage your wishlist.");
  //     return;
  //   }

  //   setIsAddingToWishlist(true);

  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 800));

  //     setIsWishlisted(!isWishlisted);

  //     if (!isWishlisted) {
  //       toast.success("Added to wishlist!");
  //     } else {
  //       toast.success("Removed from wishlist!");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update wishlist. Please try again.");
  //   } finally {
  //     setIsAddingToWishlist(false);
  //   }
  // };

  // Function to handle product sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link. Please try again.");
      }
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

  // Helper function to render star rating display
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Add empty stars to complete 5 stars
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
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

  // Define accordion items based on product data with enhanced content
  const accordionItems = [
    {
      id: "details",
      title: "Product Details",
      content: (
        <div className="prose max-w-none space-y-4">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {product.details && product.details.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Additional Details
              </h4>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
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
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No specific features highlighted for this product.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "specifications",
      title: "Specifications",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display product specifications in a structured format */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-900 block">
                Brand
              </span>
              <p className="text-gray-600 mt-1">Premium Shop</p>
            </div>

            {/* Materials specification */}
            {product.materials && product.materials.length > 0 && (
              <div className="border-b border-gray-100 pb-3">
                <span className="text-sm font-medium text-gray-900 block">
                  Materials
                </span>
                <p className="text-gray-600 mt-1">
                  {product.materials.join(", ")}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Model variants */}
            {product.models && product.models.length > 0 && (
              <div className="border-b border-gray-100 pb-3">
                <span className="text-sm font-medium text-gray-900 block">
                  Available Models
                </span>
                <p className="text-gray-600 mt-1">
                  {product.models.join(", ")}
                </p>
              </div>
            )}

            {/* Warranty */}
            <div className="border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-900 block">
                Warranty
              </span>
              <p className="text-gray-600 mt-1">
                {product.warranty
                  ? `${product.warranty} months warranty`
                  : "Standard manufacturer warranty"}
              </p>
            </div>

            {/* Creation date */}
            <div className="border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-900 block">
                Date Added
              </span>
              <p className="text-gray-600 mt-1">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recently added"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="space-y-6">
          {/* Shipping information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Shipping Information
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Standard Shipping:</strong> Free on orders over $50,
                    otherwise $5.99. Delivered in 3-7 business days.
                  </p>
                  <p>
                    <strong>Express Shipping:</strong> $12.99 for next business
                    day delivery (orders placed before 2 PM).
                  </p>
                  <p>
                    <strong>Processing Time:</strong> All orders are processed
                    and shipped within 1-3 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Returns information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Returns Policy
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>30-Day Returns:</strong> We accept returns within 30
                    days of delivery for unworn items in original packaging.
                  </p>
                  <p>
                    <strong>Easy Process:</strong> Contact our customer service
                    team to initiate a return. We'll provide a prepaid return
                    label.
                  </p>
                  <p>
                    <strong>Refund Timeline:</strong> Refunds are processed
                    within 5-7 business days after we receive your returned
                    item.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer service */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Customer Support
                </h3>
                <p className="text-gray-700">
                  Need help? Our customer service team is available
                  Monday-Friday, 9 AM - 6 PM EST. Contact us via email or live
                  chat for quick assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[100rem] mx-auto px-4 py-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/collections">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {product.category && product.category.length > 0 && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/collections?category=${product.category[0]}`}
                  >
                    {product.category[0]}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>

      {/* Product main section with image and details */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left side - Product images - Only displays in row format on lg screens and above */}
        <div className="w-full lg:w-1/2">
          <ProductImageSection images={product.images} title={product.title} />
        </div>

        {/* Right side - Product info and actions */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Product badges and title section */}
          <div className="space-y-4">
            {/* Product badges display */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-none">
                  New
                </Badge>
              )}
              {(product.isOnSale || Boolean(product.discount)) && (
                <Badge className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-none">
                  Sale
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-none">
                  Best Seller
                </Badge>
              )}
            </div>

            {/* Product title with modernized styling */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Product rating display */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStarRating(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              )}
            </div>

            {/* Product action buttons (Wishlist and Share) */}
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`flex items-center gap-2 rounded-none border-black ${
                  isWishlisted
                    ? "bg-red-50 text-red-600 border-red-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {isAddingToWishlist ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Heart
                    size={16}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                )}
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </Button> */}

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 rounded-none border-black hover:bg-gray-50"
              >
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>

          {/* Pricing information with improved layout */}
          <div className="space-y-4">
            <div className="space-y-2">
              {product.discount ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(
                      product.price - product.price * (product.discount / 100)
                    )}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded-none">
                    -{product.discount}% OFF
                  </Badge>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}

              {/* Stock information with better styling */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? product.stock > 10
                      ? "In Stock"
                      : `Only ${product.stock} left!`
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* Model selection with enhanced UI */}
          {product.models && product.models.length > 0 && (
            <div className="space-y-2">
              <Label
                htmlFor="model-select"
                className="text-sm font-semibold text-gray-700"
              >
                Select Model
              </Label>
              <div className="relative">
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Select Color
              </Label>
              <div className="flex flex-wrap gap-2">
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
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">
              Quantity
            </Label>
            <div className="flex items-center gap-3">
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
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Accordion sections for product information */}
          <div className="border-t border-gray-200 pt-6">
            <Accordion
              items={accordionItems}
              defaultOpen="details"
              className="divide-y-0"
            />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="border-t border-gray-200 pt-8">
        <RelatedProducts productId={product.id || ""} />
      </div>

      {/* Review Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <p className="text-gray-600">
            See what other customers are saying about this product
          </p>
        </div>
        <ProductReviews
          productId={product.id || ""}
          productTitle={product.title}
        />
      </div>
    </div>
  );
};

export default ProductDisplay;

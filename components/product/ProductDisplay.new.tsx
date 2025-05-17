// "use client";

// import { useState } from "react";
// import { ProductProps } from "@/types/product_types";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { motion } from "framer-motion";
// import ProductImageSection from "./ProductImageSection";
// import ProductInfo from "./ProductInfo";
// import ProductActions from "./ProductActions";
// import ProductTabs from "./ProductTabs";

// interface ProductDisplayProps {
//   product: ProductProps;
//   isLoading?: boolean;
// }

// /**
//  * ProductDisplay is the main component for the product page
//  * It orchestrates the layout and rendering of all product-related components
//  *
//  * This version reorganizes the layout to show model, colors, and add to cart right after the title
//  * before showing the description
//  *
//  * @param product - The product data object containing all product information
//  * @param isLoading - Boolean flag to indicate if the product data is still loading
//  */
// const ProductDisplay: React.FC<ProductDisplayProps> = ({
//   product,
//   isLoading = false,
// }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [selectedColor, setSelectedColor] = useState<string | null>(
//     product?.colors?.length ? product.colors[0] : null
//   );
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   // Function to handle quantity changes
//   const handleQuantityChange = (newQuantity: number) => {
//     // Ensure quantity is within valid range (1 to available stock)
//     const validQuantity = Math.max(
//       1,
//       Math.min(newQuantity, product?.stock || 1)
//     );
//     setQuantity(validQuantity);
//   };

//   // Function to handle color selection
//   const handleColorSelect = (color: string) => {
//     setSelectedColor(color);
//   };

//   // Function to handle adding product to cart
//   const handleAddToCart = async () => {
//     if (!product || product.stock <= 0) return;

//     setIsAddingToCart(true);

//     try {
//       // Here you would implement the actual cart functionality
//       // For example, make an API call to add the item to the cart
//       // This is a placeholder for demonstration
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Show success feedback (you could add a toast notification here)
//       console.log("Added to cart:", {
//         productId: product.id,
//         quantity,
//         color: selectedColor,
//       });
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//       // Show error feedback
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // Helper function to format prices with proper currency symbol
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "GHS",
//       minimumFractionDigits: 2,
//     }).format(price);
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8 animate-pulse">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Image section skeleton */}
//           <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>

//           {/* Info section skeleton */}
//           <div className="w-full md:w-1/2">
//             <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
//             <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
//             <div className="h-24 w-full bg-gray-200 rounded mb-6"></div>
//             <div className="h-12 w-full bg-gray-200 rounded mb-4"></div>
//             <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If product doesn't exist
//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
//         <p className="mb-6">
//           The product you're looking for doesn't exist or has been removed.
//         </p>
//         <Button variant="default" onClick={() => window.history.back()}>
//           Go Back
//         </Button>
//       </div>
//     );
//   }

//   // Calculate the discounted price if applicable
//   const discountedPrice = product.discount
//     ? product.price - product.price * (product.discount / 100)
//     : null;

//   // Calculate if product is available to be added to cart
//   const isAvailable = product.stock > 0 && product.isAvailable !== false;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Product main section with image and details */}
//       <div className="flex flex-col md:flex-row gap-8 mb-16">
//         {/* Left side - Product images */}
//         <div className="w-full md:w-1/2">
//           <ProductImageSection images={product.images} title={product.title} />
//         </div>

//         {/* Right side - Product info and actions */}
//         <div className="w-full md:w-1/2">
//           {/* Top section with title, model, colors, and quick add to cart */}
//           <div className="mb-6">
//             {/* Product badges */}
//             <div className="flex flex-wrap gap-2 mb-3">
//               {product.isNew && (
//                 <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded">
//                   New
//                 </Badge>
//               )}
//               {(product.isOnSale || Boolean(product.discount)) && (
//                 <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
//                   Sale
//                 </Badge>
//               )}
//               {product.isBestSeller && (
//                 <Badge className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
//                   Best Seller
//                 </Badge>
//               )}
//             </div>

//             {/* Product title */}
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {product.title}
//             </h1>

//             {/* Model/SKU information */}
//             <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
//               <span className="font-medium">Model/SKU:</span>
//               <span>{product.slug}</span>
//             </div>

//             {/* Pricing information */}
//             <div className="mb-4">
//               {discountedPrice ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl font-bold text-gray-900">
//                     {formatPrice(discountedPrice)}
//                   </span>
//                   <span className="text-lg text-gray-500 line-through">
//                     {formatPrice(product.price)}
//                   </span>
//                   <span className="text-red-500 font-medium">
//                     Save {product.discount}%
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-2xl font-bold text-gray-900">
//                   {formatPrice(product.price)}
//                 </span>
//               )}
//             </div>

//             {/* Quick access to colors */}
//             {product.colors && product.colors.length > 0 && (
//               <div className="mb-4">
//                 <h3 className="text-sm font-medium mb-2">Available Colors:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.colors.map((color) => (
//                     <motion.button
//                       key={color}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleColorSelect(color)}
//                       className={`w-6 h-6 rounded-full border-2 ${
//                         selectedColor === color
//                           ? "border-black"
//                           : "border-transparent hover:border-gray-300"
//                       }`}
//                       style={{
//                         backgroundColor: color,
//                         boxShadow:
//                           selectedColor === color
//                             ? "0 0 0 1px white, 0 0 0 2px black"
//                             : "none",
//                       }}
//                       aria-label={`Select ${color} color`}
//                       aria-pressed={selectedColor === color}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quick add to cart section */}
//             <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
//               {/* Simplified quantity selector */}
//               <div className="flex items-center">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => handleQuantityChange(quantity - 1)}
//                   disabled={quantity <= 1}
//                   aria-label="Decrease quantity"
//                   className="h-8 w-8"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <line x1="5" y1="12" x2="19" y2="12"></line>
//                   </svg>
//                 </Button>

//                 <input
//                   type="number"
//                   min="1"
//                   max={product.stock}
//                   value={quantity}
//                   onChange={(e) =>
//                     handleQuantityChange(parseInt(e.target.value) || 1)
//                   }
//                   className="w-12 text-center mx-1 border rounded-md py-1 h-8"
//                   aria-label="Quantity"
//                 />

//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => handleQuantityChange(quantity + 1)}
//                   disabled={quantity >= product.stock}
//                   aria-label="Increase quantity"
//                   className="h-8 w-8"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <line x1="12" y1="5" x2="12" y2="19"></line>
//                     <line x1="5" y1="12" x2="19" y2="12"></line>
//                   </svg>
//                 </Button>
//               </div>

//               {/* Quick add to cart button */}
//               <Button
//                 onClick={handleAddToCart}
//                 disabled={!isAvailable || isAddingToCart}
//                 className="flex-1 bg-black hover:bg-gray-800 text-white h-8 text-sm"
//                 variant="default"
//               >
//                 {isAddingToCart ? (
//                   <>
//                     <svg
//                       className="animate-spin h-4 w-4 mr-2"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Adding...
//                   </>
//                 ) : (
//                   "Add to Cart"
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Product description */}
//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">Description</h3>
//             <p className="text-gray-700">{product.description}</p>

//             {/* Product highlights/features section */}
//             {product.features && product.features.length > 0 && (
//               <div className="mt-4">
//                 <h4 className="text-md font-medium mb-2">Key Features</h4>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="text-gray-700">
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Full product actions with all options */}
//           <ProductActions
//             product={product}
//             quantity={quantity}
//             selectedColor={selectedColor}
//             onQuantityChange={handleQuantityChange}
//             onColorSelect={handleColorSelect}
//           />
//         </div>
//       </div>

//       {/* Product details tabs */}
//       <ProductTabs product={product} />
//     </div>
//   );
// };

// export default ProductDisplay;

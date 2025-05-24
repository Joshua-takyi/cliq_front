"use client";

import { CartData } from "../types/product_types";
import ResponsiveLazyImage from "./lazyImage";
import Link from "next/link";

interface CartCardProps {
  cartDetails: CartData; // Cart-specific details like quantity, color, model
  onUpdateQuantity: (
    productId: string,
    newQuantity: number,
    color: string,
    model: string
  ) => void;
}

export default function CartCard({
  cartDetails, // Add cartDetails to the destructured props
}: CartCardProps) {
  const {
    items: [{ color, model, quantity, slug, total_price }],
  } = cartDetails;

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS", // Ghana Cedi
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="flex items-start p-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
    >
      {/* Product image with quantity badge overlay */}
      <div className="relative h-24 w-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        {cartDetails.items[0].image ? (
          <>
            <ResponsiveLazyImage
              src={cartDetails.items[0].image}
              alt={slug}
              height={100}
              width={100}
              className="object-cover"
              sizes="100%"
            />
            {/* Quantity badge positioned on top-right corner of image */}
            <div className="absolute top-0 right-0 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-bl-md">
              x{quantity}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product details with improved layout */}
      <div className="ml-4 flex-grow flex flex-col justify-center h-24 ">
        {/* Top section: Product name and price */}
        <div>
          <div className="flex justify-between  flex-col items-start mb-1">
            <h3 className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
              {cartDetails.items[0].title}
            </h3>
            <span className="font-medium text-sm text-gray-900">
              {formatPrice(total_price)}
            </span>
          </div>

          {/* Middle section: Product attributes in a cleaner layout */}
          <div className="text-xs text-gray-500  gap-3">
            {color && (
              <div className="flex items-center gap-1.5">
                <span>Color:</span>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              </div>
            )}
            {model && <p className="whitespace-nowrap">Model: {model}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}

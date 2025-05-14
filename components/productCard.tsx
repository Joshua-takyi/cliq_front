import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
// import { LazyImage } from "./LazyImage";
import formatPrice from "@/libs/helpers";
import { ProductProps } from "@/types/product_types";
import ResponsiveLazyImage from "./lazyImage";

interface ProductCardProps {
  product: ProductProps;
}

export function ProductCard({ product }: ProductCardProps) {
  const { _id, title, price, images, rating, discount, isOnSale, slug } =
    product;

  // Calculate discounted price
  const discountedPrice =
    isOnSale && discount ? price - (price * discount) / 100 : price;

  // Format for display
  const formattedPrice = formatPrice(price);
  const formattedDiscountedPrice = formatPrice(discountedPrice);

  // Product URL
  const productUrl = `/product/${slug || _id}`;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Sale badge */}
      {isOnSale && discount && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {discount}% OFF
        </div>
      )}

      {/* Product image */}
      <Link
        href={productUrl}
        className="relative block aspect-square overflow-hidden"
      >
        <ResponsiveLazyImage
          src={images[0] || "/images/placeholder.png"}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-src={images[0] || "/images/placeholder.png"}
        />

        {/* Quick action buttons that appear on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="rounded-full">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </button>
            <button className="rounded-full">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Product details */}
      <div className="p-4">
        <Link href={productUrl} className="block">
          <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`font-semibold ${
              isOnSale && discount ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formattedDiscountedPrice}
          </span>

          {isOnSale && discount && (
            <span className="text-sm text-gray-500 line-through">
              {formattedPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

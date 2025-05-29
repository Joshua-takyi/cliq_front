"use client";

// Removed unused useState import as no local state is used in this component
import Link from "next/link";
import ResponsiveLazyImage from "./lazyImage";
// import { useRouter } from "next/navigation";

// Helper Functions
const formatPrice = (price: number, currency = "GHS"): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
  }).format(price);
};

// Props Interface matching Go struct Product model
export interface ProductCardProps {
  product: {
    id?: string;
    title: string;
    description?: string;
    price: number;
    discount?: number;
    slug: string;
    category?: string[];
    images: string[];
    tags?: string[];
    is_available?: boolean;
    is_new?: boolean;
    is_on_sale?: boolean;
    sales_start_date?: string;
    sales_end_date?: string;
    models?: string[];
    colors?: string[];
    materials?: string[];
    warranty?: number;
    details?: string[];
    features?: string[];
    stock?: number;
    rating?: number;
    reviewCount?: number;
    created_at?: string;
    updated_at?: string;
    className?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    title,
    price,
    discount,
    images,
    slug,
    is_new,
    is_on_sale,
    stock,
    rating,
    className = "",
  } = product;

  // Convert images array to ensure it's always an array
  const imageArray = Array.isArray(images) ? images : [images];

  // Function to determine badge display based on Go struct fields with priority order
  const getBadgeInfo = () => {
    // Check if product is out of stock (highest priority)
    if (stock !== undefined && stock <= 0) {
      return {
        text: "Out of Stock",
        bgColor: "bg-gray-500",
        textColor: "text-white",
      };
    }
    // Check if product is on sale
    if (is_on_sale) {
      return { text: "Sale", bgColor: "bg-red-600", textColor: "text-white" };
    }
    // Check if product is new
    if (is_new) {
      return { text: "New", bgColor: "bg-black", textColor: "text-white" };
    }
    // Check if product has high rating (4.5+) and show as featured
    if (rating !== undefined && rating >= 4.5) {
      return {
        text: "Top Rated",
        bgColor: "bg-green-600",
        textColor: "text-white",
      };
    }
    return null;
  };

  const badgeInfo = getBadgeInfo();

  // Calculate discounted price if discount exists
  const finalPrice =
    discount && discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <Link
      href={`/product/${slug}`}
      className={`group relative block w-full bg-transparent border border-black/50 transition-all duration-300 hover:border-black ${className}`}
    >
      <div className="relative">
        {/* Product Image Container - Reduced size by 20% */}
        <div className="relative aspect-[3/4] w-full overflow-hidden border-black/50">
          <ResponsiveLazyImage
            src={imageArray[0]}
            alt={title}
            sizes="(max-width: 640px) 72vw, (max-width: 768px) 40vw, (max-width: 1024px) 26vw, 20vw"
            className="object-cover transition-opacity duration-500 ease-in-out imgBg aspect-square absolute inset-0 w-full h-full group-hover:opacity-0"
          />
          {/* Second image for hover effect if available - 20% smaller sizes */}
          {imageArray.length > 1 && (
            <ResponsiveLazyImage
              src={imageArray[1]}
              alt={`${title} - alternate view`}
              sizes="(max-width: 640px) 72vw, (max-width: 768px) 40vw, (max-width: 1024px) 26vw, 20vw"
              className="object-cover transition-opacity duration-500 ease-in-out imgBg aspect-square absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Conditional Badge Display - Smaller badge size */}
        {badgeInfo && (
          <div
            className={`absolute left-0 top-0 ${badgeInfo.bgColor} px-2 py-0.5 z-10`}
          >
            <span
              className={`text-[10px] font-medium uppercase tracking-wide ${badgeInfo.textColor}`}
            >
              {badgeInfo.text}
            </span>
          </div>
        )}
      </div>

      {/* Product Information Section - Reduced padding and font sizes */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        <h3 className="text-[10px] md:text-xs font-normal text-gray-900 leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          {/* Show original and discounted price if discount exists */}
          <div className="flex flex-col">
            {discount && discount > 0 ? (
              <>
                <p className="text-[10px] md:text-xs font-bold text-gray-900">
                  {formatPrice(finalPrice)}
                </p>
                <p className="text-[8px] md:text-[10px] text-gray-500 line-through">
                  {formatPrice(price)}
                </p>
              </>
            ) : (
              <p className="text-[10px] md:text-xs font-bold text-gray-900">
                {formatPrice(price)}
              </p>
            )}
          </div>

          {/* Display rating if available */}
          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-[8px] md:text-[10px] text-gray-600 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;

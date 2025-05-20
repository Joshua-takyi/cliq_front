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

const formatName = (title: string): string => {
  return title.length > 50 ? `${title.slice(0, 50)}...` : title;
};

// Props Interface
export interface ProductCardProps {
  product: {
    title: string;
    price: number;
    id?: string | null;
    images: string | string[];
    slug: string;
    colors?: string | string[];
    model?: string;
    isNew?: boolean;
    className?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { title, price, images, slug, isNew, className = "" } = product;

  const imageArray = Array.isArray(images) ? images : [images];

  return (
    <Link
      href={`/product/${slug}`}
      className={`group relative block w-full bg-transparent border border-black/50 ${className}`}
    >
      <div className="relative  ">
        <div className="relative  aspect-[3/4] w-full overflow-hidden border border-black/50 ">
          <ResponsiveLazyImage
            src={imageArray[0]}
            alt={title}
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 ease-in-out imgBg aspect-square absolute inset-0 w-full h-full group-hover:opacity-0"
          />
          {imageArray.length > 1 && (
            <ResponsiveLazyImage
              src={imageArray[1]}
              alt={`${title} - alternate view`}
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-opacity duration-500 ease-in-out imgBg aspect-square absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {isNew && (
          <div className="absolute left-0 top-0 bg-black px-2 py-1">
            <span className="text-xs font-medium uppercase text-white">
              New
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 space-y-5">
        <h3 className="text-xs md:text-sm  font-normal text-gray-900 mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="md:text-sm text-xs font-bold text-gray-900">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;

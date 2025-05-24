"use client";

import { ProductProps } from "@/types/product_types";
// Import Badge from its correct module or replace with an alternative component
import { Badge } from "../ui/badge"; // Adjust the path to the correct module exporting Badge

interface ProductInfoProps {
  product: ProductProps;
  selectedColor: string | null;
}

/**
 * ProductInfo component displays all the static product information
 * including title, price, description, and product badges/labels
 *
 * @param product - The product data object
 * @param selectedColor - Currently selected color (if applicable)
 */
const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  // selectedColor,
}) => {
  // Calculate the discount price if applicable
  const discountedPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : null;

  // Format prices with proper currency symbol and decimals
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Function to check if a product is on sale based on discount or isOnSale flag
  const isOnSale = product.isOnSale || Boolean(product.discount);

  // Available stock status text and color
  const stockStatus = () => {
    if (product.stock <= 0)
      return { text: "Out of Stock", color: "text-red-500" };
    if (product.stock <= 5)
      return {
        text: `Low Stock (${product.stock} left)`,
        color: "text-amber-500",
      };
    return { text: "In Stock", color: "text-green-600" };
  };

  return (
    <div className="product-info mb-8">
      {/* Product badges (new, sale, etc.) */}
      <div className="flex flex-wrap gap-2 mb-3">
        {product.isNew && (
          <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded">
            New
          </Badge>
        )}
        {isOnSale && (
          <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            Sale
          </Badge>
        )}
        {product.isBestSeller && (
          <Badge className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
            Best Seller
          </Badge>
        )}
      </div>

      {/* Product title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

      {/* Product category */}
      <div className="text-sm text-gray-500 mb-4">
        {product.category.join(" / ")}
      </div>

      {/* Pricing information */}
      <div className="mb-6">
        {discountedPrice ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="text-red-500 font-medium">
              Save {product.discount}%
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        )}

        {/* Stock status */}
        <div className={`mt-2 ${stockStatus().color}`}>
          {stockStatus().text}
        </div>
      </div>

      {/* Product description */}
      <div className="mb-6">
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Product highlights/features section */}
      {product.features && product.features.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Key Features</h3>
          <ul className="list-disc pl-5 space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Warranty information if available */}
      {product.warranty && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>
            {product.warranty} {product.warranty === 1 ? "month" : "months"}{" "}
            Warranty
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

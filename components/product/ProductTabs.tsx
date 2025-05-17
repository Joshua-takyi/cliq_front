"use client";

import { useState } from "react";
import { ProductProps } from "@/types/product_types";
import { motion } from "framer-motion";

interface ProductTabsProps {
  product: ProductProps;
}

/**
 * ProductTabs component displays tabbed content about the product
 * including details, specifications, and other relevant information
 *
 * @param product - The product data object
 */
const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("details");

  // Define tab configuration
  const tabs = [
    {
      id: "details",
      label: "Product Details",
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
      label: "Key Features",
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
      label: "Specifications",
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
          <div className="border-b pb-2">
            <span className="font-medium">Availability</span>
            <p className="text-gray-600">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
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
    <div className="mt-12 mb-16">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Product information tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm relative ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;

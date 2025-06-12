"use client";

import { useRef } from "react";
import ImageCarousel from "../productImageCarousel";

interface ProductImageSectionProps {
  images: string[];
  title: string;
}

/**
 * ProductImageSection component displays the product images in a carousel layout
 * It includes a main image display and thumbnail navigation
 *
 * @param images - Array of image URLs for the product
 * @param title - Product title used for image alt text
 */
const ProductImageSection: React.FC<ProductImageSectionProps> = ({
  images = [],
  title = "Product",
}) => {
  // Reference for the main image container for potential future enhancements
  const containerRef = useRef<HTMLDivElement>(null);

  if (!images.length) {
    return (
      // loading
      <div className="flex items-center justify-center w-full h-[70vh] "></div>
    );
  }

  return (
    <div className="product-images-container w-full max-w-6xl mx-auto px-4 lg:px-0">
      {/* Main image area: full width, tall height for large screens */}
      <div
        ref={containerRef}
        className="relative w-full h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl mb-4 transition-all duration-300 ease-in-out"
      >
        <ImageCarousel images={images} alt={title} />
      </div>
      {/* )} */}
    </div>
    // </div>
  );
};

export default ProductImageSection;

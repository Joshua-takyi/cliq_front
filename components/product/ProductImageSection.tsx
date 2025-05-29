"use client";

import { useRef, useState } from "react";
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
  // const [isZoomed, setIsZoomed] = useState(false);
  // const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (index: number) => setActiveImageIndex(index);

  // const handleZoomToggle = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const target = e.target as HTMLElement;
  //   if (target.closest("button") || target.closest(".thumbnail-container"))
  //     return;
  //   setIsZoomed(!isZoomed);
  // };

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!isZoomed) return;
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //   setZoomPosition({ x, y });
  // };

  // const handleMouseLeave = () => {
  //   if (isZoomed) setIsZoomed(false);
  // };

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
        {/* {isZoomed ? (
          <div
            className="absolute inset-0 z-20 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: `url(${images[activeImageIndex]})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "350% 350%",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          <div
            className="w-full h-full z-10 cursor-zoom-in"
            onClick={handleZoomToggle}
          > */}
        <ImageCarousel
          images={images}
          alt={title}
          onActiveIndexChange={handleImageChange}
        />
      </div>
      {/* )} */}
    </div>
    // </div>
  );
};

export default ProductImageSection;

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FullscreenImageViewerProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

/**
 * FullscreenImageViewer component displays product images in a fullscreen modal
 * with navigation controls and keyboard shortcut support
 *
 * @param images - Array of image URLs to display
 * @param initialIndex - Index of the image to show first
 * @param isOpen - Boolean controlling whether the viewer is visible
 * @param onClose - Function to call when closing the viewer
 * @param title - Product title for accessibility and SEO
 */
const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation and ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    // Reset to initial index when opening
    setCurrentIndex(initialIndex);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          // Navigate to previous image
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case "ArrowRight":
          // Navigate to next image
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
          break;
        case "Escape":
          // Close viewer
          onClose();
          break;
      }
    };

    // Add keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, initialIndex, images.length, onClose]);

  // Navigate to previous image
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  // Navigate to next image
  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center"
          onClick={(e) => {
            // Close only if clicking the background, not the image or controls
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Close fullscreen view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image container */}
          <div className="relative w-full h-full flex items-center justify-center px-16">
            <motion.img
              key={currentIndex} // Important for animation when image changes
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.5, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain"
            />

            {/* Navigation buttons - Previous */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing when clicking buttons
                    goToPrevious();
                  }}
                  className="absolute left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </motion.button>

                {/* Navigation buttons - Next */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing when clicking buttons
                    goToNext();
                  }}
                  className="absolute right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </>
            )}
          </div>

          {/* Thumbnails at bottom for quick navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-16 h-16 flex-shrink-0 border-2 transition-all ${
                    idx === currentIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={idx === currentIndex}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenImageViewer;

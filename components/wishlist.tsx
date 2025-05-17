"use client";

import { Heart } from "lucide-react"; // Using Heart icon for wishlist
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Wishlist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Toggle wishlist panel visibility
  const toggleWishlist = () => {
    setIsOpen(!isOpen);
  };

  // Detect mobile screen size
  useEffect(() => {
    // Check if the window width is less than 768px
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle ESC key press to close the wishlist panel
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleEscKey);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Wishlist trigger button with icon and label */}
      <div
        onClick={toggleWishlist}
        className="flex items-center cursor-pointer gap-1 md:gap-2 px-1 md:px-3 py-1 md:py-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open wishlist"
      >
        <Heart size={isMobile ? 18 : 20} />
        {/* Hide label on mobile for better spacing */}
        <span className="hidden md:inline">Wishlist</span>
      </div>

      {/* Overlay that appears when wishlist is open */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs z-40"
          onClick={toggleWishlist}
        ></div>
      )}

      {/* Wishlist panel that slides from the right */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }} // Start from right side
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? "0%" : "100%", // Move from right to visible position when open
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother animation
        }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
        }}
        className="w-[85%] sm:w-[50%] md:w-[35%] lg:w-[30%] xl:w-[25%] bg-customBackground border-l border-black/40 h-full"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Wishlist</h2>

            {/* Animated close button */}
            <button
              onClick={toggleWishlist}
              className="relative w-8 h-8 focus:outline-none"
              aria-label="Close wishlist"
            >
              {/* First line of the X */}
              <motion.div
                initial={false}
                animate={{
                  rotate: isOpen ? 45 : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-1/2 left-0 w-8 h-0.5 bg-gray-800 transform -translate-y-1/2"
              ></motion.div>

              {/* Second line of the X */}
              <motion.div
                initial={false}
                animate={{
                  rotate: isOpen ? -45 : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-1/2 left-0 w-8 h-0.5 bg-gray-800 transform -translate-y-1/2"
              ></motion.div>
            </button>
          </div>

          {/* Wishlist content area */}
          <div className="flex-grow overflow-auto">
            <p className="text-gray-500">Your wishlist is empty.</p>
            {/* Wishlist items would be rendered here */}
          </div>

          {/* Footer with action buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors">
              View all items
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Wishlist;

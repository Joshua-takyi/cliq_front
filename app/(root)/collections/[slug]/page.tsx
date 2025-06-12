"use client";

import Grid from "@/components/grid";
import ProductFilter from "@/components/ProductFilter";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CollectionPage() {
  // Get the slug from the URL parameters to identify which collection we're viewing
  // Unwrap params Promise using React.use() for compatibility with Next.js latest versions
  // Using 'unknown' first to handle the type conversion safely
  // const resolvedParams = use(params as unknown as Promise<{ slug: string }>);
  // const slug = resolvedParams.slug as string;

  // State for mobile filter panel visibility - simplified state management
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Handle ESC key press to close the filter panel like cart component
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileFilterOpen) {
        setIsMobileFilterOpen(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleEscKey);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isMobileFilterOpen]);

  // Prevent body scrolling when filter is open like cart component
  useEffect(() => {
    // Store the original overflow style to restore it later
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isMobileFilterOpen) {
      // Disable scrolling on the body when filter is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when filter is closed
      document.body.style.overflow = originalStyle;
    }

    // Cleanup function to restore original overflow style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isMobileFilterOpen]); // Only re-run when isMobileFilterOpen changes

  return (
    <div className="max-w-[100rem] mx-auto px-4 py-8">
      {/* Collection header displays collection-specific information */}
      {/* <CollectionHeader params={{ slug }} /> */}

      {/* Mobile Filter Button - Enhanced with smooth hover animation */}
      <div className="lg:hidden mb-4">
        <motion.button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-none text-sm transition-all duration-200 ease-out hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ duration: 0.2 }}
          >
            <Filter className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">Filters</span>
        </motion.button>
      </div>

      {/* Desktop Layout - Side by side filter and grid */}
      <div className="hidden lg:flex gap-6">
        {/* Filter sidebar - Only visible on desktop */}
        <div className="w-80 flex-shrink-0">
          <ProductFilter />
        </div>

        {/* Product grid takes remaining space */}
        <div className="flex-1">
          <Grid />
        </div>
      </div>

      {/* Mobile Layout - Full width grid only */}
      <div className="lg:hidden">
        <Grid />
      </div>

      {/* Mobile Filter Overlay - Smooth framer-motion animations like cart component */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop with beautiful blur effect and smooth fade-in animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier easing like cart
              }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Filter Panel with smooth slide-in animation from right */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother animation
              }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
            >
              {/* Close button header with modern design */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <motion.button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ease-out"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Filter component with content fade-in */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductFilter />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

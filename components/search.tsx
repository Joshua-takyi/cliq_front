import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle search panel visibility
  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  // Handle ESC key press to close the search panel
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
      {/* Search trigger button with icon and label */}
      <div
        onClick={toggleSearch}
        className="flex items-center cursor-pointer gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon size={20} />
        <span>Search</span>
      </div>

      {/* Search panel that appears from the bottom with animation */}
      <motion.div
        initial={{ opacity: 0, y: "100%" }} // Start fully below the viewport
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? "0%" : "100%", // Move to visible position when open
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother, more natural animation
        }}
        style={{
          position: "fixed",
          top: "110px",
          left: 0,
          right: 0,
          bottom: 0,
          height: "calc(100vh - 112px)", // Full height minus header and nav heights
          zIndex: 40,
        }}
        className="w-full bg-customBackground"
      >
        <div className="w-[90%] mx-auto h-full py-6">
          <div className="flex items-center justify-between mb-8 border-b-1">
            <input
              type="text"
              className="p-4 md:h-[6rem] w-full md:text-3xl opacity-70 focus:outline-none text-center placeholder:font-bold placeholder:text-black md:placeholder:text-3xl placeholder:capitalize placeholder:opacity-70"
              placeholder="Search for products, brands, and more..."
            />
            {/* Animated hamburger close button with just 2 divs that form an X when active */}
            <button
              onClick={toggleSearch}
              className="relative w-14 h-14 focus:outline-none cursor-pointer"
              aria-label="Close search"
              // w-14 and h-14 make the button much larger for easier interaction
            >
              {/* First line of the X - rotates to 45 degrees when open */}
              <motion.div
                initial={false}
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 0 : -10, // Move further for larger button
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-1/2 left-0 w-14 h-1 bg-gray-800 transform -translate-y-1/2"
                // w-14 for longer line, h-1 for thicker line
              ></motion.div>

              {/* Second line of the X - rotates to -45 degrees when open */}
              <motion.div
                initial={false}
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? 0 : 10, // Move further for larger button
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-1/2 left-0 w-14 h-1 bg-gray-800 transform -translate-y-1/2"
                // w-14 for longer line, h-1 for thicker line
              ></motion.div>
            </button>
          </div>

          {/* Search content area - left empty as requested */}
          <div className="h-full">
            {/* Empty by design - you'll implement the content */}
          </div>

          {/* Footer helper text */}
          <div className="mt-4 text-sm text-gray-500">
            Press ESC to close search
          </div>
        </div>
      </motion.div>
    </div>
  );
};

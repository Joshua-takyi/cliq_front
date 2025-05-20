import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Toggle search panel visibility
  const toggleSearch = () => {
    // Toggle the search panel state
    setIsOpen(!isOpen);
    // The body overflow is handled by the isOpen effect
  };

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

  // Effect to manage body scroll locking based on search panel state
  useEffect(() => {
    // This effect handles changes to the isOpen state
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    } else {
      document.body.style.overflow = ""; // Allow scrolling when closed
    }

    // Cleanup function to ensure scrolling is always restored
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Only navigate if search query is not empty
    if (searchQuery.trim()) {
      // Close the search panel
      setIsOpen(false);
      setSearchQuery("");

      // Navigate to search page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle ESC key press to close the search panel
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        document.body.style.overflow = ""; // Restore scrolling when closing with ESC key
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleEscKey);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      // Ensure scrolling is restored if component unmounts while search is open
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Search trigger button with icon and label */}
      <div
        onClick={toggleSearch}
        className="flex items-center cursor-pointer gap-1 md:gap-2 px-1 md:px-3 py-1 md:py-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon size={isMobile ? 18 : 20} />
        {/* Hide label on mobile for better spacing */}
        <span className="hidden md:inline">Search</span>
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
          top: "70px", // Fixed top position
          left: 0,
          right: 0,
          bottom: 0, // Ensures it extends to the bottom of the screen
          zIndex: 40,
          overflowY: "auto", // Allow scrolling within the search panel itself
          height: "100%", // Full height
          maxHeight: "calc(100vh - 87px)", // Ensure it doesn't extend beyond the viewport
        }}
        className="w-full bg-customBackground flex flex-col" // Added flex column to control inner content layout
      >
        <div className="w-[90%] mx-auto flex flex-col flex-1 py-6 overflow-hidden">
          {/* Using flex-col and flex-1 to control vertical spacing */}
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between border-b-1  mb-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-4 md:h-[6rem] w-full md:text-3xl opacity-70 focus:outline-none text-center placeholder:font-bold placeholder:text-black md:placeholder:text-3xl placeholder:capitalize placeholder:opacity-70"
              placeholder="Search for products, brands, and more..."
              autoFocus
            />
            {/* Search submit button */}

            {/* Animated hamburger close button with just 2 divs that form an X when active */}
            <button
              type="button"
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
          </form>

          {/* Search content area with proper flex sizing */}
          <div className="flex-1 overflow-y-auto">
            {/* Content will be scrollable if it overflows */}
            {/* render the search items */}
          </div>

          {/* Footer helper text - positioned at the bottom */}
          <div className="mt-auto pt-2 text-sm text-gray-500">
            Press ESC to close search
          </div>
        </div>
      </motion.div>
    </div>
  );
};

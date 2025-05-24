import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle search panel visibility
  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  // Focus the search input when the panel opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Short timeout to ensure the DOM has updated and the element is visible
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

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
    if (isOpen) {
      // Save the current scroll position before locking
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Restore scroll position when closing
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Cleanup function to ensure scrolling is always restored
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
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
        className="flex items-center cursor-pointer gap-1 md:gap-2 px-1 md:px-3 py-1 md:py-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon size={isMobile ? 18 : 20} />
        {/* Hide label on mobile for better spacing */}
        <span className="hidden md:inline">Search</span>
      </div>

      {/* Search overlay that covers the entire viewport */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></motion.div>
      )}

      {/* Search panel that slides up from the bottom */}
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? "0%" : "100%",
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed inset-0 z-50 bg-customBackground"
        style={{
          display: isOpen ? "block" : "none",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="w-[90%] mx-auto flex flex-col flex-1 py-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center justify-between border-b mb-4"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                className="p-4 md:h-[6rem] w-full md:text-3xl opacity-70 focus:outline-none text-center placeholder:font-bold placeholder:text-black md:placeholder:text-3xl placeholder:capitalize placeholder:opacity-70"
                placeholder="Search for products, brands, and more..."
                autoFocus
              />

              {/* Animated close button */}
              <button
                type="button"
                onClick={toggleSearch}
                className="relative w-14 h-14 focus:outline-none cursor-pointer"
                aria-label="Close search"
              >
                {/* First line of the X */}
                <motion.div
                  initial={false}
                  animate={{ rotate: 45, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-1/2 left-0 w-14 h-1 bg-gray-800 transform -translate-y-1/2"
                ></motion.div>

                {/* Second line of the X */}
                <motion.div
                  initial={false}
                  animate={{ rotate: -45, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-1/2 left-0 w-14 h-1 bg-gray-800 transform -translate-y-1/2"
                ></motion.div>
              </button>
            </form>

            {/* Search content area - scrollable if content overflows */}
            <div className="flex-1 overflow-y-auto">
              {/* Search results would be rendered here */}
              <div className="py-4">
                {/* Placeholder for search results */}
                <p className="text-center text-gray-500 italic">
                  Start typing to search products...
                </p>
              </div>
            </div>

            {/* Footer helper text */}
            <div className="pt-4 text-sm text-center text-gray-500">
              Press ESC to close search
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import { ShoppingBag } from "lucide-react"; // Using ShoppingBag icon for cart
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle cart panel visibility
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Handle ESC key press to close the cart panel
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
      {/* Cart trigger button with icon and label */}
      <div
        onClick={toggleCart}
        className="flex items-center cursor-pointer gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag size={20} />
        <span>Cart</span>
      </div>

      {/* Overlay that appears when cart is open */}
      {isOpen && (
        <div
          className="fixed inset-0  backdrop-blur-xs bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}

      {/* Cart panel that slides from the right */}
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
        className="w-[85%] sm:w-[50%] md:w-[35%] lg:w-[30%] xl:w-[25%] bg-[#f8f8f8] border-l border-black h-full"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>

            {/* Animated close button */}
            <button
              onClick={toggleCart}
              className="relative w-8 h-8 focus:outline-none"
              aria-label="Close cart"
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

          {/* Cart content area */}
          <div className="flex-grow overflow-auto">
            <p className="text-gray-500">Your cart is empty.</p>
            {/* Cart items would be rendered here */}
          </div>

          {/* Summary and checkout section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">₵0.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <button className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors">
              Checkout
            </button>
            <button className="w-full py-3 mt-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors">
              View Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;

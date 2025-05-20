"use client";

import { ShoppingBag } from "lucide-react"; // Using ShoppingBag icon for cart
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CartCard from "./cartCart"; // Import the CartCard component
import { UseCart } from "../hooks/useCart"; // Import the cart hook
import { CartData } from "../types/product_types"; // Import product types
import { useSession } from "next-auth/react";
import { useCheckout } from "@/app/services/checkout";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  // State to store cart items
  const [isMobile, setIsMobile] = useState(false);
  const [cartItems, setCartItems] = useState<
    Array<{
      cartDetails: CartData;
    }>
  >([]);
  // Track if on mobile screen

  const session = useSession();
  const { GetCart } = UseCart();

  const { data, isLoading } = GetCart;

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

  const fetchCartItems = async () => {
    try {
      if (data) {
        const cartItems = data.items.map((item) => ({
          // Map each item to include the product details and cart details
          cartDetails: {
            items: [
              {
                id: item.id,
                color: item.color,
                slug: item.slug,
                title: item.title,
                model: item.model,
                image: item.image,
                total_price: item.total_price,
                quantity: item.quantity,
                product_Id: item.product_Id,
              },
            ],
            total_amount: item.total_price,
          },
        }));
        setCartItems(cartItems);
      }
    } catch (error) {}
  };

  // Toggle cart panel visibility
  const toggleCart = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Fetch cart items when opening the cart
      fetchCartItems();
    }
  };

  // Load cart items on component mount and whenever data changes
  useEffect(() => {
    if (data) {
      fetchCartItems();
    }
  }, [data]); // This will run whenever data changes, ensuring cart items are always up-to-date

  // Existing effect for when cart is opened
  useEffect(() => {
    if (isOpen && data) {
      fetchCartItems();
    }
  }, [isOpen, data]);

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

  // Prevent body scrolling when cart is open
  useEffect(() => {
    // Store the original overflow style to restore it later
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      // Disable scrolling on the body when cart is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when cart is closed
      document.body.style.overflow = originalStyle;
    }

    // Cleanup function to restore original overflow style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]); // Only re-run when isOpen changes

  // Function to update cart item quantity
  const updateCartItemQuantity = async (
    productId: string,
    newQuantity: number,
    color: string,
    model: string
  ) => {
    try {
      // Optimistically update the UI
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartDetails.items.some(
            (cartItem) => cartItem.product_Id === productId
          ) &&
          item.cartDetails.items.some((cartItem) => cartItem.color === color) &&
          item.cartDetails.items.some((cartItem) => cartItem.model === model)
            ? {
                ...item,
                cartDetails: {
                  ...item.cartDetails,
                  quantity: newQuantity,
                },
              }
            : item
        )
      );

      // Send update to the server
      // This is a placeholder. In a real app, you would use the UseCart hook's
      // update method or define an API call to update the cart item
      await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_Id: productId,
          color,
          model,
          quantity: newQuantity,
        }),
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      // Revert the optimistic update if it fails
      fetchCartItems();
    }
  };

  // // Format price with currency
  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "GHS", // Ghana Cedi (₵)
  //     minimumFractionDigits: 2,
  //   }).format(price);
  // };
  const { mutate } = useCheckout();
  // Handle checkout process
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    mutate({
      amount: data?.total_amount || 0,
      email: session?.data?.user?.email || "",
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="w-12 h-12 rounded-full border animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Cart trigger button with icon and label - responsive for mobile */}
      <div className="flex items-center">
        <div
          onClick={toggleCart}
          className="relative flex items-center justify-center cursor-pointer gap-1 md:gap-2 px-1 md:px-3 py-1 md:py-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag size={isMobile ? 24 : 22} strokeWidth={2} />
          <span className="hidden md:inline">Cart</span>
          {data && data.items && data.items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#9BEC00]  text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {data.items.length}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}

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
        className="w-[85%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[22%] bg-customBackground border-l border-black/40 h-full"
      >
        <div className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>

            <button
              onClick={toggleCart}
              className="relative w-8 h-8 focus:outline-none"
              aria-label="Close cart"
            >
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
          Cart content area
          <div className="flex-grow overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : cartItems && cartItems.length > 0 ? (
              <div className="space-y-1">
                {cartItems.map((item, index) => (
                  <CartCard
                    cartDetails={item.cartDetails}
                    key={`${item.cartDetails.items[0].product_Id}-${item.cartDetails.items[0].color}-${item.cartDetails.items[0].model}`}
                    onUpdateQuantity={updateCartItemQuantity}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <ShoppingBag size={40} className="text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty.</p>
              </div>
            )}
          </div>
          {/* Summary and checkout section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">
                {data && data.total_amount
                  ? formatPrice(data.total_amount)
                  : formatPrice(0)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <button
              className={`w-full py-3 font-medium rounded transition-colors ${
                cartItems.length > 0
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <Link href="/cart">
              <button
                className="w-full py-3 mt-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors border border-gray-300"
                disabled={cartItems.length === 0}
              >
                View Cart
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;

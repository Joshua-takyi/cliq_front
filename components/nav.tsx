"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search } from "./search";
import Wishlist from "./wishlist";
import Cart from "./cartComponent";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "admin";
  const pathname = usePathname();

  // State for mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // State for scroll direction and position
  // const [scrollDirection, setScrollDirection] = useState("up");
  // const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll event to control nav visibility
  // useEffect(() => {
  //   // Function to handle scroll events
  //   const handleScroll = () => {
  //     const currentPosition = window.scrollY;

  //     // Determine scroll direction
  //     if (currentPosition > scrollPosition) {
  //       setScrollDirection("down");
  //     } else {
  //       setScrollDirection("up");
  //     }

  //     // Update scroll position
  //     setScrollPosition(currentPosition);
  //   };

  //   // Add scroll event listener
  //   window.addEventListener("scroll", handleScroll);

  //   // Clean up event listener
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [scrollPosition]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const components = [
    {
      id: 1,
      name: "Shop",
      href: "/shop",
    },
    {
      id: 2,
      name: "Contacts",
      href: "/contacts",
    },
    {
      id: 3,
      name: "Phone Cases",
      href: "/collections/phone-cases?category=phone-cases",
    },
  ];

  // Animation variants for container
  const navVariants = {
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    hidden: {
      y: "-100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Mobile menu animation
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="border-b border-black/40  top-0 z-50 sticky bg-customBackground overflow-hidden"
      variants={navVariants}
      // Hide navbar on scroll down, show on scroll up or at top
      initial="visible"
      // animate={
      //   scrollDirection === "down" && scrollPosition > 100
      //     ? "hidden"
      //     : "visible"
      // }
    >
      <div className="max-w-[110rem] mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Brand/Logo */}

          {/* Desktop Navigation */}
          <motion.nav className="hidden md:block">
            <motion.ul
              className="flex space-x-4"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {components.map((component) => (
                <motion.li key={component.id} variants={itemVariants}>
                  <Link href={component.href} className="p-2 relative group">
                    <span>{component.name}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-black/80"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.li>
              ))}
              {isAdmin && (
                <motion.li key="admin" variants={itemVariants}>
                  <Link
                    href="/admin/products"
                    className="p-2 relative group text-blue-700 font-medium"
                  >
                    <span>Admin</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.li>
              )}
            </motion.ul>
          </motion.nav>
          <Link href="/" className="p-2">
            <motion.header whileHover={{ scale: 1.05 }}>
              <motion.h1
                className="text-3xl font-extrabold uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                cliq
              </motion.h1>
            </motion.header>
          </Link>

          {/* User actions: search, profile, cart */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {session ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/profile" className="p-2 hidden md:block">
                  Profile
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/auth/signin" className="p-2 hidden md:block">
                  Sign In
                </Link>
              </motion.div>
            )}
            <Search />
            <div className="h-6 border-l border-black/30 mx-2 hidden md:block" />
            <Cart />

            {/* Mobile menu button */}
            <motion.button
              className="ml-2 p-2 md:hidden"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="w-6 h-0.5 bg-black mb-1.5"
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="w-6 h-0.5 bg-black"
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="w-6 h-0.5 bg-black mt-1.5"
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              className="md:hidden overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.ul className="py-2 space-y-2 border-t border-black/10">
                {components.map((component) => (
                  <motion.li
                    key={component.id}
                    variants={itemVariants}
                    className="py-2"
                  >
                    <Link href={component.href} className="block px-2">
                      {component.name}
                    </Link>
                  </motion.li>
                ))}
                {isAdmin && (
                  <motion.li
                    key="admin"
                    variants={itemVariants}
                    className="py-2 text-blue-700 font-medium"
                  >
                    <Link href="/admin/products" className="block px-2">
                      Admin
                    </Link>
                  </motion.li>
                )}
                <motion.li variants={itemVariants} className="py-2">
                  <Link
                    href={session ? "/profile" : "/auth/signin"}
                    className="block px-2"
                  >
                    {session ? "Profile" : "Sign In"}
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

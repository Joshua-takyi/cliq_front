"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search } from "./search";
import Cart from "./cartComponent";
import SideBar from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "admin";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // State for mobile profile dropdown

  // Reference to the nav container for detecting clicks outside
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when path changes
  useEffect(() => {
    setIsOpen(false);
    setIsProfileDropdownOpen(false); // Also close profile dropdown on navigation
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        setIsProfileDropdownOpen(false); // Close profile dropdown when main menu closes
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle mobile profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Navigation items
  const components = [
    {
      id: 3,
      name: "Phone Cases",
      href: "/collections/phone-cases?category=phone-cases",
    },
  ];

  // Animation variants for main navigation container
  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    hidden: {
      y: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Animation variants for desktop navigation list
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual navigation items
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

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  // Mobile menu item variants with slide-in effect
  const mobileItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  // Hamburger button variants
  const hamburgerLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    open: (custom: number) => ({
      rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
      y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
      opacity: custom === 2 ? 0 : 1,
      transition: { duration: 0.2 },
    }),
  };

  // Toggle mobile menu with animation
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      ref={navRef}
      className="border border-black/40 top-0 z-50 sticky bg-customBackground"
      variants={navVariants}
      initial="visible"
    >
      <div className="max-w-[110rem] mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-3 lg:py-4">
          {/* Desktop Navigation */}
          <motion.nav className="hidden md:block">
            <motion.ul
              className="flex md:space-x-3 lg:space-x-6"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {components.map((component) => (
                <motion.li key={component.id} variants={itemVariants}>
                  <Link
                    href={component.href}
                    className="md:p-1 lg:p-2 relative group"
                  >
                    <span className="font-medium md:text-sm lg:text-base">
                      {component.name}
                    </span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-black/80"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </Link>
                </motion.li>
              ))}
              {isAdmin && (
                <motion.li key="admin" variants={itemVariants}>
                  <Link
                    href="/admin/products"
                    className="md:p-1 lg:p-2 relative group text-blue-700 font-medium"
                  >
                    <span className="md:text-sm lg:text-base">Admin</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </Link>
                </motion.li>
              )}
            </motion.ul>
          </motion.nav>

          {/* Logo/Brand */}
          <Link href="/" className="p-1 md:p-2">
            <motion.header
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.h1
                className="text-2xl md:text-2xl lg:text-3xl italic capitalize"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                OhCase!
              </motion.h1>
            </motion.header>
          </Link>

          {/* User actions: search, profile, cart */}
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            {session ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="hidden md:block"
              >
                <Link
                  href="/profile/order"
                  className="md:p-1 lg:p-2 font-medium md:text-sm lg:text-base"
                >
                  Profile
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="hidden md:block"
              >
                <Link
                  href="/auth/signin"
                  className="md:p-1 lg:p-2 font-medium md:text-sm lg:text-base"
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            {/* Search, Cart and Divider with responsive sizing */}
            <div className="flex items-center">
              <Search />
              <div className="h-5 md:h-5 lg:h-6 border-l border-black/30 mx-1 md:mx-2 hidden md:block" />
              <Cart />
            </div>

            {/* Enhanced Hamburger Menu Button for Mobile */}
            <motion.button
              className="ml-2 p-2 md:hidden flex flex-col justify-center items-center h-10 w-10 rounded-md"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {/* Animated hamburger lines */}
              {[1, 2, 3].map((line) => (
                <motion.div
                  key={`line-${line}`}
                  className="w-6 h-0.5 bg-black my-0.5 rounded-full"
                  variants={hamburgerLineVariants}
                  custom={line}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Menu with smooth animations */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              className="md:hidden overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div
                className="py-4 space-y-1 border-t border-black/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Mobile Navigation Items */}
                {components.map((component) => (
                  <motion.div
                    key={component.id}
                    variants={mobileItemVariants}
                    className="py-2"
                  >
                    <Link
                      href={component.href}
                      className="block px-4 py-2 hover:bg-black/5 rounded-md transition-colors"
                    >
                      <span className="font-medium">{component.name}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Admin Link (if admin) */}
                {isAdmin && (
                  <motion.div
                    key="admin"
                    variants={mobileItemVariants}
                    className="py-2"
                  >
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}

                {/* Profile/Sign In Link - Updated for mobile with dropdown */}
                {session ? (
                  // Show profile dropdown for authenticated users
                  <motion.div variants={mobileItemVariants} className="py-2">
                    <SideBar
                      isMobile={true}
                      isDropdownOpen={isProfileDropdownOpen}
                      onToggleDropdown={toggleProfileDropdown}
                    />
                  </motion.div>
                ) : (
                  // Show sign-in link for unauthenticated users
                  <motion.div variants={mobileItemVariants} className="py-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 hover:bg-black/5 rounded-md transition-colors"
                    >
                      <span className="font-medium">Sign In</span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

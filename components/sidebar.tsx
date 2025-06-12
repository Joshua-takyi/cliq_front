"use client";
import SignOutDialog from "@/components/SignOutDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SideBarProps {
  isMobile?: boolean;
  isDropdownOpen?: boolean;
  onToggleDropdown?: () => void;
}

export default function SideBar({
  isMobile = false,
  isDropdownOpen = false,
  onToggleDropdown,
}: SideBarProps) {
  const pathName = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sidebarItems = [
    { id: 1, name: "Orders", href: "/profile/order" },
    { id: 2, name: "Address", href: "/profile/address" },
    { id: 3, name: "Personal Info", href: "/profile/personal-info" },
    { id: 4, name: "Wishlist", href: "/profile/wishlist" },
  ];

  const isActive = (href: string) => href === pathName;

  const handleLogoutClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const dropdownVariants = {
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

  const itemVariants = {
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

  if (isMobile) {
    return (
      <div className="py-2">
        <button
          onClick={onToggleDropdown}
          className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 rounded-md transition-colors duration-200"
          aria-expanded={isDropdownOpen}
          aria-label="Toggle profile menu"
        >
          <span className="font-medium text-gray-900">Profile</span>
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="overflow-hidden"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="pl-6 pr-4 py-2 space-y-1">
                {sidebarItems.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-[#9BEC00] bg-green-50 font-medium border-l-2 border-[#9BEC00]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={itemVariants}>
                  <button
                    onClick={handleLogoutClick}
                    className="block px-3 py-2 rounded-md text-sm w-full text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isDialogOpen && <SignOutDialog onCancel={handleDialogClose} />}
      </div>
    );
  }

  return (
    <aside className="w-full hidden lg:flex lg:flex-col sticky top-0 h-full">
      {/* Sidebar navigation - matching the reference image style with scrollable content */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          <li>
            <Link
              href="/profile/order"
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                isActive("/profile/order") ? "font-medium" : "text-gray-700"
              }`}
            >
              My Order
            </Link>
          </li>
          <li>
            <Link
              href="/profile/address"
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                isActive("/profile/address") ? "font-medium" : "text-gray-700"
              }`}
            >
              Address Management
            </Link>
          </li>
          <li>
            <Link
              href="/profile/personal-info"
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                isActive("/profile/personal-info")
                  ? "font-medium"
                  : "text-gray-700"
              }`}
            >
              Personal Information
            </Link>
          </li>
          <li>
            <Link
              href="/profile/wishlist"
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                isActive("/profile/wishlist") ? "font-medium" : "text-gray-700"
              }`}
            >
              My Wish
            </Link>
          </li>

          {/* Logout button - separated at the bottom */}
          <li className="border-t border-gray-200 mt-4">
            <button
              onClick={handleLogoutClick}
              className="block w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors text-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Sign out dialog */}
      {isDialogOpen && <SignOutDialog onCancel={handleDialogClose} />}
    </aside>
  );
}

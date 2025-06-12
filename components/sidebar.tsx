"use client";
import SignOutDialog from "@/components/SignOutDialog";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
        duration: 0.2,
        ease: "easeOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -8,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  if (isMobile) {
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={onToggleDropdown}
          className="flex items-center justify-between w-full px-5 py-4 text-left"
          aria-expanded={isDropdownOpen}
          aria-label="Toggle profile menu"
        >
          <span className="text-base font-medium text-gray-900">Profile</span>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="overflow-hidden bg-gray-50/30"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="px-5 py-3">
                {sidebarItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      className={`block py-3 text-sm transition-colors duration-150 ${
                        isActive(item.href)
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={itemVariants}
                  transition={{ delay: sidebarItems.length * 0.03 }}
                  className="pt-2 mt-2 border-t border-gray-200"
                >
                  <button
                    onClick={handleLogoutClick}
                    className="block py-3 text-sm w-full text-left text-gray-500 transition-colors duration-150"
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

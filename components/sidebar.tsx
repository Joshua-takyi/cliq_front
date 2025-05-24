"use client";
import SignOutDialog from "@/components/SignOutDialog"; // Import the local SignOutDialog component
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SideBar() {
  const pathName = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sidebarItems = [
    { id: 1, name: "Orders", href: "/profile/order" },
    { id: 2, name: "Add & update user info", href: "/profile/address" },
    { id: 3, name: "Personal information", href: "/profile/personal-info" },
    { id: 4, name: "Wishlist", href: "/profile/wishlist" },
    { id: 5, name: "Product Review", href: "/profile/product-review" },
  ];

  const isActive = (href: string) => href === pathName;

  const handleLogoutClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <aside className="w-1/5 h-auto px-2 hidden lg:block">
      <ul className="space-y-1 flex flex-col border-r border-black/20 py-6">
        {sidebarItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`block px-4 py-3 text-base font-medium tracking-wide cursor-pointer ${
                isActive(item.href)
                  ? "text-[#9BEC00] border-[#9BEC00] bg-gray-100"
                  : "text-gray-700 border-transparent hover:bg-gray-50 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogoutClick}
            className={`block px-4 py-3 text-base font-medium tracking-wide w-full text-left ${
              isActive("/profile/logout")
                ? "text-[#9BEC00] border-[#9BEC00] bg-gray-100"
                : "text-gray-700 border-transparent hover:bg-gray-50 hover:text-black"
            }`}
          >
            Logout
          </button>
        </li>
      </ul>
      {isDialogOpen && <SignOutDialog onCancel={handleDialogClose} />}
    </aside>
  );
}

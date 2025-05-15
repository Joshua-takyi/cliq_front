"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search } from "./search";
import Wishlist from "./wishlist";
import Cart from "./cart";

export const Nav = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "admin";

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
      href: "/collections/phone-cases",
    },
  ];

  return (
    <div className="  border-[1px] border-black/40">
      <div className="flex items-center justify-between p-4">
        <nav>
          <ul className="flex space-x-4">
            {components.map((component) => (
              <li key={component.id} className="p-2">
                <Link href={component.href} className="p-2">
                  {component.name}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li key="admin" className="p-2">
                <Link href="/admin/adminPanel" className="p-2">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <Link href="/" className="p-2">
          <header>
            <h1 className="text-3xl font-extrabold uppercase">cliq</h1>
          </header>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <Link href="/profile" className="p-2">
              Profile
            </Link>
          ) : (
            <Link href="/login" className="p-2">
              Login
            </Link>
          )}
          <Search />
          <div className="h-6 border-l border-black/30 mx-2" />
          <Wishlist />
          <Cart />
        </div>
      </div>
    </div>
  );
};

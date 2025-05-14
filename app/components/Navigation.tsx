"use client";

import Link from "next/link";
import AuthStatus from "./AuthStatus";
import RoleBasedAccess from "./RoleBasedAccess";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold">
            Shop
          </Link>
        </div>
        <div className="flex lg:gap-x-12">
          <Link
            href="/products"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            About
          </Link>
          {session && (
            <Link
              href="/profile"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Profile
            </Link>
          )}
          <RoleBasedAccess allowedRoles={["admin"]}>
            <Link
              href="/admin"
              className="text-sm font-semibold leading-6 text-green-600"
            >
              Admin Panel
            </Link>
          </RoleBasedAccess>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          <AuthStatus />
        </div>
      </nav>
    </header>
  );
}

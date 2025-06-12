"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    // { name: "Admin Panel", href: "/admin/adminPanel" },
  ];

  const router = useRouter();
  const session = useSession();

  // Check if the session is loading
  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect if the user is not authenticated or not an admin
  if (
    session.status === "unauthenticated" ||
    session.data?.user.role !== "admin"
  ) {
    router.push("/"); // Redirect to home if not admin
    return null; // Prevent rendering the rest of the component
  }

  const isActive = (href: string) => href === pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-2">
        <div className="max-w-[90rem] mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 font-medium text-sm"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[90rem] mx-auto lg:px-4 px-2 py-6 sm:px-6 ">
        {children}
      </main>
    </div>
  );
}

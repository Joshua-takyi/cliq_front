"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function ShopBreadcrumb() {
  const pathname = usePathname();

  const steps = [
    { label: "Shopping cart", path: "/cart" },
    { label: "Checkout", path: "/checkout" },
    { label: "Order complete", path: "/payment-complete" },
  ];

  const activeStepIndex = steps.findIndex((step) =>
    pathname.includes(step.path)
  );

  return (
    <div className="flex items-center text-xs md:text-sm text-gray-500 mb-6">
      {steps.map((step, index) => {
        const isActive = index === activeStepIndex;
        const isCompleted = index < activeStepIndex;
        const isUpcoming = index > activeStepIndex;

        const stepClasses = isActive
          ? "font-medium text-black"
          : isCompleted
          ? "text-gray-700 hover:underline"
          : "text-gray-400";

        return (
          <div key={step.path} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">→</span>}

            {isUpcoming ? (
              <span className={stepClasses}>{step.label}</span>
            ) : (
              <Link
                href={step.path}
                className={`${stepClasses} ${
                  isActive ? "" : "hover:underline"
                }`}
              >
                {step.label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SimpleShopBreadcrumb() {
  const pathname = usePathname();

  return (
    <div className="flex items-center text-xs md:text-sm text-gray-500 mb-6">
      <Link
        href="/cart"
        className={`${
          pathname.includes("/cart") && !pathname.includes("/checkout")
            ? "font-medium text-black"
            : "text-gray-700 hover:underline"
        }`}
      >
        Shopping cart
      </Link>
      <span className="mx-2 text-gray-400">→</span>
      <Link
        href="/checkout"
        className={`${
          pathname.includes("/checkout")
            ? "font-medium text-black"
            : pathname.includes("/payment-complete")
            ? "text-gray-700 hover:underline"
            : "text-gray-400"
        }`}
      >
        Checkout
      </Link>
      <span className="mx-2 text-gray-400">→</span>
      <span
        className={
          pathname.includes("/payment-complete")
            ? "font-medium text-black"
            : "text-gray-400"
        }
      >
        Order complete
      </span>
    </div>
  );
}

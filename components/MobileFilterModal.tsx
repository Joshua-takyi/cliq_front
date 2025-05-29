"use client";

import { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ProductFilter from "./ProductFilter";

/**
 * Mobile Filter Modal Component
 *
 * This component provides a mobile-friendly way to access product filters.
 * On mobile devices, filters are hidden by default and shown in a modal overlay
 * when the filter button is pressed. This saves screen space and provides
 * a better mobile user experience.
 */
export default function MobileFilterModal() {
  // State to control whether the mobile filter modal is open or closed
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Toggle Button - Only visible on mobile devices */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Filters & Sort
          </span>
        </button>
      </div>

      {/* Mobile Filter Modal Overlay */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Background overlay with blur effect */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Modal Content */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
              <h2 className="text-lg font-semibold text-gray-900">
                Filter Products
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Filter Component */}
            <div className="p-4">
              <ProductFilter />
            </div>

            {/* Apply Filters Button - Mobile specific */}
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

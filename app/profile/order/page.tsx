"use client";
import Loader from "@/app/loading";
import { useOrder } from "@/hooks/useOrder";
import { useEffect, useState } from "react";
import OrderCard, { OrderCardProps } from "../component/order_card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Order() {
  // Enhanced pagination configuration - controls both orders per page and items per order
  const itemsPerPage = 2; // Number of orders to show per page
  const maxItemsPerOrder = 1; // Show only 1 item for multi-item orders to keep UI clean and consistent
  // Note: This setting ensures that:
  // - Single-item orders show the 1 item
  // - Multi-item orders show only 1 item with "View all items" link
  // - UI remains clean and pagination-friendly
  const [currentPage, setCurrentPage] = useState(1); // Current page number starting from 1

  const { getOrder } = useOrder();
  const { data, isLoading, error, refetch } = getOrder;

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Orders</h2>
        <p className="text-red-500">
          There was an error loading your orders. Please try again later.
        </p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          When you make your first purchase, your order history will appear
          here.
        </p>
      </div>
    );
  }

  // Enhanced pagination calculations with detailed logic and error handling
  const totalOrders = data.length; // Total number of orders available in the dataset
  const totalPages = Math.ceil(totalOrders / itemsPerPage); // Calculate total pages needed for pagination
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate starting index for current page slice
  const endIndex = Math.min(startIndex + itemsPerPage, totalOrders); // Calculate ending index with bounds checking
  const paginatedOrders = data.slice(startIndex, endIndex); // Extract orders for current page

  // Enhanced pagination state management with bounds checking
  const hasNextPage = currentPage < totalPages; // Check if next page is available
  const hasPreviousPage = currentPage > 1; // Check if previous page is available

  // Enhanced navigation handlers with smooth scrolling and user feedback
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
      // Scroll to top for better user experience when navigating pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
      // Scroll to top for better user experience when navigating pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Direct page navigation handler for enhanced UX
  const handlePageClick = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination display with smart truncation
  const getVisiblePageNumbers = () => {
    const maxVisiblePages = 5; // Maximum number of page buttons to display
    const pages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total count is manageable
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with truncation for large page counts
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced header section with pagination info and item display configuration */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Orders</h1>
          <p className="text-gray-600 text-sm">
            Showing {startIndex + 1}-{endIndex} of {totalOrders} orders
            <span className="text-gray-500 ml-2">
              • Multi-item orders show 1 item preview
            </span>
          </p>
        </div>

        {/* Quick stats for user context with item display info */}
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Orders grid with improved spacing - each order shows limited items based on maxItemsPerOrder */}
      <div className="flex flex-col gap-6 mb-8">
        {paginatedOrders.map((order: OrderCardProps, index: number) => (
          <div key={`${order._id}-${startIndex + index}`} className="space-y-4">
            {/* Order separator with enhanced info for context when showing limited items */}
            {order.items && order.items.length > 1 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">
                    Order #{order.orderId || order._id.slice(-8)} -{" "}
                    {order.items.length} items
                    <span className="text-gray-500 ml-1">
                      (showing first item)
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Total: ₵{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {/* Pass maxItemsToShow prop to control item-level pagination */}
            <OrderCard {...order} maxItemsToShow={maxItemsPerOrder} />
          </div>
        ))}
      </div>

      {/* Enhanced pagination controls - only show if multiple pages exist */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200">
          {/* Pagination information display */}
          {/* <div className="text-sm text-gray-600 order-2 sm:order-1">
            {totalOrders} total orders • {itemsPerPage} per page
          </div> */}

          {/* Enhanced pagination button group */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            {/* Previous page button with enhanced styling */}
            <Button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 px-3 py-2 ${
                !hasPreviousPage
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page number buttons for direct navigation */}
            <div className="flex items-center gap-1">
              {getVisiblePageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className={`px-3 py-2 min-w-[40px] ${
                    pageNum === currentPage
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            {/* Next page button with enhanced styling */}
            <Button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 px-3 py-2 ${
                !hasNextPage
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Helpful message when no orders on current page (edge case handling) */}
      {paginatedOrders.length === 0 && totalOrders > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found on this page.</p>
          <Button
            onClick={() => setCurrentPage(1)}
            variant="outline"
            className="mt-2"
          >
            Return to First Page
          </Button>
        </div>
      )}
    </div>
  );
}

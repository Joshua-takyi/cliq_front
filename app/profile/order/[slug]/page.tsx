"use client";

import { use, useState } from "react";
import { useOrderById } from "@/hooks/useOrder";
import { ArrowLeft, Calendar, Package, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddReview from "@/app/profile/component/review";
import { Button } from "@/components/ui/button";

/**
 * Interface defining the props structure for the OrderPage component
 */
interface OrderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function OrderPage({ params }: OrderPageProps) {
  // Unwrap the params Promise using React.use() - required for Next.js latest versions
  const resolvedParams = use(params);
  const { slug: orderId } = resolvedParams;

  // State for managing which item's review form is currently shown
  const [showReviewForItem, setShowReviewForItem] = useState<string | null>(
    null,
  );

  const toggleReviewForm = (itemId: string) => {
    setShowReviewForItem(showReviewForItem === itemId ? null : itemId);
  };

  const { data: orderResponse, isLoading, error } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-4 border-b border-gray-100"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error states with user-friendly error messages
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error.message ||
                "We couldn't find the order you're looking for. Please check the order ID and try again."}
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where order data is not available
  if (!orderResponse?.data) {
    notFound();
  }

  const order = orderResponse.data;

  // Calculate total order amount from all items with proper typing and data structure
  const totalAmount = order.items.reduce(
    (total: number, item: any) =>
      total + parseFloat(item.price) * parseInt(item.quantity),
    0,
  );

  // Format date for better readability
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header section with navigation and order info */}
        <div className="flex items-center justify-between mb-8">
          {/* Order status badge */}
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              order.status === "delivered"
                ? "bg-green-100 text-green-800"
                : order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </div>
        </div>

        {/* Main order information card */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Order meta information */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Ordered on {orderDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>₵{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order items list */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Items
            </h2>
            <div className="space-y-0">
              {order.items.map((item: any, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <div className="group relative flex justify-between items-start py-6 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 rounded-lg -mx-2 px-2">
                    {/* Product image section */}
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title || "Product image"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      {/* Item variants and attributes */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        {item.color && (
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span>Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.color }}
                              title={item.color}
                            />
                          </div>
                        )}
                        {item.size && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            Size: {item.size}
                          </span>
                        )}
                      </div>

                      {/* Quantity and unit price */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span>₵{parseFloat(item.price).toFixed(2)} each</span>
                      </div>
                    </div>

                    {/* Item total price and review button */}
                    <div className="text-right ml-6 flex flex-col items-end gap-3">
                      <div className="text-lg font-semibold text-gray-900">
                        ₵
                        {(
                          parseFloat(item.price) * parseInt(item.quantity)
                        ).toFixed(2)}
                      </div>

                      {/* Review button - shows on hover or when review form is open */}
                      <Button
                        onClick={() => toggleReviewForm(item.id)}
                        className={`${
                          showReviewForItem === item.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        } transition-opacity duration-200 flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium`}
                      >
                        <Star className="w-4 h-4" />
                        {showReviewForItem === item.id
                          ? "Hide Review"
                          : "Add Review"}
                      </Button>
                    </div>
                  </div>

                  {/* Review form - shows when button is clicked */}
                  {showReviewForItem === item.id && (
                    <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                      <div className="max-w-2xl pt-4">
                        <AddReview id={item.id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order total section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ₵{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional actions */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/profile"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import AddReview from "@/app/profile/component/review";
import { Button } from "@/components/ui/button";
import { useOrderById } from "@/hooks/useOrder";
import { ArrowLeft, Calendar, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

interface OrderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function OrderPage({ params }: OrderPageProps) {
  const resolvedParams = use(params);
  const { slug: orderId } = resolvedParams;
  const [showReviewForItem, setShowReviewForItem] = useState<string | null>(
    null
  );

  const toggleReviewForm = (itemId: string) => {
    setShowReviewForItem(showReviewForItem === itemId ? null : itemId);
  };

  const { data: orderResponse, isLoading, error } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="bg-white rounded-md border p-4">
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3 py-3 border-b border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-md border p-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-lg font-medium text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              {error?.message ||
                "We couldn't find the order. Please check the order ID."}
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = orderResponse.data;
  const totalAmount = order.items.reduce(
    (total: number, item: any) =>
      total + parseFloat(item.price) * parseInt(item.quantity),
    0
  );
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/profile"
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span
            className={`px-2 py-1 text-xs font-medium rounded capitalize ${
              order.status === "delivered"
                ? "bg-green-50 text-green-600"
                : order.status === "shipped"
                ? "bg-blue-50 text-blue-600"
                : order.status === "processing"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-md border overflow-hidden">
          {/* Meta Info */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{orderDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="p-4 space-y-3">
            {order.items.map((item: any, index: number) => (
              <div
                key={`${item.id}-${index}`}
                className="flex gap-3 py-2 hover:bg-gray-50 rounded-md -mx-2 px-2 transition-colors"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-12 h-12">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Product"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded border border-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 rounded border border-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                    {item.color && (
                      <div className="flex items-center gap-1">
                        <span>Color:</span>
                        <span
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      </div>
                    )}
                    {item.size && <span>Size: {item.size}</span>}
                    <span>Qty: {item.quantity}</span>
                    <span>₵{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Price and Review */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ₵
                    {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(
                      2
                    )}
                  </p>
                  <Button
                    onClick={() => toggleReviewForm(item.id)}
                    className={`mt-1 text-xs bg-transparent hover:bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 ${
                      showReviewForItem === item.id ? "bg-blue-50" : ""
                    }`}
                    variant="ghost"
                  >
                    {showReviewForItem === item.id ? "Hide" : "Review"}
                  </Button>
                </div>

                {/* Review Form */}
                {showReviewForItem === item.id && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                    <AddReview id={item.id} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">
              ₵{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

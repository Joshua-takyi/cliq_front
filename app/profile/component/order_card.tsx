/**
 * OrderCard Component - Smart Item Display for Clean Pagination
 *
 * This component intelligently manages item display based on order size:
 *
 * 1. Single-item orders: Shows the complete item
 * 2. Multi-item orders: Shows only 1 item with "View all items" link
 * 3. Clean pagination: Prevents UI overflow and maintains consistent layout
 * 4. User-friendly navigation: Clear path to view complete orders
 *
 * Key Features:
 * - Smart display logic: Adapts based on item count
 * - "More items" indicator: Shows remaining item count
 * - Direct navigation: Link to complete order view
 * - Responsive design: Works on all screen sizes
 *
 * Usage:
 * <OrderCard {...orderData} maxItemsToShow={1} />
 *
 * Display Strategy:
 * - 1 item order: Shows 1 item (complete)
 * - 2+ item orders: Shows 1 item + "View all items" link
 * - This ensures consistent UI height and clean pagination
 */

import ResponsiveLazyImage from "@/components/lazyImage";
import Link from "next/link";

export interface OrderItem {
  id?: string; // Optional ID field to match server response
  slug: string;
  quantity: number | string; // Can be string from server, will convert to number
  price: number | string; // Can be string from server, will convert to number
  image: string;
  color: string;
  title: string;
}

export interface OrderCardProps {
  _id: string;
  status: string;
  orderId?: string;
  createdAt?: string;
  amount: number;
  // Items is always an array based on the server response structure
  items: OrderItem[];
  // Maximum number of items to display - controls pagination at item level
  maxItemsToShow?: number;
}

// Individual Item Card Component - displays a single item from an order as its own card
const ItemCard = ({
  item,
  orderInfo,
}: {
  item: OrderItem;
  orderInfo: {
    _id: string;
    orderId?: string;
    status: string;
    createdAt?: string;
  };
}) => {
  // Enhanced price conversion helper with detailed validation and error handling
  const formatPrice = (price: number | string): number => {
    if (typeof price === "string") {
      const numericPrice = parseFloat(price);
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return price || 0;
  };

  // Enhanced quantity conversion with type safety and validation
  const itemQuantity =
    typeof item.quantity === "string"
      ? parseInt(item.quantity, 10) || 0
      : item.quantity || 0;

  // Calculate the formatted price for display with proper error handling
  const itemPrice = formatPrice(item.price);

  // Enhanced status styling with comprehensive status coverage for individual items
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
      case "processing":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "cancelled":
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "confirmed":
      case "paid":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shipped":
      case "in_transit":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Enhanced date formatting with comprehensive error handling
  const formattedDate = orderInfo.createdAt
    ? new Date(orderInfo.createdAt).toLocaleDateString("en-GH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date unavailable";

  return (
    <Link href={`/profile/orders/${item.slug}`} className="block">
      {/* Individual Item Card - compact and focused on a single item */}
      <div className="block no-underline border border-gray-200 rounded-lg p-4 lg:p-5 ">
        {/* Item Header with Order Info - Compact but informative */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">
              Order #{orderInfo.orderId || orderInfo._id.slice(-8)} •{" "}
              {formattedDate}
            </p>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(
                orderInfo.status
              )}`}
            >
              {orderInfo.status.charAt(0).toUpperCase() +
                orderInfo.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Main Item Content - Product image and details in a prominent layout */}
        <div className="flex gap-3 sm:gap-4">
          {/* Product Image - Larger and more prominent for individual display */}
          <div className="flex-shrink-0">
            <ResponsiveLazyImage
              src={item.image}
              alt={item.title || item.slug}
              width={80}
              height={80}
              sizes="(max-width: 640px) 80px, (max-width: 768px) 90px, 100px"
              className="rounded-lg object-cover w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] border border-gray-100"
            />
          </div>

          {/* Product Details - Enhanced layout for individual item display */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1 min-w-0">
                {/* Product Title - More prominent in individual card */}
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight mb-2">
                  {item.title}
                </h3>

                {/* Product Attributes - Color and quantity with better spacing */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Color:</span>
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 inline-block shadow-sm"
                      style={{ backgroundColor: item.color }}
                      title={item.color}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {itemQuantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Information - More prominent display for individual items */}
              <div className="text-left sm:text-right sm:ml-4 mt-2 sm:mt-0">
                <p className="font-bold text-gray-900 text-lg sm:text-xl">
                  ₵{itemPrice.toLocaleString()}
                </p>
                {itemQuantity > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ₵{(itemPrice / itemQuantity).toLocaleString()} per item
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Item Footer - Additional context and actions */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              From Order #{orderInfo.orderId || orderInfo._id.slice(-8)}
            </span>
            <span className="text-blue-600 hover:text-blue-700 font-medium">
              View Order Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main OrderCard Component - shows only 1 item for multi-item orders, all items for single-item orders
const OrderCard = ({
  _id,
  status,
  orderId,
  createdAt,
  items,
  maxItemsToShow = 1, // Default to showing 1 item for multi-item orders to keep UI clean
}: Omit<OrderCardProps, "amount">) => {
  // Enhanced guard against missing or empty items with detailed error context
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.warn(`OrderCard: Invalid or empty items array for order ${_id}`, {
      orderId: orderId || _id.slice(-8),
      receivedItems: items,
      itemsType: typeof items,
      isArray: Array.isArray(items),
    });
    return null;
  }

  // Smart item display logic: show 1 item for multi-item orders, all items for single-item orders
  const totalItemsCount = items.length;
  const shouldLimitItems = totalItemsCount > 1; // Only limit display when there are multiple items
  const itemsToDisplay = shouldLimitItems
    ? items.slice(0, maxItemsToShow)
    : items;
  const remainingItemsCount = shouldLimitItems
    ? Math.max(0, totalItemsCount - maxItemsToShow)
    : 0;
  const hasMoreItems = remainingItemsCount > 0;

  // Prepare order information object for each item card
  const orderInfo = {
    _id,
    orderId,
    status,
    createdAt,
  };

  // Render strategy:
  // - Single item orders: Show the item without "more items" indicator
  // - Multi-item orders: Show first item + "View all items" link for remaining items

  // Render individual item cards with pagination control - only show specified number of items
  return (
    <div className="space-y-3">
      {/* Display limited number of item cards based on maxItemsToShow prop */}
      {itemsToDisplay.map((item, index) => (
        <ItemCard
          key={`${_id}-item-${index}-${item.slug || item.id || index}`}
          item={item}
          orderInfo={orderInfo}
        />
      ))}

      {/* Enhanced "More Items" indicator - shows when there are additional items not displayed */}
      {hasMoreItems && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                +{remainingItemsCount} more{" "}
                {remainingItemsCount === 1 ? "item" : "items"} in this order
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {totalItemsCount} total
              </span>
            </div>
            <Link
              href={`/profile/order/${orderId || _id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline transition-colors"
            >
              View all items
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

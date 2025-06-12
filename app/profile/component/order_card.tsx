import ResponsiveLazyImage from "@/components/lazyImage";
import Link from "next/link";

export interface OrderItem {
  id?: string;
  slug: string;
  quantity: number | string;
  price: number | string;
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
  items: OrderItem[];
  maxItemsToShow?: number;
}

// Helper function to safely convert price to number
const formatPrice = (price: number | string): number => {
  return typeof price === "string" ? parseFloat(price) || 0 : price || 0;
};

// Helper function for status styling
const getStatusStyle = (status: string): string => {
  const statusMap: Record<string, string> = {
    delivered: "text-green-500 bg-green-50",
    completed: "text-green-500 bg-green-50",
    pending: "text-yellow-500 bg-yellow-50",
    processing: "text-yellow-500 bg-yellow-50",
    cancelled: "text-red-500 bg-red-50",
    failed: "text-red-500 bg-red-50",
    confirmed: "text-blue-500 bg-blue-50",
    paid: "text-blue-500 bg-blue-50",
    shipped: "text-purple-500 bg-purple-50",
    in_transit: "text-purple-500 bg-purple-50",
  };
  return statusMap[status.toLowerCase()] || "text-gray-500 bg-gray-50";
};

// Individual Item Card Component
const ItemCard = ({
  item,
  orderInfo,
  totalItemsCount,
}: // orderTotal,
{
  item: OrderItem;
  orderInfo: {
    _id: string;
    orderId?: string;
    status: string;
    createdAt?: string;
  };
  totalItemsCount: number;
  orderTotal: number;
}) => {
  const itemQuantity =
    typeof item.quantity === "string"
      ? parseInt(item.quantity, 10) || 0
      : item.quantity || 0;
  const itemPrice = formatPrice(item.price);
  const formattedDate = orderInfo.createdAt
    ? new Date(orderInfo.createdAt).toLocaleDateString("en-GH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <Link href={`/profile/order/${orderInfo.orderId || orderInfo._id}`}>
      <div className="flex gap-2 p-2 bg-white border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
        {/* Image */}
        <ResponsiveLazyImage
          src={item.image}
          alt={item.title || item.slug}
          width={40}
          height={40}
          sizes="(max-width: 640px) 40px, 48px"
          className="rounded w-10 h-10 object-cover"
        />

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-0.5">
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-500 truncate">
                #{orderInfo.orderId || orderInfo._id.slice(-6)} •{" "}
                {formattedDate}
              </p>
              <span
                className={`inline-block px-1 py-0.5 text-[10px] font-medium rounded-md ${getStatusStyle(
                  orderInfo.status
                )}`}
              >
                {orderInfo.status.charAt(0).toUpperCase() +
                  orderInfo.status.slice(1)}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 text-right">
              <span>
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Details */}
          <h3 className="text-xs font-medium text-gray-900 line-clamp-1">
            {item.title}
          </h3>
          <div className="flex gap-2 text-[10px] text-gray-600">
            <span>Qty: {itemQuantity}</span>
            <div className="flex items-center gap-0.5">
              <span>Color:</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-gray-200"
                style={{ backgroundColor: item.color }}
                title={item.color}
              />
            </div>
          </div>

          {/* Price and Total */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">Item Total</span>
            <div className="text-right space-y-0.5">
              <p className="text-xs font-semibold text-gray-900">
                ₵{itemPrice.toLocaleString()}
              </p>
              {itemQuantity > 1 && (
                <p className="text-[9px] text-gray-500">
                  ₵{(itemPrice / itemQuantity).toLocaleString()} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main OrderCard Component
const OrderCard = ({
  _id,
  status,
  orderId,
  createdAt,
  items,
  amount,
  maxItemsToShow = 1,
}: OrderCardProps) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.warn(
      `OrderCard: Invalid items for order ${orderId || _id.slice(-6)}`
    );
    return null;
  }

  const totalItemsCount = items.reduce(
    (sum, item) =>
      sum +
      (typeof item.quantity === "string"
        ? parseInt(item.quantity, 10) || 0
        : item.quantity || 0),
    0
  );
  const itemsToDisplay = items.slice(0, maxItemsToShow);
  const orderInfo = { _id, orderId, status, createdAt };

  return (
    <div className="space-y-1.5">
      {itemsToDisplay.map((item, index) => (
        <ItemCard
          key={`${_id}-${item.slug || item.id || index}`}
          item={item}
          orderInfo={orderInfo}
          totalItemsCount={totalItemsCount}
          orderTotal={amount}
        />
      ))}
      {items.length > maxItemsToShow && (
        <Link href={`/profile/order/${orderId || _id}`}>
          <div className="flex justify-between items-center p-1.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-600 hover:bg-gray-100 transition-colors">
            <span>View order details ({items.length} total items)</span>
            <span className="text-blue-500 font-medium flex items-center gap-0.5">
              ₵{amount.toLocaleString()}
              <svg
                className="w-2.5 h-2.5"
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
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default OrderCard;

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetOrdersByAdmin } from "@/hooks/adminOrder";
import { useSearchParams } from "next/navigation";
import Loader from "@/app/loading";
import { formatCurrency } from "@/libs/email/templates/processingOrder";
import { UpdateStatus } from "@/components/updateStatus";
import {
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

// Enhanced delivery status mapping with additional visual indicators
const deliveryStatusConfig = {
  pending: {
    color: "#FFA726",
    icon: Clock,
    label: "Pending",
    bgColor: "#FFF3E0",
  },
  processing: {
    color: "#FF9800",
    icon: Package,
    label: "Processing",
    bgColor: "#FFF3E0",
  },
  shipped: {
    color: "#42A5F5",
    icon: Truck,
    label: "Shipped",
    bgColor: "#E3F2FD",
  },
  delivered: {
    color: "#66BB6A",
    icon: CheckCircle,
    label: "Delivered",
    bgColor: "#E8F5E8",
  },
  cancelled: {
    color: "#EF5350",
    icon: XCircle,
    label: "Cancelled",
    bgColor: "#FFEBEE",
  },
};

// Payfmment status configuration for consistent styling
const paymentStatusConfig = {
  completed: {
    color: "#66BB6A",
    bgColor: "#E8F5E8",
    label: "Completed",
  },
  pending: {
    color: "#FFA726",
    bgColor: "#FFF3E0",
    label: "Pending",
  },
  failed: {
    color: "#EF5350",
    bgColor: "#FFEBEE",
    label: "Failed",
  },
};

// Updated interfaces to match the actual API response structure
interface OrderItem {
  id: string;
  image?: string;
  slug?: string;
  title: string;
  quantity: number;
  price: number;
  color: string;
}

// Enhanced order interface to handle the actual response format
interface EnhancedOrder {
  _id: string;
  userId: string;
  email: string;
  deliveryStatus: keyof typeof deliveryStatusConfig;
  amount: number;
  items: OrderItem[];
  payment: {
    method: string;
    status: keyof typeof paymentStatusConfig;
  };
  createdAt: string;
}

// Simplified OrderDetailsDialog component with ultra-minimalistic design for production
const OrderDetailsDialog = ({ order }: { order: EnhancedOrder }) => {
  // Calculate total quantity of items in the order for display purposes
  const totalQuantity = order.items.reduce(
    (sum: number, item: OrderItem) => sum + item.quantity,
    0,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-50"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Simplified header with minimal padding */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <DialogTitle className="text-base font-medium text-gray-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </DialogTitle>
        </div>

        <div className="p-4 space-y-4">
          {/* Compact order information in a clean grid layout */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 uppercase tracking-wide">
                Customer
              </span>
              <p className="font-medium text-gray-900 truncate">
                {order.email}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 uppercase tracking-wide">
                Date
              </span>
              <p className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 uppercase tracking-wide">
                Payment
              </span>
              <p className="font-medium text-gray-900 capitalize">
                {order.payment.method.replace("_", " ")}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 uppercase tracking-wide">
                Total
              </span>
              <p className="font-semibold text-gray-900">
                {formatCurrency(order.amount, "GHS")}
              </p>
            </div>
          </div>

          {/* Ultra-simplified items list with minimal visual elements */}
          <div className="pt-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Items ({totalQuantity})
            </h4>
            <div className="space-y-2">
              {order.items.map((item: OrderItem, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                >
                  {/* Smaller product image for minimal footprint */}
                  {item.image && (
                    <div className="relative h-8 w-8 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                        sizes="32px"
                      />
                    </div>
                  )}

                  {/* Condensed product information */}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 truncate leading-tight">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                      <span>×{item.quantity}</span>
                      <span>{formatCurrency(item.price, "GHS")}</span>
                      {/* Minimal color indicator if available */}
                      {item.color && (
                        <div
                          className="w-2 h-2 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                          title={`Color: ${item.color}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Item total aligned to the right */}
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity, "GHS")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function OrderComponent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading } = GetOrdersByAdmin(page, limit);

  if (isLoading) return <Loader />;

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No orders found
        </h3>
        <p className="text-muted-foreground max-w-md">
          There are currently no orders to display. Orders will appear here as
          customers place them.
        </p>
      </div>
    );
  }

  // Transform the order data to handle the array structure properly
  const orderData = data.data.map((order: any) => ({
    ...order,
    items: Array.isArray(order.items) ? order.items : [order.items],
  })) as EnhancedOrder[];

  return (
    <div className="space-y-4">
      {/* Simplified header with minimal styling */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">
            {orderData.length} orders found
          </p>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span>Page {page}</span>
          <span>•</span>
          <span>{limit} per page</span>
        </div>
      </div>

      {/* Ultra-minimal orders table with plain styling */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-25 border-b">
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Order
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Customer
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
                Items
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">
                Amount
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData.map((order, index) => {
              // Calculate total quantity for display in items column
              // Get status configurations for styling the status indicators
              const deliveryConfig = (deliveryStatusConfig as any)[
                order.deliveryStatus
              ];
              const paymentConfig = (paymentStatusConfig as any)[
                order.payment.status
              ];

              return (
                <TableRow
                  key={`${order._id}-${index}`}
                  className="hover:bg-gray-25 transition-colors border-b border-gray-100"
                >
                  {/* Order ID - shortened for cleaner display */}
                  <TableCell className="px-3 py-2">
                    <span className="font-mono text-xs text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Customer email - truncated for mobile responsiveness */}
                  <TableCell className="px-3 py-2">
                    <span className="text-xs text-gray-900 truncate block max-w-32">
                      {order.email}
                    </span>
                  </TableCell>

                  {/* Items count - centered and minimal */}
                  <TableCell className="px-3 py-2 text-center">
                    <span className="text-xs text-gray-600">
                      {order.items.length}
                    </span>
                  </TableCell>

                  {/* Status indicators using small colored dots for minimal design */}
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          title={deliveryConfig?.label || order.deliveryStatus}
                        />
                        <span className="text-xs text-gray-600 hidden sm:inline">
                          {deliveryConfig?.label || order.deliveryStatus}
                        </span>
                      </div>

                      {/* Payment status indicator */}
                      <div className="flex items-center gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: paymentConfig?.color || "#9E9E9E",
                          }}
                          title={paymentConfig?.label || order.payment.status}
                        />
                      </div>
                    </div>

                    {/* Status update component for admin functionality */}
                    <div className="mt-1">
                      <UpdateStatus
                        _id={order._id}
                        deliveryStatus={order.deliveryStatus}
                      />
                    </div>
                  </TableCell>

                  {/* Order amount - right aligned for better readability */}
                  <TableCell className="px-3 py-2 text-right">
                    <span className="text-xs font-medium text-gray-900">
                      {formatCurrency(order.amount, "GHS")}
                    </span>
                  </TableCell>

                  {/* Order date - compact format for space efficiency */}
                  <TableCell className="px-3 py-2">
                    <span className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </TableCell>

                  {/* View details button - minimal and centered */}
                  <TableCell className="px-3 py-2 text-center">
                    <OrderDetailsDialog order={order} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Simplified footer with minimal pagination info */}
      <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
        <span>{orderData.length} orders displayed</span>
        <span>Page {page} of results</span>
      </div>
    </div>
  );
}

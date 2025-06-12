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
import { Eye, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

// Minimal status configurations
const deliveryStatusConfig = {
  pending: {
    color: "#f59e0b",
    icon: Clock,
    label: "Pending",
    bgColor: "#fef3c7",
  },
  processing: {
    color: "#3b82f6",
    icon: Package,
    label: "Processing",
    bgColor: "#dbeafe",
  },
  shipped: {
    color: "#8b5cf6",
    icon: Truck,
    label: "Shipped",
    bgColor: "#e9d5ff",
  },
  delivered: {
    color: "#10b981",
    icon: CheckCircle,
    label: "Delivered",
    bgColor: "#d1fae5",
  },
  cancelled: {
    color: "#ef4444",
    icon: XCircle,
    label: "Cancelled",
    bgColor: "#fee2e2",
  },
};

const paymentStatusConfig = {
  completed: { color: "#10b981", bgColor: "#d1fae5", label: "Paid" },
  pending: { color: "#f59e0b", bgColor: "#fef3c7", label: "Pending" },
  failed: { color: "#ef4444", bgColor: "#fee2e2", label: "Failed" },
};

// Interfaces for type safety
interface OrderItem {
  id: string;
  image?: string;
  title: string;
  quantity: number;
  price: number;
  color?: string;
}

interface EnhancedOrder {
  _id: string;
  userId: string;
  email: string;
  deliveryStatus: keyof typeof deliveryStatusConfig;
  amount: number;
  items: OrderItem[];
  payment: { method: string; status: keyof typeof paymentStatusConfig };
  createdAt: string;
}

// Simplified Order Details Dialog
const OrderDetailsDialog = ({ order }: { order: EnhancedOrder }) => {
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const deliveryConfig = deliveryStatusConfig[order.deliveryStatus];
  // const paymentConfig = paymentStatusConfig[order.payment.status];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-base font-semibold text-gray-900">
                Order #{order._id.slice(-6).toUpperCase()}
              </DialogTitle>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: deliveryConfig.bgColor,
                color: deliveryConfig.color,
              }}
            >
              <deliveryConfig.icon className="h-3 w-3" />
              {deliveryConfig.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-medium text-gray-500">Customer</label>
              <p className="text-gray-900">{order.email}</p>
            </div>
            <div>
              <label className="font-medium text-gray-500">Payment</label>
              <p className="text-gray-900 capitalize">
                {order.payment.method.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-gray-900">
              <span>Items ({totalQuantity})</span>
              <span>{formatCurrency(order.amount, "GHS")}</span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} • {formatCurrency(item.price, "GHS")}
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-gray-600">No orders found</p>
      </div>
    );
  }

  const orderData = data.data.map((order: any) => ({
    ...order,
    items: Array.isArray(order.items) ? order.items : [order.items],
  })) as EnhancedOrder[];

  return (
    <div className=" sm:p-6 max-w-full overflow-x-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
        <p className="text-xs text-gray-500">{orderData.length} orders</p>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600">
                Order
              </TableHead>
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600 hidden sm:table-cell">
                Customer
              </TableHead>
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600 text-center">
                Items
              </TableHead>
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600">
                Status
              </TableHead>
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600 text-right">
                Amount
              </TableHead>
              <TableHead className="px-2 py-2 text-xs font-medium text-gray-600 text-center hidden md:table-cell">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData.map((order, index) => {
              const deliveryConfig = deliveryStatusConfig[order.deliveryStatus];
              // const paymentConfig = paymentStatusConfig[order.payment.status];

              return (
                <TableRow key={`${order._id}-${index}`} className="border-b">
                  <TableCell className="px-2 py-2">
                    <span className="text-xs font-mono text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-500 sm:hidden">
                      {order.email}
                    </p>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs text-gray-900 hidden sm:table-cell truncate max-w-24">
                    {order.email}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center text-xs text-gray-600">
                    {order.items.length}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: deliveryConfig.bgColor,
                          color: deliveryConfig.color,
                        }}
                      >
                        <deliveryConfig.icon className="h-3 w-3" />
                        {deliveryConfig.label}
                      </span>
                      <UpdateStatus
                        _id={order._id}
                        deliveryStatus={order.deliveryStatus}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right text-xs font-medium text-gray-900">
                    {formatCurrency(order.amount, "GHS")}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center hidden md:table-cell">
                    <OrderDetailsDialog order={order} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

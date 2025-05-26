/**
 * Enum representing the different states of order delivery
 * Used to track the order's journey from processing to delivery completion
 */
export enum DeliveryStatus {
  PENDING = "pending", // Order received but not yet processed
  PROCESSING = "processing", // Order is being prepared for shipping
  SHIPPED = "shipped", // Order has been handed to delivery service
  IN_TRANSIT = "in_transit", // Order is on the way to the customer
  OUT_FOR_DELIVERY = "out_for_delivery", // Order is out for final delivery
  DELIVERED = "delivered", // Order has been delivered to customer
  RECEIVED = "received", // Customer has confirmed receipt
  FAILED = "failed", // Delivery attempt failed
  RETURNED = "returned", // Order was returned to sender
  CANCELLED = "cancelled", // Order was cancelled
}

/**
 * Interface representing an order in the system
 */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  shippingInfo: ShippingInfo;
  paymentStatus: "pending" | "paid" | "failed";
  deliveryStatus: DeliveryStatus;
}

/**
 * Interface representing an individual item in an order
 */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
  color?: string;
  size?: string;
}

/**
 * Interface for shipping information associated with an order
 */
export interface ShippingInfo {
  name: string;
  phone: string;
  email?: string;
  region: string;
  street: string;
  ghana_post?: string;
  city?: string;
  notes?: string;
}

/**
 * Interface for updating delivery status
 */
export interface DeliveryStatusUpdate {
  status: DeliveryStatus;
  notes?: string; // Optional notes about the status change
}

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  materials: string[];
  colors: string[];
  category: string[];
  stock: number;
  details?: string[];
  models?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  features?: string[];
  rating?: number;
  slug?: string;
  salesStartDate?: string;
  salesEndDate?: string;
  isAvailable?: boolean;
  discount?: number;
  comments?: string[];
  warranty?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API response type for consistent handling of server responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  product?: T;
  products?: T[];
  count?: number;
  duration?: string;
  error?: string;
}

export interface CartData {
  items: {
    id: string;
    color: string;
    slug: string;
    model: string;
    title: string;
    image: string;
    total_price: number;
    quantity: number;
    product_Id: string;
  }[];
  total_amount: number;
}

/**
 * Checkout form data for customer delivery information
 */
export interface CheckoutFormData {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  region: string;
  street?: string;
  ghana_post?: string;
  deliver_to?: string;
  city?: string;
}

/**
 * Checkout request parameters for initiating a payment
 */

/**
 * Checkout response from the payment gateway
 */

/**
 * Payment verification response from the payment gateway
 */
export interface PaymentVerificationResponse {
  status: string;
  message: string;
  reference?: string;
  amount?: number;
  date?: string;
  transaction_id?: string;
  customer?: {
    email?: string;
    name?: string;
  };
  order?: {
    items?: any[];
    total?: number;
    shipping_address?: string;
  };
}

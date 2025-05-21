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
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  email: string;
  region: string;
  streetAddress?: string;
  country: string;
  shipToAnotherAddress?: boolean;
  shippingAddress?: {
    firstName: string;
    lastName?: string;
    phoneNumber: string;
    region: string;
    streetAddress: string;
    country: string;
  };
  orderNotes?: string;
  couponCode?: string;
}

/**
 * Checkout request parameters for initiating a payment
 */
export interface CheckoutRequest {
  amount: number;
  email: string;
  callback_url?: string;
  deliveryDetails?: CheckoutFormData;
}

/**
 * Checkout response from the payment gateway
 */
export interface CheckoutResponse {
  status: string;
  message: string;
  reference: string;
  authorization_url: string;
  access_code?: string;
}

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

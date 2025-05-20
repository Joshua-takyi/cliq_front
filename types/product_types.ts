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

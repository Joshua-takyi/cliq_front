import mongoose, { Document, Models } from "mongoose";

interface OrderProps {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: "pending" | "shipped" | "delivered";
}

import OrderComponent from "./order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Order management page for admin panel",
  keywords: "admin, orders, management, ecommerce",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <OrderComponent />
    </div>
  );
}

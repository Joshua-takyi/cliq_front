import AdminDashboard from "./dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard  ,for ecommerce store",
  keywords: "admin, dashboard, ecommerce",
};
export default function AdminDashboardPage() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

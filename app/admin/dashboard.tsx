"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetOrdersByAdmin } from "@/hooks/adminOrder";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { formatCurrency } from "@/libs/email/templates/processingOrder";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import OrderComponent from "./orders/order";
import { ProductsList } from "./products/product";

const AdminDashboard = () => {
  const { data: productsData, isLoading: productsLoading } = useAdminProducts(
    1,
    10
  );
  const { data: ordersData, isLoading: ordersLoading } = GetOrdersByAdmin();

  const stats = React.useMemo(() => {
    if (!ordersData?.data || !productsData?.products) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        recentOrders: [],
        topProducts: [],
        revenueByStatus: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
      };
    }

    const totalRevenue = ordersData.data.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const uniqueCustomers = new Set(
      ordersData.data.map((order) => order.userId)
    ).size;
    const pendingOrders = ordersData.data.filter(
      (order) => order.deliveryStatus === "pending"
    ).length;
    const lowStockProducts = productsData.products.filter(
      (product) => (product.stock || 0) < 10
    ).length;
    const recentOrders = ordersData.data
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 4);
    const topProducts = productsData.products.slice(0, 4);

    const revenueByStatus = ordersData.data.reduce(
      (acc, order) => {
        acc[order.deliveryStatus] =
          (acc[order.deliveryStatus] || 0) + order.amount;
        return acc;
      },
      { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
    );

    return {
      totalRevenue,
      totalOrders: ordersData.data.length,
      totalProducts: productsData.count || productsData.products.length,
      totalCustomers: uniqueCustomers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
      revenueByStatus,
    };
  }, [ordersData, productsData]);

  if (productsLoading || ordersLoading) {
    return (
      <div className="p-6 sm:p-8">
        <Skeleton className="h-8 w-56 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-6 p-3 sm:p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Your store's performance at a glance
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders">
              <Button className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700">
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/products/create">
              <Button
                variant="outline"
                className="text-sm px-4 py-2 border-gray-300"
              >
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border rounded-lg bg-white">
            <CardHeader className="p-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue, "GHS")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Delivered:{" "}
                {formatCurrency(stats.revenueByStatus.delivered, "GHS")}
              </p>
            </CardContent>
          </Card>
          <Card className="border rounded-lg bg-white">
            <CardHeader className="p-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-gray-900">
                {stats.totalOrders.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Pending: {stats.pendingOrders}
              </p>
            </CardContent>
          </Card>
          <Card className="border rounded-lg bg-white">
            <CardHeader className="p-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-gray-900">
                {stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Low Stock: {stats.lowStockProducts}
              </p>
            </CardContent>
          </Card>
          <Card className="border rounded-lg bg-white">
            <CardHeader className="p-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-gray-900">
                {stats.totalCustomers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Accounts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-sm bg-white border rounded-lg">
            <TabsTrigger value="overview" className="text-sm py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-sm py-2">
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="text-sm py-2">
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border rounded-lg bg-white">
                <CardHeader className="p-4 flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Recent Orders
                  </CardTitle>
                  <Link href="/admin/orders">
                    <Button
                      variant="outline"
                      className="text-sm px-3 py-1 border-gray-300"
                    >
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-48">
                            {order.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className="text-xs"
                              variant={
                                order.deliveryStatus === "delivered"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {order.deliveryStatus}
                            </Badge>
                            <Badge
                              className="text-xs"
                              variant={
                                order.payment.status === "completed"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {order.payment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.amount, "GHS")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-600 text-sm">
                      <ShoppingCart className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p>No recent orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border rounded-lg bg-white">
                <CardHeader className="p-4 flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Top Products
                  </CardTitle>
                  <Link href="/admin/products">
                    <Button
                      variant="outline"
                      className="text-sm px-3 py-1 border-gray-300"
                    >
                      Manage All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {stats.topProducts.length > 0 ? (
                    stats.topProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.stock || "N/A"} •{" "}
                            {formatCurrency(product.price, "GHS")}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {product.isFeatured && (
                              <Badge variant="secondary" className="text-xs">
                                Featured
                              </Badge>
                            )}
                            {product.isOnSale && (
                              <Badge variant="destructive" className="text-xs">
                                On Sale
                              </Badge>
                            )}
                            {!product.isAvailable && (
                              <Badge variant="outline" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-600 text-sm">
                      <Package className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p>No products found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border rounded-lg bg-white">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {Object.entries(stats.revenueByStatus).map(
                    ([status, amount]) => (
                      <div key={status} className="p-3 rounded-lg bg-gray-50">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {status}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(amount, "GHS")}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border rounded-lg bg-white">
              <CardHeader className="p-4 flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Order Management
                </CardTitle>
                <Link href="/admin/orders">
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-1 border-gray-300"
                  >
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <OrderComponent />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="border rounded-lg bg-white">
              <CardHeader className="p-4 flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Product Management
                </CardTitle>
                <Link href="/admin/products">
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-1 border-gray-300"
                  >
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <ProductsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

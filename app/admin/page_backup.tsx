"use client";

imimport { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Plus
} from "lucide-react"; "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { GetOrdersByAdmin } from "@/hooks/adminOrder";
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

/**
 * AdminDashboard component - Main dashboard page for ecommerce admin panel
 * Provides comprehensive overview of store performance including sales, orders, products, and customers
 * Built with shadcn components for consistent, accessible UI
 */
const AdminDashboard = () => {
  // Fetch products and orders data using custom hooks
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useAdminProducts(1, 10);
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = GetOrdersByAdmin();

  /**
   * Calculate dashboard statistics from fetched data
   * Provides real-time metrics for business performance monitoring
   */
  const stats = React.useMemo(() => {
    if (!ordersData?.data || !productsData?.products) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        recentOrders: [],
        topProducts: [],
      };
    }

    // Calculate total revenue from all orders
    const totalRevenue = ordersData.data.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    // Get unique customers count from orders
    const uniqueCustomers = new Set(
      ordersData.data.map((order) => order.userId)
    ).size;

    // Get recent orders (last 5) sorted by creation date
    const recentOrders = ordersData.data
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // Get top products (first 5 from the products list - in real scenario, this would be sorted by sales)
    const topProducts = productsData.products.slice(0, 5);

    return {
      totalRevenue,
      totalOrders: ordersData.data.length,
      totalProducts: productsData.count || productsData.products.length,
      totalCustomers: uniqueCustomers,
      recentOrders,
      topProducts,
    };
  }, [ordersData, productsData]);

  /**
   * Render loading skeleton while data is being fetched
   * Maintains layout structure during loading state
   */
  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Handle error states with user-friendly error messages
   * Provides actionable feedback when data fetching fails
   */
  if (productsError || ordersError) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">
                Error Loading Dashboard
              </CardTitle>
              <CardDescription className="text-red-600">
                {productsError?.message ||
                  ordersError?.message ||
                  "Unable to load dashboard data. Please try again later."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry Loading Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section with welcome message and key actions */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/products">
                  <Package className="h-4 w-4" />
                  Manage Products
                </Link>
              </Button>
              <Button asChild className="gap-2">
                <Link href="/admin/products?action=new">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Key Performance Indicators Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +12.5% from last month
              </p>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          {/* Total Orders Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalOrders.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +8.2% from last month
              </p>
              <Progress value={60} className="mt-3 h-2" />
            </CardContent>
          </Card>

          {/* Total Products Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalProducts.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">+4 new this week</p>
              <Progress value={45} className="mt-3 h-2" />
            </CardContent>
          </Card>

          {/* Total Customers Card */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +15.3% from last month
              </p>
              <Progress value={85} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Orders Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    <CardDescription>
                      Latest customer orders requiring attention
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/orders">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-sm">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                order.deliveryStatus === "delivered"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {order.deliveryStatus}
                            </Badge>
                            <Badge
                              variant={
                                order.payment.status === "paid"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {order.payment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.amount}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Products Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Top Products</CardTitle>
                    <CardDescription>
                      Best performing products in your catalog
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/products">Manage All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.topProducts.length > 0 ? (
                    stats.topProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
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
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${product.price}</p>
                          {product.discount && (
                            <p className="text-xs text-green-600">
                              -{product.discount}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No products found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab Content */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Monitor and manage all customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Order Management</h3>
                  <p className="mb-4">
                    Full order management interface coming soon
                  </p>
                  <Button asChild>
                    <Link href="/admin/orders">Go to Orders Page</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab Content */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Manage your product catalog and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Product Management
                  </h3>
                  <p className="mb-4">
                    Full product management interface coming soon
                  </p>
                  <Button asChild>
                    <Link href="/admin/products">Go to Products Page</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="mb-4">
                    Advanced analytics and reporting tools coming soon
                  </p>
                  <Button variant="outline">View Sample Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

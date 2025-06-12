import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * AdminLayout component - Provides consistent layout structure for admin pages
 * Features a modern design with proper spacing, typography, and responsive behavior
 * Ensures all admin pages maintain visual consistency and professional appearance
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "Admin Panel",
  description = "Manage your ecommerce store",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Main content wrapper */}
      <div className="relative">
        {/* Page header */}
        {(title || description) && (
          <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg text-gray-600 max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className="relative z-10">{children}</main>
      </div>
    </div>
  );
};

/**
 * AdminCard component - Enhanced card component for admin panels
 * Provides consistent styling with hover effects and proper spacing
 * Features gradient backgrounds and shadow effects for modern appearance
 */
interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = "",
  hover = true,
  gradient = false,
}) => {
  const baseClasses = "bg-white border border-gray-200 rounded-xl shadow-sm";
  const hoverClasses = hover
    ? "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    : "";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-white to-gray-50"
    : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * MetricCard component - Specialized card for displaying key metrics
 * Features prominent numbers, trend indicators, and visual enhancements
 * Optimized for dashboard KPI display with professional styling
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    red: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <AdminCard className="p-6" hover={true}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="font-medium">
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {trend && <p className="text-xs text-gray-500">{trend.label}</p>}
      </div>
    </AdminCard>
  );
};

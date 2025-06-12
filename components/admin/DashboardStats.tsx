import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface QuickStatsProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconColor: string;
  progress?: number;
}

/**
 * QuickStats component - Displays key performance indicators with visual enhancements
 * Shows metrics with percentage changes, progress bars, and color-coded indicators
 * Provides at-a-glance business performance insights for dashboard overview
 */
export const QuickStats: React.FC<QuickStatsProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor,
  progress = 0,
}) => {
  // Determine if the change is positive or negative for styling
  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const ChangeTrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 tracking-wide">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconColor} bg-opacity-10`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main metric value */}
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>

        {/* Change indicator */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 ${changeColor}`}>
            <ChangeTrendIcon className="h-3 w-3" />
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 border-0"
          >
            {changeLabel}
          </Badge>
        </div>

        {/* Progress bar if provided */}
        {progress > 0 && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2 bg-gray-100" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "product" | "user" | "payment";
  status?: "success" | "warning" | "error";
}

/**
 * ActivityItem component - Displays individual activity entries in the recent activity feed
 * Shows different activity types with appropriate icons and status indicators
 * Provides detailed activity tracking for admin oversight
 */
export const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  timestamp,
  type,
  status = "success",
}) => {
  // Map activity types to appropriate colors and icons
  const typeConfig = {
    order: { color: "text-blue-600", bgColor: "bg-blue-50" },
    product: { color: "text-purple-600", bgColor: "bg-purple-50" },
    user: { color: "text-green-600", bgColor: "bg-green-50" },
    payment: { color: "text-orange-600", bgColor: "bg-orange-50" },
  };

  const statusConfig = {
    success: "border-l-green-400",
    warning: "border-l-yellow-400",
    error: "border-l-red-400",
  };

  const config = typeConfig[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${statusConfig[status]} bg-white hover:bg-gray-50 transition-colors`}
    >
      <div
        className={`p-2 rounded-full ${config.bgColor} ${config.color} flex-shrink-0`}
      >
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-2">{timestamp}</p>
      </div>
    </div>
  );
};

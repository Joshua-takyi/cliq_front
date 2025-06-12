"use client";

import { useState } from "react";
import { useProductReviews } from "@/hooks/useReviews";
import { Star, User, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductReviewsProps {
  productId: string;
  productTitle?: string;
}

interface Review {
  id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  helpful_count?: number;
  verified_purchase?: boolean;
}

export default function ProductReviews({
  productId,
  productTitle,
}: ProductReviewsProps) {
  // State for managing review display options
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch reviews using the new hook that properly follows React Hook rules
  // useProductReviews directly returns the query object with data, isLoading, and error
  const { data: reviewsData, isLoading, error } = useProductReviews(productId);

  // Handle loading state with simple skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-gray-100 rounded w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-20" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state with clean message
  if (error) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-base font-medium text-gray-900 mb-1">
          Unable to Load Reviews
        </h3>
        <p className="text-sm text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || reviewsData?.data || [];
  const totalReviews = reviews.length;

  // Calculate average rating for display
  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0
        ) / totalReviews
      : 0;

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a: Review, b: Review) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Determine how many reviews to show
  const reviewsToShow = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 3);

  // Function to render star rating display
  const renderStarRating = (
    rating: number,
    size: "sm" | "md" | "lg" = "md"
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Function to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle case when no reviews exist with minimal design
  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-medium text-gray-900 mb-1">
          No Reviews Yet
        </h3>
        <p className="text-sm text-gray-600">
          Be the first to review{" "}
          {productTitle ? `"${productTitle}"` : "this product"}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary Section - Minimalistic */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          {/* Average Rating Display */}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-medium text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStarRating(Math.round(averageRating))}
              <p className="text-sm text-gray-600 mt-1">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls - Clean */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List - Simple */}
      <div className="space-y-4">
        {reviewsToShow.map((review: Review) => (
          <div key={review.id} className="border border-gray-200 rounded p-4">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {review.user_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(review.created_at)}</span>
                    {review.verified_purchase && (
                      <span className="text-green-600">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
              {renderStarRating(review.rating, "sm")}
            </div>

            {/* Review Content */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Show More/Less Button - Simple */}
      {totalReviews > 3 && (
        <div className="text-center">
          <Button
            onClick={() => setShowAllReviews(!showAllReviews)}
            variant="outline"
            className="text-sm"
          >
            {showAllReviews ? "Show Less" : `Show All ${totalReviews} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProductReviews } from "@/hooks/useReviews";
import { Star, User, Calendar, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data: reviewsData, isLoading, error } = useProductReviews(productId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6  space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-28 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center py-12">
        <p className="text-lg font-semibold text-gray-900">
          Unable to Load Reviews
        </p>
        <p className="text-base text-gray-600 mt-2">Please try again later.</p>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || reviewsData?.data || [];
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0
        ) / totalReviews
      : 0;

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

  const reviewsToShow = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 3);

  const renderStarRating = (rating: number) => (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (totalReviews === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <Pen className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">
            No Reviews Yet
          </h3>
          <p className="text-base text-gray-600">
            Be the first to share your thoughts on{" "}
            {productTitle ? `"${productTitle}"` : "this product"}.
          </p>
          <Button
            asChild
            className="text-base px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label="Write a review"
          >
            <Link href={`/products/${productId}/review`}>Write a Review</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </p>
            {renderStarRating(Math.round(averageRating))}
            <p className="text-base text-gray-600">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base  focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort reviews"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="space-y-4">
          {reviewsToShow.map((review: Review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg lg:p-6 p-3 bg-white/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {review.user_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(review.created_at)}</span>
                      {review.verified_purchase && (
                        <span className="text-green-600 text-sm">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {renderStarRating(review.rating)}
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                {review.comment}
              </p>
              {review.helpful_count !== undefined && (
                <p className="text-sm text-gray-600 mt-2">
                  {review.helpful_count}{" "}
                  {review.helpful_count === 1 ? "person" : "people"} found this
                  helpful
                </p>
              )}
            </div>
          ))}
        </div>

        {totalReviews > 3 && (
          <div className="text-center">
            <Button
              onClick={() => setShowAllReviews(!showAllReviews)}
              variant="outline"
              className="text-base px-6 py-2 border-gray-300 hover:bg-gray-100"
              aria-label={
                showAllReviews
                  ? "Show fewer reviews"
                  : `Show all ${totalReviews} reviews`
              }
            >
              {showAllReviews ? "Show Fewer" : `Show All (${totalReviews})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

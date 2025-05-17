"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  userImage?: string;
}

interface ProductReviewsProps {
  productId: string;
}

/**
 * ProductReviews component displays customer reviews and ratings
 * for a specific product
 *
 * @param productId - The ID of the product to show reviews for
 */
const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("newest");

  // Mock reviews data (in a real app, this would come from an API)
  const mockReviews: Review[] = [
    {
      id: "1",
      userName: "Alex Johnson",
      rating: 5,
      date: "2025-04-12",
      comment:
        "This product exceeded my expectations. The quality is outstanding and it's exactly what I was looking for. Would definitely recommend!",
      helpful: 12,
      userImage: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      userName: "Sarah Miller",
      rating: 4,
      date: "2025-04-01",
      comment:
        "Great product overall. The only thing that could be improved is the packaging, but the product itself is fantastic.",
      helpful: 8,
      userImage: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      userName: "Michael Chen",
      rating: 3,
      date: "2025-03-22",
      comment:
        "It's okay. Not amazing, not terrible. It does the job but I feel like it's a bit overpriced for what you get.",
      helpful: 5,
    },
  ];

  // Calculate average rating
  const averageRating =
    mockReviews.length > 0
      ? mockReviews.reduce((acc, review) => acc + review.rating, 0) /
        mockReviews.length
      : 0;

  // Filter and sort reviews
  const filteredAndSortedReviews = mockReviews
    .filter((review) => reviewFilter === null || review.rating === reviewFilter)
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      } else if (sortOption === "mostHelpful") {
        return b.helpful - a.helpful;
      }
      return 0;
    });

  // Handle marking a review as helpful
  const handleHelpfulClick = (reviewId: string) => {
    console.log(`Marked review ${reviewId} as helpful`);
    // In a real app, you would make an API call to update the helpful count
  };

  // Render star rating
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="my-12" id="reviews">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {/* Reviews summary section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Overall rating */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              <StarRating rating={averageRating} />
            </div>
            <div className="text-sm text-gray-500">
              Based on {mockReviews.length} reviews
            </div>
          </div>

          {/* Rating distribution */}
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = mockReviews.filter(
                (review) => review.rating === rating
              ).length;
              const percentage =
                mockReviews.length > 0 ? (count / mockReviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center">
                  <button
                    onClick={() =>
                      setReviewFilter(reviewFilter === rating ? null : rating)
                    }
                    className={`flex items-center ${
                      reviewFilter === rating ? "font-medium" : ""
                    } hover:underline`}
                  >
                    <span className="w-3">{rating}</span>
                    <svg
                      className="w-4 h-4 text-yellow-400 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                  <div className="flex-1 ml-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Write review button */}
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            className="w-full mt-6"
          >
            Write a Review
          </Button>
        </div>

        {/* Filters and reviews list */}
        <div className="w-full md:w-2/3">
          {/* Filter controls */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            {/* Active filter indicator */}
            {reviewFilter !== null && (
              <div className="flex items-center mb-2 sm:mb-0">
                <span className="text-sm mr-2">Filtered by:</span>
                <span className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center">
                  {reviewFilter} Stars
                  <button
                    onClick={() => setReviewFilter(null)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            )}

            {/* Sort dropdown */}
            <div className="flex items-center">
              <label htmlFor="sortReviews" className="text-sm mr-2">
                Sort by:
              </label>
              <select
                id="sortReviews"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="mostHelpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews list */}
          <AnimatePresence>
            {filteredAndSortedReviews.length > 0 ? (
              <ul className="space-y-6">
                {filteredAndSortedReviews.map((review) => (
                  <motion.li
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b pb-6"
                  >
                    <div className="flex items-start">
                      {/* User avatar */}
                      <div className="mr-4">
                        {review.userImage ? (
                          <img
                            src={review.userImage}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Review content */}
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium mr-2">
                            {review.userName}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mb-2">
                          <StarRating rating={review.rating} />
                        </div>

                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        {/* Helpful button */}
                        <button
                          onClick={() => handleHelpfulClick(review.id)}
                          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p>No reviews match your current filter.</p>
                {reviewFilter !== null && (
                  <Button variant="link" onClick={() => setReviewFilter(null)}>
                    Clear filter
                  </Button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Review submission modal - would be implemented in a real app */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <p>Review modal content would go here</p>
            <Button
              onClick={() => setIsReviewModalOpen(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

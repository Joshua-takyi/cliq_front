"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/useReviews";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddReview({ id }: { id: string }) {
  const { data: session } = useSession();

  const defaultEmail = session?.user?.email || "";
  const defaultName = session?.user?.name || "";
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>(defaultName);
  const [reviewEmail, setReviewEmail] = useState<string>(defaultEmail);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Function to handle review submission

  const { addReview } = useReviews();
  const { mutate } = addReview;
  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingReview(true);

    try {
      //validate form
      if (!reviewText || !reviewName || !reviewEmail || !reviewRating) {
        toast.error("Please fill all required fields", {
          richColors: false,
        });
        return;
      }
      mutate({
        product_id: id,
        rating: reviewRating,
        user_name: reviewName,
        comment: reviewText,
        user_email: reviewEmail,
      });
      setReviewText("");
      setReviewRating(5);

      toast.success("Review submitted successfully!", {
        richColors: false,
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold my-4">Write a Review</h2>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        {/* Rating and name on same row */}
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <Label
              htmlFor="rating-stars"
              className="text-sm font-medium block mb-1"
            >
              Rating
            </Label>
            <div
              id="rating-stars"
              className="flex items-center gap-1 border border-black p-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`w-8 h-8 flex items-center justify-center border border-black ${
                    reviewRating >= star
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow">
            <Label
              htmlFor="review-name"
              className="text-sm font-medium block mb-1"
            >
              Your Name
            </Label>
            <Input
              id="review-name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              required
              className="rounded-none w-full border border-black focus:border-black focus:ring-0 focus:outline-none h-10"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Email input */}
        <div>
          <Label
            htmlFor="review-email"
            className="text-sm font-medium block mb-1"
          >
            Your Email
          </Label>
          <Input
            id="review-email"
            type="email"
            value={reviewEmail}
            onChange={(e) => setReviewEmail(e.target.value)}
            required
            className="rounded-none w-full border border-black focus:border-black focus:ring-0 focus:outline-none h-10"
            placeholder="Enter your email"
          />
        </div>

        {/* Review Text Area */}
        <div>
          <Label
            htmlFor="review-text"
            className="text-sm font-medium block mb-1"
          >
            Your Review
          </Label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            className="rounded-none min-h-[100px] resize-none border border-black focus:border-black focus:ring-0 focus:outline-none w-full"
            placeholder="Share your thoughts about this product..."
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmittingReview}
          className="w-fit bg-black hover:bg-gray-800 text-white h-10 rounded-none text-sm px-6"
          variant="default"
        >
          {isSubmittingReview ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}

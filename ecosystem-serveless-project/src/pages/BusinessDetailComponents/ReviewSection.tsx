import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";

const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com";

interface Review {
  reviewid?: string;
  comment: string;
  businessId: string;
}

interface Props {
  businessId: string;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const Reviews: React.FC<Props> = ({ businessId, reviews, setReviews }) => {
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewText.trim()) return;

    try {
      setSubmitting(true);

      const res = await axios.post(`${API_URL}/reviews`, {
        businessId,
        comment: reviewText,
        rating: 5,
      });

      setReviews((prev) => [...prev, res.data]);
      setReviewText("");
    } catch (err) {
      console.log("Review error:", err);

      setReviews((prev) => [
        ...prev,
        {
          businessId,
          comment: reviewText,
        },
      ]);

      setReviewText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6 bg-white rounded-xl border border-green-100">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review, idx) => (
              <div
                key={review.reviewid || idx}
                className="bg-white rounded-xl border border-green-100 shadow-sm px-5 py-4"
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Add Your Review
        </h2>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Enter your review..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <Button
            variant="success"
            onClick={handleSubmit}
            className="!px-5 !py-2 text-sm"
          >
            {submitting ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
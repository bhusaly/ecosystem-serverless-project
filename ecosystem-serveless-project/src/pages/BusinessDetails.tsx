import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";

interface Business {
  id: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

interface Review {
  id?: string;
  author?: string;
  text: string;
  [key: string]: any;
}

const BusinessDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const nav = useNavigate();

  const [business, setBusiness] = useState<Business | null>(
    (location.state as any)?.business || null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!business);

  useEffect(() => {
    if (!business) {
      const fetchBusiness = async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`);
          const data = await res.json();
          setBusiness(data);
        } catch {
          // handle silently
        } finally {
          setLoading(false);
        }
      };
      fetchBusiness();
    }

    // fetch reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}/reviews`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.reviews ?? [];
        setReviews(list);
      } catch {
        // no reviews endpoint or empty
      }
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reviewText }),
      });
      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]);
      setReviewText("");
    } catch {
      // optimistic fallback
      setReviews((prev) => [...prev, { text: reviewText }]);
      setReviewText("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center text-gray-500 text-sm">
        Business not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => nav(-1)}
          className="text-sm text-green-600 hover:underline mb-6 inline-block"
        >
          ← Back
        </button>

        {/* Business Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {business.name}
          </h1>
          {business.category && (
            <span className="inline-block text-xs font-semibold px-3 py-0.5 rounded-full bg-green-100 text-green-700 mb-3">
              {business.category}
            </span>
          )}
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            {business.description ||
              "Green Grocer Co. is a leading provider of locally sourced organic produce, committed to sustainable farming practices since 2015. Our mission is to make healthy, eco-friendly food accessible to everyone while maintaining the highest standards of quality and sustainability."}
          </p>
        </div>

        {/* Customer Reviews */}
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
                  key={review.id || idx}
                  className="bg-white rounded-xl border border-green-100 shadow-sm px-5 py-4"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {review.author || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Add Your Review
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter Your Reviews..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReview()}
            />
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-green-600 hover:bg-green-700 transition"
            >
              {submitting ? "..." : "Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
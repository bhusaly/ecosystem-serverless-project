import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface Review {
  reviewid: string;
  comment: string;
  businessName?: string;
  businessId: string
}

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  review: Review | null;
}

const API_BASE = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/";

export default function ReviewEditModal({
  isOpen,
  onClose,
  onSuccess,
  review,
}: ReviewEditModalProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (review) {
      setComment(review.comment || "");
    }
    setError("");
  }, [review, isOpen]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Review cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.put(`${API_BASE}/reviews/${review!.reviewid}`, { comment, businessId: review?.businessId });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
        <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center">Edit Review</h2>
        {review.businessName && (
          <p className="text-sm text-gray-400 mb-6">for {review.businessName}</p>
        )}

        <div className="space-y-4 mt-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Write your review..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B000]/40 focus:border-[#00B000] transition resize-none"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#00B000] hover:bg-[#009900] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
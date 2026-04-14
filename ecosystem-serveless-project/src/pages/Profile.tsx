import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BusinessCard from "./ProfileComponents/BusinessCard";
import ConfirmDialog from "./ProfileComponents/DeleteConfirmModal";
import BusinessModal from "./ProfileComponents/AddBusinessModal";
import ReviewEditModal from "./ProfileComponents/EditReviewModal";

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface Review {
  id: string;
  reviewer?: string;
  content: string;
  rating?: number;
  businessName?: string;
  businessId?: string;
}

const API_BASE =  "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";

function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: (r: Review) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
       
          {review.businessName && (
            <p className="text-xs text-gray-400">{review.businessName}</p>
          )}
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(review)}
            title="Edit review"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#00B000] hover:bg-[#00B000]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(review.id)}
            title="Delete review"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
    </div>
  );
}



export default function Profile() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bizLoading, setBizLoading] = useState(true);
  const [revLoading, setRevLoading] = useState(true);
  const [bizError, setBizError] = useState("");
  const [revError, setRevError] = useState("");

  // Business modal
  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  // Review modal
  const [revModalOpen, setRevModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setBizLoading(true);
    setBizError("");
    try {
      const { data } = await axios.get(`${API_BASE}/businesses/my`);
      setBusinesses(data);
    } catch {
      setBizError("Failed to load businesses.");
    } finally {
      setBizLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setRevLoading(true);
    setRevError("");
    try {
      const { data } = await axios.get(`${API_BASE}/reviews/my`);
      setReviews(data);
    } catch {
      setRevError("Failed to load reviews.");
    } finally {
      setRevLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
    // fetchReviews();
  }, [fetchBusinesses, fetchReviews]);

  // ── Business actions ─────────────────────────────────────────────────────
  const openAddBusiness = () => {
    setEditingBusiness(null);
    setBizModalOpen(true);
  };

  const openEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setBizModalOpen(true);
  };

  const handleDeleteBusiness = (id: string) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this business? This action cannot be undone.",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`${API_BASE}/businesses/${id}`);
          setBusinesses((prev) => prev.filter((b) => b.id !== id));
        } catch {
          alert("Failed to delete business.");
        }
      },
    });
  };

    const openEditReview = (review: Review) => {
    setEditingReview(review);
    setRevModalOpen(true);
  };

  const handleDeleteReview = (id: string) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this review?",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`${API_BASE}/reviews/${id}`);
          setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch {
          alert("Failed to delete review.");
        }
      },
    });
  };
console.log(businesses, "this is what i am looking for ")
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Your Businesses ───────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Your Business</h2>
            <button
              onClick={openAddBusiness}
              className="flex items-center gap-1.5 bg-[#00B000] hover:bg-[#009900] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Business
            </button>
          </div>

          {bizError && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              {bizError}
              <button onClick={fetchBusinesses} className="ml-2 underline">
                Retry
              </button>
            </div>
          )}

          {bizLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             Loading...
            </div>
          ) : businesses?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-400 text-sm mb-4">No businesses added yet</p>
              <button
                onClick={openAddBusiness}
                className="bg-[#00B000] hover:bg-[#009900] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Add your first business
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses?.map((b) => (
                <BusinessCard
                  key={b.id}
                  business={b}
                  onEdit={openEditBusiness}
                  onDelete={handleDeleteBusiness}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Your Reviews ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Your Reviews</h2>
            {!revLoading && reviews.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {revError && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              {revError}
              <button onClick={fetchReviews} className="ml-2 underline">
                Retry
              </button>
            </div>
          )}

          {revLoading ? (
            <div className="flex flex-col gap-4">
             loading...
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-400 text-sm">You haven't written any reviews yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  onEdit={openEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <BusinessModal
        isOpen={bizModalOpen}
        onClose={() => setBizModalOpen(false)}
        onSuccess={fetchBusinesses}
        business={editingBusiness}
      />

      <ReviewEditModal
        isOpen={revModalOpen}
        onClose={() => setRevModalOpen(false)}
        onSuccess={fetchReviews}
        review={editingReview}
      />

      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
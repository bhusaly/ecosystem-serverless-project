import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import BusinessCard from "./ProfileComponents/BusinessCard";
import ConfirmDialog from "./ProfileComponents/DeleteConfirmModal";
import BusinessModal from "./ProfileComponents/AddBusinessModal";
import ReviewEditModal from "./ProfileComponents/EditReviewModal";

interface Business {
  businessId: string;
  name: string;
  category: string;
  description: string;
}

interface Review {
  reviewid: string;
  comment: string;
  businessId: string;
  businessName?: string;
}

const API_BASE = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/";

function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string, businessId:string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-start gap-4">
      
      <div className="flex-1">
        {review.businessName && (
          <p className="text-xs font-medium text-green-600 mb-1">
            {review.businessName}
          </p>
        )}
        <p className="text-sm text-gray-600">{review.comment}</p>
      </div>

      <div className="flex gap-2 shrink-0">
        
        <button
          onClick={() => onEdit(review)}
          className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => onDelete(review.reviewid, review.businessId!)}
          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>

      </div>
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

  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setBizLoading(true);
    setBizError("");
    try {
      const res = await axios.get(`${API_BASE}user/business`);
      setBusinesses(res.data || []);
    } catch {
      setBizError("Failed to load businesses");
    } finally {
      setBizLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setRevLoading(true);
    setRevError("");
    try {
      const res = await axios.get(`${API_BASE}user/reviews`);
      setReviews(res.data || []);
    } catch {
      setRevError("Failed to load reviews");
    } finally {
      setRevLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
    fetchReviews();
  }, [fetchBusinesses, fetchReviews]);


  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setBizModalOpen(true); 
  };

  const handleBizModalClose = () => {
    setBizModalOpen(false);
    setEditingBusiness(null);
  };

  const handleDeleteBusiness = (id: string) => {
    setConfirmDialog({
      message: "Delete this business?",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`${API_BASE}business/${id}`);
          setBusinesses((prev) => prev.filter((b) => b.businessId !== id));
        } catch {
          alert("Delete failed");
        }
      },
    });
  };


  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleReviewModalClose = () => {
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string, businessId:string) => {
    setConfirmDialog({
      message: "Delete this review?",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`${API_BASE}business/${businessId}/reviews/${id}`);
          setReviews((prev) => prev.filter((r) => r.reviewid !== id));
        } catch {
          alert("Delete failed");
        }
      },
    });
  };

  // useEffect(() => {

  // } [])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Businesses */}
        <section className="mb-12">
          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold">Your Businesses</h2>
            <button
              onClick={() => {
                setEditingBusiness(null);
                setBizModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add Business
            </button>
          </div>

          {bizLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : bizError ? (
            <p className="text-red-500 text-sm">{bizError}</p>
          ) : businesses.length === 0 ? (
            <p className="text-sm text-gray-400">No businesses found</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {businesses.map((b) => (
                <BusinessCard
                  key={b.businessId}
                  business={b}
                  onEdit={handleEditBusiness}  // now opens modal too
                  onDelete={handleDeleteBusiness}
                />
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-lg font-semibold mb-5">Your Reviews</h2>

          {revLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : revError ? (
            <p className="text-red-500 text-sm">{revError}</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <ReviewCard
                  key={r.reviewid}
                  review={r}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Business Add/Edit Modal */}
      <BusinessModal
        isOpen={bizModalOpen}
        onClose={handleBizModalClose}
        onSuccess={fetchBusinesses}
        business={editingBusiness}
      />

   
      <ReviewEditModal
        isOpen={!!editingReview}          
        onClose={handleReviewModalClose}
        onSuccess={fetchReviews}
        review={editingReview}
      />
    </div>
  );
}
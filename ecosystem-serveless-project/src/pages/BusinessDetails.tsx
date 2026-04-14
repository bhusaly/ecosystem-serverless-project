import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Reviews from "./BusinessDetailComponents/ReviewSection";

const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com";

interface Business {
  businessId: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
}

interface Review {
  reviewid?: string;
  comment: string;
  businessId: string;
}

const BusinessDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [business, setBusiness] = useState<Business | null>(
    (location.state as any)?.business || null
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(!business);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!business) {
          const res = await axios.get(`${API_URL}/business/${id}`);
          setBusiness(res.data);
        }

        const reviewRes = await axios.get(
          `${API_URL}/business/${id}/reviews`
        );

        setReviews(reviewRes.data || []);
      } catch (err) {
        console.log("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {business.name}
          </h1>

          {business.category && (
            <span className="inline-block text-xs font-semibold px-3 py-0.5 rounded-full bg-green-100 text-green-700 mb-3">
              {business.category}
            </span>
          )}

          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            {business.description}
          </p>
        </div>

        <Reviews
          businessId={id!}
          reviews={reviews}
          setReviews={setReviews}
        />

      </div>
    </div>
  );
};

export default BusinessDetail;
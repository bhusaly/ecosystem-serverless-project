import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface Business {
  businessId?: string;
  name: string;
  category: string;
  description: string;
}

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  business?: Business | null; 
}

const API_BASE = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/" ;

export default function BusinessModal({
  isOpen,
  onClose,
  onSuccess,
  business,
}: BusinessModalProps) {
  const [form, setForm] = useState<Business>({
    name: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!business;

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        category: business.category || "",
        description: business.description || "",
      });
    } else {
      setForm({ name: "", category: "", description: "" });
    }
    setError("");
  }, [business, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      setError("Name and category are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await axios.put(`${API_BASE}business/${business!.businessId}`, form);
      } else {
        await axios.post(`${API_BASE}business`, form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
<X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {isEdit ? "Edit Business" : "Add Business"}
        </h2>

        <div className="space-y-4">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B000]/40 focus:border-[#00B000] transition"
            />
          </div>

          <div>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B000]/40 focus:border-[#00B000] transition"
            />
          </div>

          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B000]/40 focus:border-[#00B000] transition resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00B000] hover:bg-[#009900] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}
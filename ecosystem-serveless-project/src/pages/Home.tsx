import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

const API_URL =
  "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";

interface Business {
  id: string;
  name: string;
  description: string;
  businessId: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

const Home = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);

        setBusinesses(res.data || []);
        setFiltered(res.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // 🔥 local search (no backend pagination)
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(businesses);
      return;
    }

    const q = search.toLowerCase();

    const result = businesses.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, businesses]);

  const handleCardClick = (business: Business) => {
    nav(`/business/${business.businessId}`);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="text-center pt-12 pb-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Discover Eco-Friendly
          <br />
          Businesses
        </h1>

        <p className="text-gray-500 text-sm mt-3">
          Connect with sustainable companies that care about our planet
        </p>

        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-10 pr-4 py-3 border border-1 shadow-md rounded-full
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-6 pb-16">

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-sm">Loading businesses...</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No matching businesses found.
          </div>
        )}

        {/* GRID */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((biz) => (
              <div
                key={biz.businessId || biz.id}
                onClick={() => handleCardClick(biz)}
                className="flex flex-col items-center bg-white rounded-xl
                           border border-green-100 shadow-sm p-5 cursor-pointer
                           hover:-translate-y-1 hover:shadow-md transition-all duration-150"
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                  {biz.name || "Unnamed Business"}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
                  {biz.description ||
                    "Locally sourced organic products delivered fresh to your door."}
                </p>

                <button className="w-full py-2 rounded-lg text-white text-sm font-semibold bg-green-600 hover:bg-green-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
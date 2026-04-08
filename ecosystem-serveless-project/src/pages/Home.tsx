import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";

interface Business {
  id: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

const Home = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        const list = data;
        setBusinesses(list);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleCardClick = (business: Business) => {
    nav(`/business/${business.id}`, { state: { business } });
  };

  return (
    <div className="min-h-screen !bg-white">

      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">
          Discover Eco-Friendly
          <br />
          Businesses
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-sm">Loading businesses...</p>
          </div>
        )}

        {!loading && !error && businesses.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No businesses found.
          </div>
        )}

        {!loading && !error && businesses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => handleCardClick(biz)}
                className="flex flex-col items-center bg-white rounded-xl border border-green-100 shadow-sm p-5 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-150"
              >
               

                <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                  {biz.name || "Unnamed Business"}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
                  {biz.description ||
                    "Locally sourced organic products delivered fresh to your door, supporting sustainable farming."}
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
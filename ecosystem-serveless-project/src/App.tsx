import { Route, Routes, useNavigate } from "react-router-dom"
import Auth from "./pages/login"
import { useEffect, useState } from "react"
import { getCurrentUser, signOut } from "aws-amplify/auth"
import Home from "./pages/Home";
import BusinessDetail from "./pages/BusinessDetails";
import Profile from "./pages/Profile";

function App() {
  const nav = useNavigate();
  const [loggedin, setIsLoggedin] = useState<boolean>(false);
  const [form, setForm] = useState({ name: "", category: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsLoggedin(true);
      } catch {
        // not logged in
      }
    };
    checkUser();
  }, []);

  const handleLogOut = async () => {
    await signOut();
    setIsLoggedin(false);
    nav('/login');
  };

  const handleAddBusiness = async () => {
    if (!form.name || !form.category || !form.description) return;
    try {
      setSubmitting(true);
      await fetch("https://85z743ntte.execute-api.us-east-1.amazonaws.com/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", category: "", description: "" });
      setShowModal(false);
    } catch (err) {
      alert("Failed to add business");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight text-green-600 cursor-pointer"
            onClick={() => nav("/")}
          >
            EcoConnect
          </span>

          <div className="flex gap-2">
            {loggedin ? (
              <>
                <button
                  onClick={() => nav("/profile")}
                  className="px-4 py-1.5 text-sm rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogOut}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => nav("/login")}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => nav("/login")}
                  className="px-4 py-1.5 text-sm rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/business" element={<Home />} />
        <Route path="/business/:id" element={<BusinessDetail />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
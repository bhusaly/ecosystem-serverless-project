import { Route, Routes, useNavigate } from "react-router-dom"
import Auth from "./pages/login"
import { useEffect, useState } from "react"
import { getCurrentUser, signOut } from "aws-amplify/auth"
import Home from "./pages/Home";

function App() {
  const nav = useNavigate();
  const [loggedin, setIsLoggedin] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsLoggedin(true);
      } catch {
        // nav('/login');
      }
    };
    checkUser();
  }, []);

  const handleLogOut = async () => {
    await signOut();
    setIsLoggedin(false);
    nav('/login');
  };

  return (
    <>
      {loggedin && (
        <div className="w-full flex justify-between">
          <button className="border-2 rounded-md  m-10 p-4" onClick={handleLogOut}>
           Add Business
          </button>
          <button className="border-2 rounded-md  m-10 p-4" onClick={handleLogOut}>
            Log out
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/business" element={<h1>this is business page</h1>} />
        <Route path="/business/:id" element={<h1>this is single business page</h1>} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
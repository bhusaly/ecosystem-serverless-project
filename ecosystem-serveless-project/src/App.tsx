import { Route, Routes,  } from "react-router-dom"
import Auth from "./pages/login"
import Home from "./pages/Home";
import BusinessDetail from "./pages/BusinessDetails";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
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
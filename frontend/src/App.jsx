import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Questionnaire from "./components/Questionnaire";
import Recommendations from "./components/Recommendations";
import Navbar from "./components/Navbar";
import GiftFinder from "./pages/GiftFinder";
import ChatAssistant from "./components/ChatAssistant";
import "./styles/App.css";

// Add this at the top of your App.jsx
if (localStorage.getItem("backendOverride")) {
  // Already set, no action needed
} else {
  // Set initial override for local development
  if (window.location.hostname === "localhost") {
    localStorage.setItem("backendOverride", "https://giftrecomenderproject.onrender.com");
  }
}

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Set user only if token exists
    setUser(token ? true : false);
  }, [location]);

  return (
    <div className="app-container">
      {user && <Navbar setUser={setUser} />}

      <div className="content-container">
        <Routes>
          {!user ? (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Questionnaire />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/gift-finder" element={<GiftFinder />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>

      {/* AI Chat Assistant - Available for logged in users */}
      {user && <ChatAssistant />}
    </div>
  );
};

export default App;
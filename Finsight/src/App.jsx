import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";

// Pages
import LandingPage from "./pages/Landing";
import Stock from "./pages/Stock";
import News from "./pages/News";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Watchlist from "./pages/Watchlist";

function App() {
  // User state: null = not logged in
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        {/* Navbar always visible */}
        <Navbar user={user} setUser={setUser} />

        {/* Routes */}
        <Routes>
          {/* Landing page → redirect to /stock if logged in */}
          <Route
            path="/"
            element={user ? <Navigate to="/stock" replace /> : <LandingPage />}
          />

          {/* Authentication routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* Protected app pages */}
          <Route
            path="/stock"
            element={user ? <Stock /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/news"
            element={user ? <News /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/watchlist"
            element={user ? <Watchlist /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all → redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

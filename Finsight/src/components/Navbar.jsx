import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const API_URL = "https://stockfolo.onrender.com"; // Local backend URL

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/user/logout`);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/70 shadow-lg flex flex-wrap justify-between items-center px-6 md:px-12 py-4 transition-all duration-300">
      {/* Site Name */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 hover:scale-105 transform transition duration-300"
      >
        STOCKFOLO
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 md:space-x-8">
        {user ? (
          <>
            {["Stock", "News", "Watchlist"].map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase()}`}
                className="text-white hover:text-cyan-400 transition duration-300 transform hover:scale-105"
              >
                {page}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <Link
              to="/login"
              className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-magenta-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

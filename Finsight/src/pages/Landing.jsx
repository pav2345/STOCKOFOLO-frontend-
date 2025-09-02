import React, { useEffect } from "react";
import LandingImage from "../assets/landing.png";
import axios from "axios";

const LandingPage = () => {
  // ✅ API base URL (works locally & on Vercel)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://stockfolo.onrender.com";

  useEffect(() => {
    // Example: fetch some data from backend when landing page loads
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/stocks`);
        console.log("Fetched data:", res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="font-sans text-white bg-black">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-16 md:py-20 relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-black">
        {/* Text Content */}
        <div className="flex-1 space-y-6 md:pr-10 relative z-10 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide animate-fadeIn">
            Welcome to{" "}
            <span className="text-gradient bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
              STOCKFOLO
            </span>
          </h1>
          <p className="text-gray-300 text-md sm:text-lg md:text-xl leading-relaxed animate-fadeIn delay-200">
            Track stocks, market trends, news, and manage your personal watchlist
            with real-time analytics 
          </p>
          <p className="text-gray-400 text-sm sm:text-md md:text-lg animate-fadeIn delay-400">
            Stay ahead in the financial market, make informed decisions, and grow
            your portfolio with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 mt-6 animate-fadeIn delay-600">
            <a
              href="/signup"
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 mt-10 md:mt-0 relative z-10 flex justify-center items-center">
          <img
            src={LandingImage}
            alt="Landing"
            className="rounded-3xl shadow-2xl object-cover max-w-full sm:max-w-lg md:max-w-xl animate-fadeIn animate-glow transform transition duration-500 hover:scale-105"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-6 sm:px-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400">
          Features
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {["Real-Time Analytics", "Insights", "Personal Watchlist"].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-purple-800 via-indigo-800 to-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 animate-fadeIn"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-green-400">
                {feature}
              </h3>
              <p className="text-gray-300 text-sm sm:text-md">
                {feature} helps you stay on top of market trends and make smart investment decisions.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-10 px-6 sm:px-10 text-gray-400 text-center">
        <p>© 2025 STOCKFOLO. All rights reserved.</p>
        <div className="flex justify-center flex-wrap gap-4 mt-4">
          <a href="#" className="hover:text-green-400 transition">Twitter</a>
          <a href="#" className="hover:text-green-400 transition">LinkedIn</a>
          <a href="#" className="hover:text-green-400 transition">GitHub</a>
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out forwards;
          }
          .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
          .animate-fadeIn.delay-400 { animation-delay: 0.4s; }
          .animate-fadeIn.delay-600 { animation-delay: 0.6s; }

          @keyframes glow {
            0% { box-shadow: 0 0 15px #00ff7f; }
            100% { box-shadow: 0 0 30px #00ff7f; }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;

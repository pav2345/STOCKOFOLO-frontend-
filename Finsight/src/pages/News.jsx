import React, { useState } from "react";
import NewsImage from "../assets/news.png"; // Fixed import
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

// Optional floating SVG for background
const NewsSVG = () => (
  <svg className="w-40 h-40 text-indigo-400 opacity-10" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>
  </svg>
);

export default function News() {
  const [symbol, setSymbol] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError("");
    setNewsData([]);

    try {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/api/v1/news/${symbol.toUpperCase()}`,
    { credentials: "include" }
  );
  const data = await res.json();


      if (!data.success) {
        setError(data.message || "Failed to fetch news");
      } else {
        setNewsData(data.news || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const COLORS = ["#22c55e", "#ef4444", "#a1a1aa"];
  const sentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive": return "bg-green-500";
      case "negative": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getSentimentData = () => {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    newsData.forEach((n) => counts[n.sentiment]++);
    return [
      { name: "Positive", value: counts.positive },
      { name: "Negative", value: counts.negative },
      { name: "Neutral", value: counts.neutral },
    ];
  };

  const getTrendData = () => {
    const grouped = {};
    newsData.forEach((n) => {
      const date = new Date(n.publishedAt).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-white overflow-x-hidden">
      {/* Floating Background SVGs */}
      <div className="absolute top-10 left-[-60px] animate-pulse opacity-20">
        <NewsSVG />
      </div>
      <div className="absolute bottom-20 right-[-60px] animate-pulse opacity-20">
        <NewsSVG />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full"
        >
          <input
            type="text"
            placeholder="Enter stock symbol (e.g. AAPL)"
            className="flex-1 px-6 py-3 rounded-2xl bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg sm:text-base transition-all w-full sm:w-auto"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <button
            onClick={fetchNews}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-lg sm:text-base shadow-lg transition-all w-full sm:w-auto"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </motion.div>

        {/* Loading & Errors */}
        {loading && <p className="text-center text-gray-400">Fetching news...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* Dashboard Charts */}
        {newsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8 mt-6"
          >
            {/* Sentiment Pie */}
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-center mb-4">Sentiment Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getSentimentData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {getSentimentData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Trend Line */}
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-center mb-4">News Volume Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* News List */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {newsData.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-gray-800 rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${sentimentColor(article.sentiment)}`}
                >
                  {article.sentiment.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{article.headline}</h3>
              <p className="text-sm text-gray-300 mb-3">Source: {article.source}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-indigo-400 hover:text-indigo-300"
              >
                Read more →
              </a>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && newsData.length === 0 && (
          <p className="text-center text-gray-400 mt-10">🔍 Enter a stock symbol to see latest news</p>
        )}
      </div>
    </div>
  );
}

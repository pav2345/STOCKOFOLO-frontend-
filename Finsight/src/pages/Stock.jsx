import React, { useState } from "react";
import StockImage from "../assets/Stock.png";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Placeholder SVG components
const FinanceSVG1 = () => (
  <svg
    className="w-32 h-32 sm:w-40 sm:h-40 text-blue-400 opacity-10"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M3 17h2v-6H3v6zm4 0h2v-10H7v10zm4 0h2v-4h-2v4zm4 0h2V7h-2v10zm4 0h2v-8h-2v8z" />
  </svg>
);

const FinanceSVG2 = () => (
  <svg
    className="w-24 h-24 sm:w-32 sm:h-32 text-purple-500 opacity-10"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

export default function Stock() {
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const STOCK_URL = `https://stockfolo.onrender.com/api/v1/stock`; // Can be replaced with env variable
  const COLORS = { up: "#22c55e", down: "#ef4444" };

  const handleSearch = async () => {
    if (!symbol) return;
    setLoading(true);
    try {
      const stockRes = await fetch(`${STOCK_URL}/${symbol.toUpperCase()}`, {
        credentials: "include",
      });
      const stockData = await stockRes.json();
      setStock(stockData);

      const historyRes = await fetch(
        `${STOCK_URL}/${symbol.toUpperCase()}/history`,
        { credentials: "include" }
      );
      const historyData = await historyRes.json();
      setHistory(historyData.history || []);
    } catch (err) {
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-700 text-white text-sm">
          <p><strong>{label}</strong></p>
          <p>Open: ${data.open}</p>
          <p>High: ${data.high}</p>
          <p>Low: ${data.low}</p>
          <p>Close: ${data.close}</p>
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (state) => {
    if (state && state.activeTooltipIndex != null) {
      setActiveIndex(state.activeTooltipIndex);
    } else {
      setActiveIndex(null);
    }
  };

  const reversedHistory = history.slice().reverse();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center py-8 px-4 sm:px-6 text-white overflow-x-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-[-60px] w-72 h-72 sm:w-96 sm:h-96 bg-blue-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-[-60px] w-72 h-72 sm:w-96 sm:h-96 bg-purple-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

      {/* Floating SVGs */}
      <div className="absolute top-16 left-6 sm:left-12"><FinanceSVG1 /></div>
      <div className="absolute bottom-24 right-12 sm:right-20"><FinanceSVG2 /></div>

      {/* Page Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-6 flex flex-col items-center gap-1">
        📈 Stock Explorer
        <span className="text-sm sm:text-lg text-gray-400">Analyze trends & prices</span>
      </h1>

      <div className="flex flex-col md:flex-row items-start gap-6 w-full max-w-6xl">
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center w-full">
          {/* Search Bar */}
          <div className="flex gap-2 sm:gap-3 mb-6 w-full max-w-xl">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g. AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-sm sm:text-base"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {/* Stock Info */}
          {stock && (
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl w-full border border-gray-700 hover:border-blue-500 transition-all mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">{stock.name} ({symbol.toUpperCase()})</h2>
              <p className="text-green-400 font-semibold text-lg sm:text-xl">Current Price: ${stock.current}</p>
              <p className="text-gray-300 text-sm sm:text-base mt-1">
                High: <span className="text-yellow-400">${stock.high}</span> | Low: <span className="text-red-400">${stock.low}</span>
              </p>
              <p className="text-gray-400 text-sm sm:text-base mt-1">Exchange: {stock.exchange}</p>
              <p className="text-gray-500 text-xs sm:text-sm">Sector: {stock.sector || "N/A"}</p>
            </div>
          )}

          {/* Charts */}
          {history.length > 0 && (
            <div className="w-full max-w-full space-y-6 mt-4 overflow-x-auto">
              {/* Candlestick */}
              <div className="bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-700 relative min-w-[350px] sm:min-w-[600px]">
                <h3 className="text-lg sm:text-xl font-semibold text-teal-300 mb-2">Candlestick</h3>
                <ResponsiveContainer width={reversedHistory.length * 30} height={250}>
                  <BarChart data={reversedHistory} onMouseMove={handleMouseMove} onMouseLeave={() => setActiveIndex(null)}>
                    <XAxis dataKey="date" stroke="#bbb" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <Bar dataKey="close">
                      {reversedHistory.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={activeIndex === idx ? "#facc15" : entry.close >= entry.open ? COLORS.up : COLORS.down}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-700 relative min-w-[350px] sm:min-w-[600px]">
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-300 mb-2">Trend Lines</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reversedHistory}>
                    <XAxis dataKey="date" stroke="#bbb" />
                    <YAxis stroke="#bbb" />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <Line type="monotone" dataKey="open" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column Image */}
        <div className="flex-1 hidden md:flex justify-center items-center">
          <img src={StockImage} alt="Stock Illustration" className="w-full max-w-md rounded-3xl shadow-2xl" />
        </div>
      </div>
    </div>
  );
}

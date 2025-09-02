import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/watchlist`;
  const token = localStorage.getItem("token");

  const fetchWatchlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAddStock = async () => {
    if (!symbol || !name) return alert("Please enter symbol and name");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setWatchlist((prev) => [data.data, ...prev]);
        setSymbol("");
        setName("");
      } else {
        setError(data.message || "Failed to add stock");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setWatchlist((prev) => prev.filter((item) => item._id !== id));
      } else {
        setError(data.message || "Failed to remove stock");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to remove stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 sm:p-8 flex flex-col items-center text-white overflow-x-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-[-80px] w-96 h-96 bg-blue-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-[-80px] w-96 h-96 bg-purple-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-8 text-center">
        📋 My Watchlist
      </h1>

      {/* Add Stock Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 max-w-md items-center p-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-xl w-full"
      >
        <input
          type="text"
          placeholder="Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="flex-1 p-2 rounded bg-gray-900 bg-opacity-40 text-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Stock Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-900 bg-opacity-40 text-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full sm:w-auto"
        />
        <button
          onClick={handleAddStock}
          className="px-3 py-2 rounded-lg bg-teal-600 bg-opacity-80 hover:bg-teal-700 transition-all shadow-md text-sm font-semibold w-full sm:w-auto mt-2 sm:mt-0"
        >
          Add
        </button>
      </motion.div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Watchlist */}
      <ul className="space-y-4 w-full max-w-md px-2 sm:px-0">
        {watchlist.map((stock) => (
          <motion.li
            key={stock._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 bg-opacity-40 p-4 rounded-2xl shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-[1.02] transition-all w-full"
          >
            <div className="mb-2 sm:mb-0">
              <span className="font-bold">{stock.symbol}</span> - {stock.name}
            </div>
            <button
              onClick={() => handleRemoveStock(stock._id)}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition self-end sm:self-auto"
            >
              Remove
            </button>
          </motion.li>
        ))}
      </ul>

      {watchlist.length === 0 && !loading && (
        <p className="text-gray-400 mt-6 text-center">Your watchlist is empty.</p>
      )}
    </div>
  );
};

export default Watchlist;

import React, { useEffect, useState } from "react";
import api from "../api";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user watchlist
  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/watchlist");
      setWatchlist(res.data.watchlist);
    } catch (err) {
      console.error("Error fetching watchlist:", err.response?.data || err.message);
      setError("Failed to fetch watchlist");
    }
  };

  // Add stock to watchlist
  const addStock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/watchlist/add", { symbol, name });
      setWatchlist((prev) => [res.data.data, ...prev]);
      setSymbol("");
      setName("");
    } catch (err) {
      console.error("Error adding stock:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  // Remove stock from watchlist
  const removeStock = async (id) => {
    try {
      await api.delete(`/watchlist/remove/${id}`);
      setWatchlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing stock:", err.response?.data || err.message);
      setError("Failed to remove stock");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">📈 My Watchlist</h1>

      {/* Add Stock Form */}
      <form
        onSubmit={addStock}
        className="flex gap-4 bg-gray-800 p-4 rounded-lg shadow-lg mb-6"
      >
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (e.g., AMZN)"
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company Name"
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Watchlist Display */}
      <ul className="w-full max-w-lg space-y-3">
        {watchlist.map((stock) => (
          <li
            key={stock._id}
            className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow"
          >
            <span>
              <strong>{stock.stockSymbol}</strong> - {stock.stockName}
            </span>
            <button
              onClick={() => removeStock(stock._id)}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {watchlist.length === 0 && <p className="text-gray-400 mt-4">No stocks in watchlist yet.</p>}
    </div>
  );
};

export default Watchlist;



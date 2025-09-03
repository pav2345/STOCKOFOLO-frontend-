import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Import the axios instance

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/api/v1/user/login", { email, password }); // Use relative path

      setMessageType("success");
      setMessage("Login successful! Redirecting...");

      setUser({ email });
      setTimeout(() => navigate("/stock"), 1500);
    } catch (err) {
      console.error(err);
      setMessageType("error");

      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-gray-850 rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm border border-gray-700 flex flex-col gap-4"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6">Welcome Back</h1>

        <input type="email" name="email" placeholder="Email" className="input-field" />
        <input type="password" name="password" placeholder="Password" className="input-field" />

        <button type="submit" className="btn-gradient">Log In</button>

        {message && (
          <p className={`text-center mt-2 ${messageType === "success" ? "text-green-400" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-green-400 hover:underline">Sign Up</Link>
        </p>
      </form>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          background-color: #1f2937;
          color: white;
          border: none;
          outline: none;
          transition: transform 0.2s, box-shadow 0.2s;
          font-size: 0.9rem;
        }
        .input-field:focus {
          box-shadow: 0 0 10px #34d399;
          transform: scale(1.02);
        }
        .btn-gradient {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 1.5rem;
          background: linear-gradient(to right, #34d399, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 0 15px rgba(0,255,255,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 0 35px rgba(0,255,255,0.8);
        }

        @media (max-width: 640px) {
          .input-field {
            font-size: 0.85rem;
            padding: 0.65rem 0.9rem;
          }
          .btn-gradient {
            font-size: 0.95rem;
            padding: 0.65rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

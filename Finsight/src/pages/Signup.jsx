// src/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSignup = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("https://stockfolo.onrender.com/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // If backend returns a token, store it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessageType("success");
      setMessage("Signup successful! Redirecting...");

      // Update global user state
      setUser({ firstName, lastName, email, token: data.token || null });

      setTimeout(() => navigate("/stock"), 1500);
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage(err.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-4 py-8">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-gray-850 rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm border border-gray-700 flex flex-col gap-4"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6">
          Join <span className="text-green-400">StockFolo</span>
        </h1>

        <input type="text" name="firstName" placeholder="First Name" className="input-field" />
        <input type="text" name="lastName" placeholder="Last Name" className="input-field" />
        <input type="email" name="email" placeholder="Email" className="input-field" />
        <input type="password" name="password" placeholder="Password" className="input-field" />

        <button type="submit" className="btn-gradient">Sign Up</button>

        {message && (
          <p className={`text-center mt-2 ${messageType === "success" ? "text-green-400" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">Log In</Link>
        </p>
      </form>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          background-color: #1f2937;
          color: white;
          border: none;
          outline: none;
          font-size: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          box-shadow: 0 0 10px #34d399;
          transform: scale(1.02);
        }
        .btn-gradient {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 1.5rem;
          background: linear-gradient(to right, #34d399, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 0 15px rgba(0,255,255,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 0 35px rgba(0,255,255,0.8);
        }
      `}</style>
    </div>
  );
};

export default Signup;

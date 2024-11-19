import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import bgImage from "../assets/background-image.jpg";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !uid || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "users"), { username, uid, password });
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <img
        className="absolute inset-0 object-cover w-full h-full"
        src={bgImage}
        alt="Background"
      />
      <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-bold font-christmas text-gray-800 mb-4">Sign Up to MerryMatch</h1>
        <form onSubmit={handleSignup} className="w-full">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="UID"
            className="w-full p-3 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full p-3 text-lg font-bold font-christmas text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-700 font-christmas">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

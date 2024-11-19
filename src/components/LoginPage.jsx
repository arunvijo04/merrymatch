import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUser} from "../contexts/userContext.jsx"
import bgImage from "../assets/background-image.jpg";

const LoginPage = () => {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser from UserContext

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!uid || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        alert("Login successful!");

        // Update user data in context
        setUser({ username: user.username, uid: user.uid });

        navigate("/main", { state: { username: user.username, uid: user.uid } });
      } else {
        alert("Invalid UID or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-bold font-christmas text-gray-800 mb-4">Welcome to MerryMatch</h1>
        <form onSubmit={handleLogin} className="w-full">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Username"
            className="w-full p-3 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full p-3 text-lg font-bold font-christmas text-white bg-pink-500 rounded-lg hover:bg-pink-600"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-gray-700 font-christmas">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-pink-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

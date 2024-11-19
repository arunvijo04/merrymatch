import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import bgImage from "../assets/background-image.jpg";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [santaMatches, setSantaMatches] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchSantaMatches();
  }, []);

  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSantaMatches = async () => {
    const matchesRef = collection(db, "match");
    const querySnapshot = await getDocs(matchesRef);
    setSantaMatches(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleShuffleSantas = async () => {
    if (users.length < 2) {
      alert("At least two users are required to shuffle Santas.");
      return;
    }
  
    // Shuffle users to randomize Santa assignments
    const shuffledUsers = [...users];
    shuffledUsers.sort(() => Math.random() - 0.5);
  
    try {
      // Iterate through users and assign a Santa
      for (let i = 0; i < shuffledUsers.length; i++) {
        const user = shuffledUsers[i];
        const santa = shuffledUsers[(i + 1) % shuffledUsers.length]; // Next user in the shuffled list is the Santa
  
        // Update the user's document with the matched Santa UID
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, { 
          santaUid: santa.uid,
          santa: santa.username,
        });
  
        // Store the Santa match in the 'match' collection
        const matchDocRef = doc(db, "match", user.id);
        await setDoc(matchDocRef, {
          santaUid: santa.uid,
          santaUsername: santa.username, // For quick reference in admin view
        });
      }
  
      alert("Santa shuffle completed successfully!");
      fetchSantaMatches(); // Reload the matches to reflect the updated data
    } catch (error) {
      console.error("Error shuffling Santas:", error);
      alert("An error occurred while shuffling Santas. Please try again.");
    }
  };
  

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter((user) => user.id !== id));

    const matchDocRef = doc(db, "match", id);
    await deleteDoc(matchDocRef);
    setSantaMatches(santaMatches.filter((match) => match.id !== id));
  };

  const handleDeleteAllUsers = async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setUsers([]);
    alert("All users deleted.");

    const matchCollectionRef = collection(db, "match");
    const matchQuerySnapshot = await getDocs(matchCollectionRef);
    matchQuerySnapshot.forEach(async (matchDoc) => {
      await deleteDoc(doc(matchCollectionRef, matchDoc.id));
    });

    setSantaMatches([]);
  };

  const handleResetSantas = async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    querySnapshot.forEach(async (userDoc) => {
      const userDocRef = doc(db, "users", userDoc.id);
      await updateDoc(userDocRef, { santaUid: null });
    });
    alert("All Santa matches have been reset.");

    const matchCollectionRef = collection(db, "match");
    const matchQuerySnapshot = await getDocs(matchCollectionRef);
    matchQuerySnapshot.forEach(async (matchDoc) => {
      await deleteDoc(doc(matchCollectionRef, matchDoc.id));
    });
    setSantaMatches([]);
  };

  const handleAdminLogin = () => {
    if (username === "admin" && password === "123") {
      setIsAuthenticated(true); // Authenticate admin
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold font-christmas text-purple-800 mb-4">Admin Login</h1>
          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700 font-christmas">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700 font-christmas">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter password"
            />
          </div>
          <button
            onClick={handleAdminLogin}
            className="w-full bg-purple-600 text-white py-3 rounded-lg shadow-md hover:bg-purple-700 font-christmas"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-purple-100 to-pink-200 flex flex-col items-center py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-christmas text-purple-800">Welcome Admin</h1>
        <p className="text-lg text-gray-700 mt-2 font-christmas">Manage users and Santa assignments</p>
      </div>

      {/* Shuffle Button */}
      <div className="w-3/4 mb-8">
        <button
          onClick={handleShuffleSantas}
          className="w-full bg-purple-600 text-white py-3 rounded-lg shadow-md hover:bg-purple-700 font-christmas"
        >
          Shuffle Santas
        </button>
      </div>

      {/* Users List */}
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-lg overflow-hidden mb-8 h-96">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 font-christmas">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 font-christmas">No users found</p>
        ) : (
          <div className="overflow-y-auto h-72 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 border-b last:border-none font-christmas"
              >
                <div>
                  <p className="font-semibold font-christmas">{user.username}</p>
                  <p className="text-sm text-gray-500 font-christmas">
                    Matched Santa:{" "}
                    {
                      santaMatches.find((match) => match.id === user.id)?.santaUsername ||
                      "None"
                    }
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 font-semibold font-christmas"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete & Reset Buttons */}
      <div className="w-3/4 grid gap-4 md:grid-cols-2">
        <button
          onClick={handleResetSantas}
          className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 font-christmas"
        >
          Reset Santas
        </button>
        <button
          onClick={handleDeleteAllUsers}
          className="bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700 font-christmas"
        >
          Delete All Users
        </button>
      </div>
    </div>
  );
};

export default AdminPage;

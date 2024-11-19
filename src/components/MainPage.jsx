import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import bgImage from "../assets/background-image.jpg";

const MainPage = () => {
  const { state } = useLocation();
  const { username, uid } = state || {};
  const [santaUid, setSantaUid] = useState(null);
  const [santaUsername, setSantaUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchSanta();
    fetchMessages();
  }, []);

  const fetchSanta = async () => {
    try {
      // Query to find the logged-in user's Santa UID
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("uid", "==", uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const santaId = userData.santaUid;
        setSantaUid(santaId);

        if (santaId) {
          // Query to find Santa's username using their UID
          const santaQuery = query(usersRef, where("uid", "==", santaId));
          const santaSnapshot = await getDocs(santaQuery);

          if (!santaSnapshot.empty) {
            setSantaUsername(santaSnapshot.docs[0].data().username);
          }
        } else {
          setSantaUsername(null);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Santa: ", error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const chatRef = collection(db, "chat");
      const messagesQuery = query(chatRef, where("receiverUid", "==", uid));
      const messagesSnapshot = await getDocs(messagesQuery);

      const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!santaUid) {
      alert("Santa is not assigned yet. Please try later.");
      return;
    }

    try {
      const chatRef = collection(db, "chat");
      await addDoc(chatRef, {
        senderUid: uid,
        receiverUid: santaUid,
        message: message.trim(),
        timestamp: new Date(),
      });

      setMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("Failed to send the message.");
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Content Container */}
      <div className="bg-white/90 rounded-lg shadow-lg p-8 max-w-4xl w-full">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-christmas text-purple-800">
            Welcome, {username || "User"}!
          </h1>
        </div>

        {/* Santa Section */}
        <div className="mt-8 text-center">
          {loading ? (
            <p className="text-2xl text-gray-600 font-medium">Loading...</p>
          ) : santaUsername ? (
            <p className="text-3xl font-bold font-christmas text-green-700">
              Your Santa: <span className="text-purple-800">{santaUsername}</span>
            </p>
          ) : (
            <p className="text-2xl font-medium font-christmas text-red-600">
              No match assigned yet.
            </p>
          )}
        </div>

        {/* Message Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Send a Secret Message:</h2>
          <textarea
            className="w-full p-3 border rounded-md text-gray-700"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
          ></textarea>
          <button
            onClick={sendMessage}
            className="mt-4 bg-green-500 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Send Message 🎁
          </button>
        </div>

        {/* Messages to the User */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Secret Messages to You:
          </h2>
          {messages.length > 0 ? (
            <ul className="space-y-4">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-md bg-gray-100 shadow-sm text-gray-700"
                >
                  {msg.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

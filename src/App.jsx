import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import SignupPage from "./components/SignupPage";
import MainPage from "./components/MainPage";
import { UserProvider } from "./contexts/userContext.jsx";
import '@fontsource/mountains-of-christmas';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar /> {/* Navbar should be outside Routes to be always visible */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;

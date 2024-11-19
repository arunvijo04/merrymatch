import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext.jsx";

const Navbar = () => {
  const { user, setUser } = useUser();
  const location = useLocation(); // to track the current route
  const navigate = useNavigate(); // to redirect after logout

  const handleLogout = () => {
    setUser(null);  // Clears the user from context
    navigate("/");  // Redirect to the login page after logout
  };

  const showSignInButton = location.pathname === "/signup";
  const showSignUpButton = location.pathname === "/login"||location.pathname === "/";
  const showAdminButton = location.pathname !== "/admin";
  const showLogoutButton = location.pathname == "/admin"; // Show admin link except when on /admin page

  return (
    <nav className="w-full bg-[#dadfe1] shadow-lg py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-christmas text-black">
        <Link to="/" className="hover:text-cyan-400">
          MerryMatch
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        {!user ? (
          <>
            {/* On Login/Signup pages */}
            {showSignUpButton && (
              <Link to="/signup" className="text-lg text-black hover:text-cyan-400 font-christmas">
                Sign Up
              </Link>
            )}
            {showSignInButton && (
              <Link to="/login" className="text-lg text-black hover:text-cyan-400 font-christmas">
                Sign In
              </Link>
            )}
            {/* Show Admin button if not on the Admin page */}
            {showAdminButton && (
              <Link to="/admin" className="text-lg text-black hover:text-cyan-400 font-christmas">
                Admin
              </Link>
            )}
            {showLogoutButton && (
              <Link to="/" className="text-lg text-black hover:text-cyan-400 font-christmas">
                Logout
              </Link>
            )}
          </>
        ) : (
          <>
            {/* When user is logged in */}
            {location.pathname !== "/admin" && (
              <span className="text-lg text-black font-christmas">
                {user.username || "User"}
              </span>
            )}
            <Link
              to="/"
              onClick={handleLogout}
              className="text-lg text-black hover:text-cyan-400 font-christmas"
            >
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

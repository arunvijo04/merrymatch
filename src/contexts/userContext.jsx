import React, { createContext, useState, useContext } from "react";

// Create the UserContext for providing user state across the app
const UserContext = createContext();

// UserProvider component that wraps your app and provides the user context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Initialize user state to null

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}  {/* The children will have access to the user context */}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);

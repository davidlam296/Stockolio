import React, { useState } from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // function called to log in - check API
  const authenticate = (email, password) => {
    setIsLoggedIn(true);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
